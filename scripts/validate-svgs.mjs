// Golden-standard gate: every crease pattern the repo ships (catalog SVG/FOLD +
// generated Foundry patterns) must import and FOLD cleanly in the solver — no
// missing creases, no NaN. This is what keeps the repo's SVGs a trustworthy
// standard for real-world folding. Exits non-zero if any pattern fails.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installDOM } from './domshim.mjs';

installDOM();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { PATTERN_CASES } = await import(path.join(root, 'src/app/fold/patternCatalog.ts'));
const { importSVG } = await import(path.join(root, 'src/app/fold/svgImport.ts'));
const { importFOLD } = await import(path.join(root, 'src/app/fold/foldFormat.ts'));
const { applyCuts } = await import(path.join(root, 'src/app/fold/kirigami.ts'));
const { createSolver, DEFAULT_PARAMS } = await import(path.join(root, 'src/app/fold/solver.ts'));
const { analyzeFlatFoldability } = await import(path.join(root, 'src/app/fold/foldability.ts'));
const { selfIntersectionCount } = await import(path.join(root, 'src/app/fold/collision.ts'));

const files = PATTERN_CASES.flatMap((g) => g.items.map((it) => it.file));
let fail = 0,
  flat = 0,
  shell = 0,
  penetrate = 0;
for (const file of files) {
  const abs = path.join(root, 'public/patterns', file);
  try {
    const text = fs.readFileSync(abs, 'utf8');
    let pattern = /\.fold$/i.test(file) ? importFOLD(text) : importSVG(text);
    pattern = applyCuts(pattern);
    const creases = pattern.edges.filter((e) => e.assignment === 'M' || e.assignment === 'V').length;
    if (!pattern.faces.length) throw new Error('no faces');
    if (!creases) throw new Error('no mountain/valley creases');
    const s = createSolver({ vertices: pattern.vertices, faces: pattern.faces, edges: pattern.edges }, { ...DEFAULT_PARAMS });
    s.setFoldPercent(0.85);
    s.step(300);
    const P = s.positions;
    for (let i = 0; i < P.length; i++) if (Number.isNaN(P[i])) throw new Error(`NaN at vertex ${Math.floor(i / 3)}`);
    if (analyzeFlatFoldability(pattern).flatFoldable) flat++;
    else shell++;
    // physical validity: re-fold to mid-fold (before flat layers stack) and check penetration
    s.setFoldPercent(0.7);
    s.step(300);
    if (selfIntersectionCount(s.positions, pattern.faces) > 0) {
      penetrate++;
      console.log(`  self-penetrates @70%: ${file}`);
    }
  } catch (e) {
    fail++;
    console.log(`FAIL  ${file} — ${e.message}`);
  }
}
console.log(`validate:svgs — ${files.length - fail}/${files.length} patterns fold cleanly${fail ? `, ${fail} FAILED` : ''}`);
console.log(`foldability — ${flat} flat-foldable, ${shell} 3D-shell (Maekawa + Kawasaki)`);
console.log(`physical — ${files.length - fail - penetrate} fold without self-penetration, ${penetrate} self-penetrate at 70% (compliant solver, no collision)`);
process.exit(fail ? 1 : 0);
