// Sync the "MIT prep" Obsidian vault into src/content/study/.
//
// Copies concepts/*.md and maps/*.md, rewriting Obsidian [[wiki-links]] into
// site-relative markdown links so the synced output is committed and CI can
// build without access to the vault. Run manually after vault updates:
//
//   npm run sync:study
//
// Link resolution:
//   [[slug]] / [[slug|label]]  -> /portfolio/study/<slug>/      (if concept exists)
//   [[map-slug|label]]         -> /portfolio/study/maps/<slug>/ (if map exists)
//   anything else (lectures, courses, resources not hosted here)
//                              -> <span class="wl-missing">label</span>
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, basename } from 'node:path';

const VAULT = process.env.MIT_PREP_VAULT ?? '/Users/heejinchae/Documents/Dev/Obsidian/MIT prep';
const OUT = new URL('../src/content/study/', import.meta.url).pathname;
const BASE = '/portfolio/';

const mdFiles = (dir) => readdirSync(dir).filter((f) => f.endsWith('.md'));

const conceptFiles = mdFiles(join(VAULT, 'concepts'));
const mapFiles = mdFiles(join(VAULT, 'maps'));
const conceptSlugs = new Set(conceptFiles.map((f) => f.replace(/\.md$/, '')));
const mapSlugs = new Set(mapFiles.map((f) => f.replace(/\.md$/, '')));

// slug -> frontmatter title, so bare [[slug]] links read as the note's title.
const titles = new Map();
for (const [dir, files] of [['concepts', conceptFiles], ['maps', mapFiles]]) {
  for (const f of files) {
    const head = readFileSync(join(VAULT, dir, f), 'utf8').slice(0, 600);
    const t = head.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (t) titles.set(f.replace(/\.md$/, ''), t[1]);
  }
}

function resolveLink(target, label) {
  // Obsidian resolves by filename: keep only the last path segment.
  const slug = target.split('/').pop().trim();
  const text = (label ?? titles.get(slug) ?? slug).trim();
  if (conceptSlugs.has(slug)) return `[${text}](${BASE}study/${slug}/)`;
  if (mapSlugs.has(slug)) return `[${text}](${BASE}study/maps/${slug}/)`;
  return `<span class="wl-missing" title="not published">${text}</span>`;
}

// Rewrite [[target]] / [[target|label]] outside fenced code blocks.
function rewriteBody(body) {
  const lines = body.split('\n');
  let inFence = false;
  return lines
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        return line;
      }
      if (inFence) return line;
      return line.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, t, l) => resolveLink(t, l));
    })
    .join('\n');
}

// Some vault notes have unquoted "key: value with: colon" scalars that js-yaml
// rejects. Quote title/summary values defensively.
function sanitizeFrontmatter(fm) {
  return fm.replace(/^(title|summary):\s*(.+)$/gm, (line, key, val) => {
    const v = val.trim();
    if (/^["']/.test(v) || !v.includes(': ')) return line;
    return `${key}: "${v.replace(/"/g, '\\"')}"`;
  });
}

function syncDir(srcDir, outDir, files) {
  mkdirSync(outDir, { recursive: true });
  for (const f of files) {
    const raw = readFileSync(join(srcDir, f), 'utf8');
    const m = raw.match(/^---\n[\s\S]*?\n---\n/);
    const fm = m ? sanitizeFrontmatter(m[0]) : '';
    const body = m ? raw.slice(fm.length) : raw;
    writeFileSync(join(outDir, basename(f)), fm + rewriteBody(body));
  }
}

rmSync(OUT, { recursive: true, force: true });
syncDir(join(VAULT, 'concepts'), join(OUT, 'concepts'), conceptFiles);
syncDir(join(VAULT, 'maps'), join(OUT, 'maps'), mapFiles);

console.log(`synced ${conceptFiles.length} concepts, ${mapFiles.length} maps -> src/content/study/`);
