// Sync the study ontology from the myownokf git submodule into the locations
// the Astro build expects. Source of truth = ontology/myownokf (a submodule);
// the copies are committed so CI (which cannot clone the private submodule)
// builds from them. With the submodule populated locally, this refreshes them.
import { cpSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SUB = join(root, 'ontology', 'myownokf');

if (!existsSync(join(SUB, 'study'))) {
  if (existsSync(join(root, 'src/content/study'))) {
    console.warn('myownokf submodule not populated — building from committed copies');
    process.exit(0);
  }
  console.error('myownokf submodule not populated — run: git submodule update --init --remote');
  process.exit(1);
}

// [fromSubmodule, toPortfolio]
const pairs = [
  ['study', 'src/content/study'], // authored concepts → Astro content collection
  ['bundle/study', 'public/okf'], // generated OKF study subtree → published static artifact
];
for (const [from, to] of pairs) {
  const dst = join(root, to);
  rmSync(dst, { recursive: true, force: true });
  mkdirSync(dirname(dst), { recursive: true });
  cpSync(join(SUB, from), dst, { recursive: true });
  console.log(`synced ontology/${from} -> ${to}`);
}
