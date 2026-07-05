// Regenerate default-parameter instances of every Foundry generator into
// public/patterns/generated/, so they appear in the shared pattern catalog
// (Lab Cases + /simulator). Run before dev/build so they never drift from the
// generators. Parametric control still lives in the Lab's Foundry tab.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { installDOM } from './domshim.mjs';

installDOM();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { GENERATORS, generatePattern } = await import(path.join(root, 'src/app/fold/patternGen.ts'));
const { importSVG } = await import(path.join(root, 'src/app/fold/svgImport.ts'));
const { analyzeFlatFoldability } = await import(path.join(root, 'src/app/fold/foldability.ts'));

const outDir = path.join(root, 'public/patterns/generated');
fs.mkdirSync(outDir, { recursive: true });
for (const g of GENERATORS) {
  let svg = generatePattern(g.id, {}); // default params
  // Stamp the real-world flat-foldability verdict into the file's legend.
  const r = analyzeFlatFoldability(importSVG(svg));
  const bad = r.vertices.filter((v) => !v.maekawaOk || !v.kawasakiOk).length;
  const verdict = r.flatFoldable
    ? `Flat-foldable: yes (Maekawa+Kawasaki hold at all ${r.interior} interior vertices).`
    : `Flat-foldable: no (folds to a 3D shell; ${bad}/${r.interior} interior vertices violate the theorems).`;
  svg = svg.replace('</desc>', ` ${verdict}</desc>`);
  fs.writeFileSync(path.join(outDir, `${g.id}.svg`), svg);
}
console.log(`gen:patterns wrote ${GENERATORS.length} crease patterns (with foldability verdict) → public/patterns/generated/`);
