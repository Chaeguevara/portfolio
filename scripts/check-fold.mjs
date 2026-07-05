// Solver self-check: fold two test patterns, assert convergence + sign convention.
// Run: npm run check:fold  (node 23+ strips TS types natively)
import { createSolver } from '../src/app/fold/solver.ts';
import assert from 'node:assert';

function dihedral(pos, faces, f1, f2, v3, v4) {
  const p = (i) => [pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const norm = (a) => {
    const l = Math.hypot(...a);
    return [a[0] / l, a[1] / l, a[2] / l];
  };
  const nrm = (f) => norm(cross(sub(p(f[1]), p(f[0])), sub(p(f[2]), p(f[0]))));
  const n1 = nrm(f1);
  const n2 = nrm(f2);
  const e = norm(sub(p(v4), p(v3)));
  return Math.atan2(dot(cross(n1, e), n2), dot(n1, n2));
}

// --- Test 1: single valley hinge (two triangles) ---
{
  const faces = [
    [0, 2, 3],
    [0, 1, 2],
  ];
  const input = {
    vertices: [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ],
    faces,
    edges: [
      { v1: 0, v2: 1, assignment: 'B', targetAngle: null },
      { v1: 1, v2: 2, assignment: 'B', targetAngle: null },
      { v1: 2, v2: 3, assignment: 'B', targetAngle: null },
      { v1: 3, v2: 0, assignment: 'B', targetAngle: null },
      { v1: 0, v2: 2, assignment: 'V', targetAngle: 180 },
    ],
  };
  const s = createSolver(input);
  s.setFoldPercent(0.9);
  s.step(4000);
  const theta = dihedral(s.positions, null, faces[0], faces[1], 0, 2);
  assert(!Number.isNaN(theta), 'valley: NaN dihedral');
  assert(Math.abs(theta - 0.9 * Math.PI) < 0.15, `valley: dihedral ${theta.toFixed(3)} != ${(0.9 * Math.PI).toFixed(3)}`);
  // valley folds the wings up: both apexes above the crease plane
  assert(s.positions[1 * 3 + 2] > 0.1 && s.positions[3 * 3 + 2] > 0.1, 'valley: apexes should rise (+z)');
  assert(s.strain() < 0.05, `valley: strain ${s.strain()}`);
  console.log(`ok  valley hinge  θ=${theta.toFixed(3)} target=${(0.9 * Math.PI).toFixed(3)} strain=${(s.strain() * 100).toFixed(2)}%`);
}

// --- Test 2: degree-4 single vertex, 3M/1V (flat-foldable bird-base corner) ---
{
  const R = 1;
  const vertices = [
    [0, 0], // center
    [R, 0],
    [0, R],
    [-R, 0],
    [0, -R],
    [R, R],
    [-R, R],
    [-R, -R],
    [R, -R],
  ];
  const faces = [
    [0, 1, 5],
    [0, 5, 2],
    [0, 2, 6],
    [0, 6, 3],
    [0, 3, 7],
    [0, 7, 4],
    [0, 4, 8],
    [0, 8, 1],
  ];
  const edges = [
    { v1: 0, v2: 1, assignment: 'M', targetAngle: -180 },
    { v1: 0, v2: 2, assignment: 'V', targetAngle: 180 },
    { v1: 0, v2: 3, assignment: 'M', targetAngle: -180 },
    { v1: 0, v2: 4, assignment: 'M', targetAngle: -180 },
    { v1: 0, v2: 5, assignment: 'F', targetAngle: 0 },
    { v1: 0, v2: 6, assignment: 'F', targetAngle: 0 },
    { v1: 0, v2: 7, assignment: 'F', targetAngle: 0 },
    { v1: 0, v2: 8, assignment: 'F', targetAngle: 0 },
    { v1: 1, v2: 5, assignment: 'B', targetAngle: null },
    { v1: 5, v2: 2, assignment: 'B', targetAngle: null },
    { v1: 2, v2: 6, assignment: 'B', targetAngle: null },
    { v1: 6, v2: 3, assignment: 'B', targetAngle: null },
    { v1: 3, v2: 7, assignment: 'B', targetAngle: null },
    { v1: 7, v2: 4, assignment: 'B', targetAngle: null },
    { v1: 4, v2: 8, assignment: 'B', targetAngle: null },
    { v1: 8, v2: 1, assignment: 'B', targetAngle: null },
  ];
  const s = createSolver({ vertices, faces, edges });
  s.setFoldPercent(0.7);
  s.step(6000);
  for (let i = 0; i < s.positions.length; i++) assert(!Number.isNaN(s.positions[i]), 'vertex NaN');
  assert(s.strain() < 0.05, `single-vertex: strain ${(s.strain() * 100).toFixed(2)}%`);
  // mountain creases negative dihedral, valley positive
  const adj = new Map();
  faces.forEach((f, fi) => {
    for (let k = 0; k < 3; k++) {
      const a = f[k];
      const b = f[(k + 1) % 3];
      const key = a < b ? `${a},${b}` : `${b},${a}`;
      if (!adj.has(key)) adj.set(key, []);
      adj.get(key).push(fi);
    }
  });
  for (const e of edges.slice(0, 4)) {
    const [f1i, f2i] = adj.get(`${e.v1},${e.v2}`);
    // orient: face1 contains directed edge v1→v2
    const has = (f) => {
      const t = faces[f];
      return (
        (t[0] === e.v1 && t[1] === e.v2) ||
        (t[1] === e.v1 && t[2] === e.v2) ||
        (t[2] === e.v1 && t[0] === e.v2)
      );
    };
    const [a, b] = has(f1i) ? [f1i, f2i] : [f2i, f1i];
    const th = dihedral(s.positions, null, faces[a], faces[b], e.v1, e.v2);
    if (e.assignment === 'M') assert(th < -0.5, `mountain crease dihedral ${th.toFixed(2)} should be < -0.5`);
    else assert(th > 0.5, `valley crease dihedral ${th.toFixed(2)} should be > 0.5`);
  }
  console.log(`ok  single vertex 3M/1V  strain=${(s.strain() * 100).toFixed(2)}%`);
}

// --- Test 3: FOLD import → solve → export → re-import round-trip ---
{
  const { importFOLD, exportFOLDText } = await import('../src/app/fold/foldFormat.ts');
  const foldFile = {
    file_spec: 1.1,
    vertices_coords: [[0, 0], [1, 0], [0, 1], [-1, 0], [0, -1], [1, 1], [-1, 1], [-1, -1], [1, -1]],
    edges_vertices: [[0, 1], [0, 2], [0, 3], [0, 4], [1, 5], [5, 2], [2, 6], [6, 3], [3, 7], [7, 4], [4, 8], [8, 1]],
    edges_assignment: ['M', 'V', 'M', 'M', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
    faces_vertices: [[0, 1, 5, 2], [0, 2, 6, 3], [0, 3, 7, 4], [0, 4, 8, 1]],
  };
  const p = importFOLD(JSON.stringify(foldFile));
  assert.equal(p.vertices.length, 9, 'FOLD import vertex count');
  assert.equal(p.faces.length, 8, 'FOLD import: 4 quads → 8 triangles');
  assert.equal(p.edges.filter((e) => e.assignment === 'F').length, 4, 'quad diagonals become F edges');
  assert.equal(p.edges.find((e) => e.assignment === 'M').targetAngle, -180, 'M defaults to −180°');
  assert.equal(p.edges.find((e) => e.assignment === 'V').targetAngle, 180, 'V defaults to +180°');

  const s = createSolver({ vertices: p.vertices, faces: p.faces, edges: p.edges });
  s.setFoldPercent(0.7);
  s.step(6000);
  assert(s.strain() < 0.05, `FOLD pattern strain ${(s.strain() * 100).toFixed(2)}%`);

  const text = exportFOLDText(p, s.positions);
  const parsed = JSON.parse(text);
  assert.equal(parsed.frame_classes[0], 'creasePattern');
  assert.equal(parsed.file_frames[0].frame_classes[0], 'foldedForm');
  assert.equal(parsed.file_frames[0].vertices_coords.length, 9);
  assert(
    parsed.file_frames[0].vertices_coords.some((c) => Math.abs(c[2]) > 0.05),
    'folded frame leaves the plane',
  );

  const back = importFOLD(text);
  assert.equal(back.vertices.length, p.vertices.length, 'round-trip vertex count');
  assert.equal(back.faces.length, p.faces.length, 'round-trip face count');
  assert.equal(back.edges.length, p.edges.length, 'round-trip edge count (F preserved, no new diagonals)');
  console.log('ok  FOLD round-trip: import → solve → export → re-import');
}

// --- Test 4: kirigami — a cut edge tears the sheet into separable pieces ---
{
  const { applyCuts } = await import('../src/app/fold/kirigami.ts');
  const p = {
    vertices: [[-1, -1], [1, -1], [1, 1], [-1, 1]],
    faces: [[0, 1, 2], [0, 2, 3]],
    edges: [
      { v1: 0, v2: 1, assignment: 'B', targetAngle: null },
      { v1: 1, v2: 2, assignment: 'B', targetAngle: null },
      { v1: 2, v2: 3, assignment: 'B', targetAngle: null },
      { v1: 3, v2: 0, assignment: 'B', targetAngle: null },
      { v1: 0, v2: 2, assignment: 'C', targetAngle: null }, // cut along the diagonal
    ],
    raw: { vertices: [], edges: [] },
    warnings: [],
  };
  const cut = applyCuts(p);
  assert.equal(cut.vertices.length, 6, `kirigami: expected 6 verts after tearing, got ${cut.vertices.length}`);
  const f0 = new Set(cut.faces[0]);
  const shared = cut.faces[1].filter((v) => f0.has(v));
  assert.equal(shared.length, 0, `kirigami: torn pieces must not share vertices (shared ${shared})`);
  assert.equal(cut.edges.filter((e) => e.assignment === 'C').length, 0, 'kirigami: no cut edges should remain');
  const s = createSolver({ vertices: cut.vertices, faces: cut.faces, edges: cut.edges });
  s.setFoldPercent(0.5);
  s.step(500);
  for (let i = 0; i < s.positions.length; i++) assert(!Number.isNaN(s.positions[i]), 'kirigami: NaN after solve');
  console.log(`ok  kirigami cut: 4 → ${cut.vertices.length} verts, pieces separated`);
}

// --- Test 5: 3D print kit — thickness-accommodated flat hinged sheet ---
{
  const { buildPrintKit, creaseGap, assemblyPlan, auxeticCutSVG } = await import('../src/app/fold/printKit.ts');
  assert.equal(creaseGap(2, 180, 'membrane'), 4, 'membrane crease gap @180° must be 2t');
  assert.ok(Math.abs(creaseGap(2, 90, 'tan') - 2) < 1e-9, 'tan crease gap @90° must be t');
  const pattern = {
    vertices: [[0, 0], [1, 0], [1, 1], [0, 1], [2, 0], [2, 1]],
    faces: [[0, 1, 2], [0, 2, 3], [1, 4, 5], [1, 5, 2]],
    edges: [
      { v1: 0, v2: 1, assignment: 'B', targetAngle: null }, { v1: 1, v2: 2, assignment: 'V', targetAngle: 180 },
      { v1: 2, v2: 3, assignment: 'B', targetAngle: null }, { v1: 3, v2: 0, assignment: 'B', targetAngle: null },
      { v1: 0, v2: 2, assignment: 'F', targetAngle: null }, { v1: 1, v2: 4, assignment: 'B', targetAngle: null },
      { v1: 4, v2: 5, assignment: 'B', targetAngle: null }, { v1: 5, v2: 2, assignment: 'B', targetAngle: null },
      { v1: 1, v2: 5, assignment: 'F', targetAngle: null },
    ],
    raw: { vertices: [], edges: [] }, warnings: [],
  };
  const kit = buildPrintKit(pattern, { thickness: 2, targetSize: 100, hingeModel: 'membrane' });
  const m = kit.manifest;
  assert.equal(m.panels, 2, 'expected 2 panels');
  assert.equal(m.creases, 1, 'expected 1 interior crease');
  assert.ok(Math.abs(m.creaseGap.max - 4) < 1e-6, 'crease gap must be 2t=4');
  assert.ok(m.supportFree && m.buildHeight === 2, 'kit must be flat + support-free');
  const pos = kit.geometry.getAttribute('position').array;
  for (let i = 2; i < pos.length; i += 3) assert.ok(pos[i] >= -1e-6 && pos[i] <= 2 + 1e-6, 'geometry not flat on bed');
  assert.ok(kit.stl.startsWith('solid') && kit.stl.includes('facet'), 'invalid STL');
  console.log(`ok  print kit (living): ${m.panels} panels, ${m.creases} crease, gap ${m.creaseGap.max}mm, support-free`);

  // pin-hinge mode: separate parts + knuckles, bed-nested
  const pk = buildPrintKit(pattern, { thickness: 2, targetSize: 100, hingeType: 'pin' });
  const pm = pk.manifest;
  assert.equal(pm.hingeType, 'pin');
  assert.equal(pm.parts, 2, 'pin: expected 2 separate parts');
  assert.ok(pm.knuckles >= 2, 'pin: expected butt-hinge knuckles');
  assert.ok(pm.boreDiameter > 1.75, 'pin: bore must be oversized past filament Ø');
  assert.ok(pm.supportFree && pm.plates >= 1, 'pin: flat + plated');
  assert.equal(pm.pinStyle, 'midlock', 'pin: default should include the mid-lock pin');
  assert.equal(pm.pins, 2, 'pin: mid-lock pin = 2 halves (male + female)');
  const pp = pk.geometry.getAttribute('position').array;
  for (let i = 0; i < pp.length; i++) assert.ok(!Number.isNaN(pp[i]), 'pin: NaN geometry');
  assert.ok(pk.stl.includes('facet'), 'pin: invalid STL');
  // 'rod' style omits the printed pin (filament rod supplied instead)
  const rodKit = buildPrintKit(pattern, { thickness: 2, hingeType: 'pin', pin: { style: 'rod' } });
  assert.equal(rodKit.manifest.pins, 0, 'rod style: no printed pin');
  console.log(`ok  print kit (pin): ${pm.parts} parts, ${pm.knuckles} knuckles, ${pm.pins} mid-lock pin halves, bore Ø${pm.boreDiameter}mm`);

  // assembly plan: numbered parts, hinge connections, spanning-tree sequence
  const plan = assemblyPlan(pattern);
  assert.equal(plan.parts.length, 2, 'assembly: 2 parts');
  assert.equal(plan.hinges.length, 1, 'assembly: 1 hinge connection');
  assert.equal(plan.sequence.length, 1, 'assembly: connected → parts-1 steps');
  assert.ok(plan.parts.every((p) => p.color.length === 3 && p.loop.length >= 3), 'assembly: parts need colour + outline');
  const s0 = plan.sequence[0];
  assert.ok(s0.onto !== s0.part && s0.hinge, 'assembly: step joins two distinct parts via a hinge');
  console.log(`ok  assembly plan: ${plan.parts.length} numbered parts, ${plan.hinges.length} hinge, ${plan.sequence.length}-step sequence`);

  // auxetic tilted-cut pattern SVG (the laser file)
  const sq = auxeticCutSVG('square', 4, 10, 1, 20);
  const nLines = (sq.match(/<line /g) || []).length;
  assert.ok(sq.startsWith('<svg') && sq.includes('<rect'), 'auxetic cut: valid SVG with border');
  assert.equal(nLines, 24, `auxetic square 4×4 should cut 24 interior segments, got ${nLines}`);
  assert.notEqual(auxeticCutSVG('square', 4, 10, 1, 0), sq, 'tilt θ must change the cut geometry');
  const tri = auxeticCutSVG('triangle', 4, 10, 1, 12);
  assert.ok(tri.startsWith('<svg') && (tri.match(/<line /g) || []).length > 0, 'auxetic triangle cut: has cut lines');
  console.log(`ok  auxetic cut SVG: square ${nLines} cuts + border, tilt-sensitive, triangle ok`);
}

// --- Test 6: bidirectional Yoshimura oval — ONE connected sheet → ellipsoid ---
{
  const { buildGore } = await import('../src/app/fold/gore.ts');
  const N = 8, M = 6, aspect = 1.4, r = 1, c = aspect * r;
  const g = buildGore(N, M, aspect, r);
  assert.equal(g.nV, (M + 1) * (N + 1), `yoshi vert count: ${g.nV}`);
  // the fix: it must be ONE connected sheet (union-find over the face graph)
  const parent = Array.from({ length: g.nV }, (_, i) => i);
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  for (let f = 0; f < g.faces.length; f += 3) {
    parent[find(g.faces[f])] = find(g.faces[f + 1]);
    parent[find(g.faces[f + 1])] = find(g.faces[f + 2]);
  }
  const roots = new Set();
  for (let f = 0; f < g.faces.length; f++) roots.add(find(g.faces[f]));
  assert.equal(roots.size, 1, `must be ONE connected sheet, got ${roots.size} components`);
  g.update(0);
  let flatOk = true;
  for (let v = 0; v < g.nV; v++) if (Math.abs(g.grid[v * 3 + 1]) > 1e-9) flatOk = false;
  assert.ok(flatOk, 'yoshi fold=0 must be a flat sheet (y=0)');
  g.update(1);
  let maxErr = 0;
  for (let v = 0; v < g.nV; v++) {
    const x = g.grid[v * 3], y = g.grid[v * 3 + 1], z = g.grid[v * 3 + 2];
    maxErr = Math.max(maxErr, Math.abs((x * x + z * z) / (r * r) + (y * y) / (c * c) - 1));
  }
  assert.ok(maxErr < 1e-6, `yoshi fold=1 must lie on the ellipsoid, maxErr ${maxErr}`);
  console.log(`ok  yoshimura oval: ${g.nV} verts, ONE connected sheet, flat → ellipsoid (err ${maxErr.toExponential(1)})`);
}

// --- Test 7: Pattern Foundry — every generator emits a pattern that FOLDS ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { GENERATORS, generatePattern } = await import('../src/app/fold/patternGen.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  for (const g of GENERATORS) {
    const svg = generatePattern(g.id, {});
    const p = importSVG(svg);
    assert.ok(p.faces.length > 0 && p.edges.some((e) => e.assignment === 'M' || e.assignment === 'V'), `${g.id}: no creases`);
    const s = createSolver({ vertices: p.vertices, faces: p.faces, edges: p.edges });
    const minDim = (pct) => {
      s.setFoldPercent(pct);
      s.step(500);
      const P = s.positions;
      let mn = [9, 9, 9], mx = [-9, -9, -9];
      for (let i = 0; i < P.length; i++) {
        assert.ok(!Number.isNaN(P[i]), `${g.id}: NaN`);
        const a = i % 3;
        mn[a] = Math.min(mn[a], P[i]);
        mx[a] = Math.max(mx[a], P[i]);
      }
      return Math.min(mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]);
    };
    const flat = minDim(0), folded = minDim(0.85);
    assert.ok(folded > flat + 0.05, `${g.id}: pattern must leave the plane when folded (flat ${flat.toFixed(2)} → ${folded.toFixed(2)})`);
    console.log(`ok  foundry ${g.id.padEnd(10)}: folds (curl depth ${folded.toFixed(2)}, ${p.edges.filter((e) => e.assignment === 'M' || e.assignment === 'V').length} creases)`);
  }
}

// --- Test 8: material / thickness — thick stock caps the fold, folds less far ---
{
  const { MATERIALS, getMaterial, foldCapDeg, capFoldAngles } = await import('../src/app/fold/material.ts');
  assert.ok(foldCapDeg(0.1) > foldCapDeg(2) && foldCapDeg(2) > foldCapDeg(3), 'fold cap must decrease with thickness');
  assert.equal(foldCapDeg(2), 150, 'cardboard (2mm) caps at 150°');
  // cap clamps a flat (180°) crease, sign-correct
  const flatCrease = { vertices: [[0, 0], [1, 0]], faces: [], edges: [{ v1: 0, v2: 1, assignment: 'V', targetAngle: 180 }, { v1: 0, v2: 1, assignment: 'M', targetAngle: -180 }], raw: {}, warnings: [] };
  const capped = capFoldAngles(flatCrease, 150);
  assert.equal(capped.edges[0].targetAngle, 150, 'valley +180 → +150');
  assert.equal(capped.edges[1].targetAngle, -150, 'mountain −180 → −150');
  // physical: one flat-folding hinge — paper closes further than cardboard
  const hinge = {
    vertices: [[0, 0], [2, 0], [1, 1], [1, -1]],
    faces: [[0, 1, 2], [0, 3, 1]],
    edges: [
      { v1: 0, v2: 1, assignment: 'V', targetAngle: 180 },
      { v1: 0, v2: 2, assignment: 'B', targetAngle: 0 },
      { v1: 1, v2: 2, assignment: 'B', targetAngle: 0 },
      { v1: 0, v2: 3, assignment: 'B', targetAngle: 0 },
      { v1: 1, v2: 3, assignment: 'B', targetAngle: 0 },
    ],
    raw: {},
    warnings: [],
  };
  const apexGap = (mat) => {
    const p = capFoldAngles(hinge, foldCapDeg(mat.thickness));
    const s = createSolver({ vertices: p.vertices, faces: p.faces, edges: p.edges }, mat.solver);
    s.setFoldPercent(1);
    s.step(800);
    const P = s.positions;
    return Math.hypot(P[6] - P[9], P[7] - P[10], P[8] - P[11]); // dist(vertex2, vertex3)
  };
  const gPaper = apexGap(getMaterial('paper')), gCard = apexGap(getMaterial('cardboard'));
  assert.ok(gCard > gPaper, `cardboard must close less than paper (card gap ${gCard.toFixed(3)} > paper ${gPaper.toFixed(3)})`);
  console.log(`ok  material: ${MATERIALS.length} stocks · cap paper ${foldCapDeg(0.1)}° / cardboard ${foldCapDeg(2)}° · cardboard closes less (gap ${gCard.toFixed(2)} vs ${gPaper.toFixed(2)})`);
}

// --- Test 9: importer is order-invariant — same geometry regardless of line order ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { generatePattern } = await import('../src/app/fold/patternGen.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  const svg = generatePattern('yoshimura', {});
  const lines = [...svg.matchAll(/<line[^>]*\/>/g)].map((m) => m[0]);
  const wrap = (ls) => '<svg xmlns="http://www.w3.org/2000/svg">' + ls.join('') + '</svg>';
  const mv = (p) => p.edges.filter((e) => e.assignment === 'M' || e.assignment === 'V').length;
  const a = importSVG(wrap(lines));
  const b = importSVG(wrap([...lines].reverse()));
  assert.equal(mv(a), mv(b), `crease count must be order-invariant (${mv(a)} vs ${mv(b)})`);
  assert.equal(a.edges.length, b.edges.length, 'edge count must be order-invariant');
  assert.equal(a.faces.length, b.faces.length, 'face count must be order-invariant');
  console.log(`ok  importer order-invariant: ${mv(a)} creases both directions`);
}

// --- Test 10: flat-foldability theorems (Maekawa + Kawasaki) ---
{
  const { maekawa, kawasaki, analyzeFlatFoldability } = await import('../src/app/fold/foldability.ts');
  // primitives
  assert.ok(kawasaki([120, 60, 60, 120]) && !kawasaki([80, 100, 80, 100]), 'Kawasaki angle test');
  assert.ok(maekawa(3, 1) && !maekawa(2, 2), 'Maekawa M/V count test');
  // synthetic single-vertex patterns (outer ring = boundary so only the centre is interior)
  const d2r = (d) => (d * Math.PI) / 180;
  const mk = (angles, mv) => {
    const vertices = [[0, 0], ...angles.map((a) => [Math.cos(d2r(a)), Math.sin(d2r(a))])];
    const edges = angles.map((a, i) => ({ v1: 0, v2: i + 1, assignment: mv[i], targetAngle: mv[i] === 'M' ? -180 : 180 }));
    for (let i = 0; i < angles.length; i++) edges.push({ v1: i + 1, v2: ((i + 1) % angles.length) + 1, assignment: 'B', targetAngle: 0 });
    return { vertices, faces: [], edges, raw: {}, warnings: [] };
  };
  assert.ok(analyzeFlatFoldability(mk([0, 120, 180, 240], ['M', 'M', 'M', 'V'])).flatFoldable, 'valid vertex must be flat-foldable');
  assert.ok(!analyzeFlatFoldability(mk([0, 80, 180, 260], ['M', 'M', 'M', 'V'])).flatFoldable, 'sector violation must fail Kawasaki');
  assert.ok(!analyzeFlatFoldability(mk([0, 120, 180, 240], ['M', 'M', 'V', 'V'])).flatFoldable, '2M/2V must fail Maekawa');
  console.log('ok  flat-foldability: Maekawa + Kawasaki (valid passes, bad-angle & bad-parity fail)');
}

// --- Test 11: every generated pattern has a CLOSED cut outline (laser-ready) ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { GENERATORS, generatePattern } = await import('../src/app/fold/patternGen.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  for (const g of GENERATORS) {
    const p = importSVG(generatePattern(g.id, {}));
    const bdeg = new Map();
    for (const e of p.edges)
      if (e.assignment === 'B') {
        bdeg.set(e.v1, (bdeg.get(e.v1) ?? 0) + 1);
        bdeg.set(e.v2, (bdeg.get(e.v2) ?? 0) + 1);
      }
    assert.ok(bdeg.size > 0, `${g.id}: has no border/outline edges (piece can't be cut out)`);
    const open = [...bdeg.values()].filter((d) => d % 2 !== 0).length;
    assert.equal(open, 0, `${g.id}: cut outline must be a closed loop — ${open} vertices have dangling border edges`);
    console.log(`ok  ${g.id.padEnd(11)} closed cut outline (${bdeg.size} border vertices)`);
  }
}

// --- Test 12: FOLD export is lossless (all edge types + faces round-trip) ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { generatePattern } = await import('../src/app/fold/patternGen.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  const { exportFOLDText, importFOLD } = await import('../src/app/fold/foldFormat.ts');
  const tally = (p) => {
    const t = {};
    for (const e of p.edges) t[e.assignment] = (t[e.assignment] ?? 0) + 1;
    return t;
  };
  const p1 = importSVG(generatePattern('gluelessBox', {})); // exercises B, C, V, F edge types
  const p2 = importFOLD(exportFOLDText(p1));
  const t1 = tally(p1), t2 = tally(p2);
  for (const k of Object.keys(t1)) assert.equal(t2[k], t1[k], `FOLD round-trip must preserve ${k} edges (${t1[k]} → ${t2[k] ?? 0})`);
  assert.equal(p2.faces.length, p1.faces.length, 'FOLD round-trip must preserve face count');
  console.log(`ok  FOLD export lossless: ${Object.entries(t1).map(([k, v]) => `${k}:${v}`).join(' ')} + ${p1.faces.length} faces round-trip`);
}

// --- Test 13: every fold/laser SVG emitter conforms to the golden format ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { generatePattern } = await import('../src/app/fold/patternGen.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  const { exportPatternSVG } = await import('../src/app/fold/svgExport.ts');
  const { auxeticCutSVG } = await import('../src/app/fold/printKit.ts');
  const golden = (label, svg, { mm = true, score = true } = {}) => {
    assert.ok(!/stroke-opacity/.test(svg), `${label}: must use element opacity, not stroke-opacity`);
    assert.ok(/<title>/.test(svg) && /<desc>/.test(svg), `${label}: must have title + desc legend`);
    assert.ok(/<g id="cut"/.test(svg), `${label}: must have a cut layer`);
    if (score) assert.ok(/<g id="score"/.test(svg), `${label}: must have a score layer`);
    if (mm) assert.ok(/width="[\d.]+mm"/.test(svg), `${label}: must declare mm scale`);
  };
  golden('generator', generatePattern('yoshimura', {}));
  golden('loaded-export', exportPatternSVG(importSVG(generatePattern('miuraTube', {}))), { mm: false });
  golden('kirigami-cut', auxeticCutSVG('square', 4, 10, 1, 20), { score: false });
  console.log('ok  golden format: generators + loaded-export + kirigami cut all conform');
}

// --- Test 14: generated patterns fold without self-penetration (physical validity) ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { GENERATORS, generatePattern } = await import('../src/app/fold/patternGen.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  const { selfIntersectionCount } = await import('../src/app/fold/collision.ts');
  for (const g of GENERATORS) {
    const p = importSVG(generatePattern(g.id, {}));
    const s = createSolver({ vertices: p.vertices, faces: p.faces, edges: p.edges });
    s.setFoldPercent(0.7); // mid-fold — before flat layers stack coplanar (which false-positives)
    s.step(500);
    const hits = selfIntersectionCount(s.positions, p.faces);
    assert.equal(hits, 0, `${g.id}: folds through itself (${hits} penetrating triangle pairs at 70%)`);
  }
  console.log('ok  self-intersection: all generators fold cleanly (no panel passes through another)');
}

// --- Test 15: generators stay golden across their parameter ranges ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { GENERATORS, generatePattern } = await import('../src/app/fold/patternGen.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  const { analyzeFlatFoldability } = await import('../src/app/fold/foldability.ts');
  for (const g of GENERATORS) {
    // every generator must stay golden at each param's min & max (+ default)
    const combos = [{}, ...g.params.flatMap((pr) => [{ [pr.key]: pr.min }, { [pr.key]: pr.max }])];
    const defaultFlat = analyzeFlatFoldability(importSVG(generatePattern(g.id, {}))).flatFoldable;
    for (const params of combos) {
      const p = importSVG(generatePattern(g.id, params));
      const bd = new Map();
      for (const e of p.edges) if (e.assignment === 'B') for (const v of [e.v1, e.v2]) bd.set(v, (bd.get(v) ?? 0) + 1);
      const open = [...bd.values()].filter((d) => d % 2).length;
      assert.equal(open, 0, `${g.id} ${JSON.stringify(params)}: open cut outline (${open} dangling border vertices)`);
      // flat-foldability class must be stable across the parameter range
      if (defaultFlat) assert.ok(analyzeFlatFoldability(p).flatFoldable, `${g.id} ${JSON.stringify(params)}: lost flat-foldability`);
      const s = createSolver({ vertices: p.vertices, faces: p.faces, edges: p.edges });
      s.setFoldPercent(0.7);
      s.step(300);
      for (let i = 0; i < s.positions.length; i++) assert.ok(!Number.isNaN(s.positions[i]), `${g.id} ${JSON.stringify(params)}: NaN when folded`);
    }
  }
  console.log('ok  generators golden across param ranges (closed outline + folds + stable flat-foldability)');
}

// --- Test 16: "Kirigami (cuts)" patterns actually have cuts that tear ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const fs = await import('node:fs');
  const { PATTERN_CASES } = await import('../src/app/fold/patternCatalog.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  const { importFOLD } = await import('../src/app/fold/foldFormat.ts');
  const { applyCuts } = await import('../src/app/fold/kirigami.ts');
  const kiri = PATTERN_CASES.find((g) => g.group === 'Kirigami (cuts)');
  assert.ok(kiri && kiri.items.length, 'Kirigami (cuts) group must exist and be non-empty');
  for (const it of kiri.items) {
    const txt = fs.readFileSync(`public/patterns/${it.file}`, 'utf8');
    const p = /\.fold$/i.test(it.file) ? importFOLD(txt) : importSVG(txt);
    const cuts = p.edges.filter((e) => e.assignment === 'C').length;
    assert.ok(cuts > 0, `${it.file}: in "Kirigami (cuts)" group but has NO cut edges — miscategorized`);
    assert.ok(applyCuts(p).vertices.length > p.vertices.length, `${it.file}: cuts present but applyCuts does not tear the sheet`);
  }
  console.log(`ok  kirigami: all ${kiri.items.length} "Kirigami (cuts)" patterns have cuts that tear`);
}

// --- Test 17: importers handle malformed/degenerate input gracefully ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  const { importFOLD } = await import('../src/app/fold/foldFormat.ts');
  const svg = (b) => `<svg xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
  const cases = [
    () => importSVG(svg('')), // no lines
    () => importSVG(svg('<line x1="0" y1="0" x2="10" y2="0" stroke="#000"/>')), // single line, no face
    () => importSVG(svg('<line x1="5" y1="5" x2="5" y2="5" stroke="#f00"/><line x1="0" y1="0" x2="10" y2="0" stroke="#000"/><line x1="0" y1="0" x2="0" y2="10" stroke="#000"/><line x1="10" y1="0" x2="0" y2="10" stroke="#f00"/>')), // zero-length edge
    () => importFOLD('{}'), // empty FOLD
    () => importFOLD('not json'), // garbage
    () => importFOLD(JSON.stringify({ vertices_coords: [[0, 0], [1, 0], [0, 1]], edges_vertices: [[0, 1], [1, 2], [2, 0]], faces_vertices: [[0, 1, 2]] })), // no edges_assignment
  ];
  for (const [i, fn] of cases.entries()) {
    let p;
    try {
      p = fn();
    } catch {
      continue; // threw cleanly = graceful
    }
    if (p && p.faces?.length) {
      const s = createSolver({ vertices: p.vertices, faces: p.faces, edges: p.edges });
      s.setFoldPercent(0.7);
      s.step(200);
      for (let j = 0; j < s.positions.length; j++) assert.ok(Number.isFinite(s.positions[j]), `malformed case ${i}: solver produced NaN/Inf (should throw on import or fold safely)`);
    }
  }
  console.log('ok  importers robust: malformed input throws cleanly or folds NaN-free');
}

// --- Test 18: FOLD export foldAngle sign convention is correct per edge type ---
{
  const { installDOM } = await import('./domshim.mjs');
  installDOM();
  const { generatePattern } = await import('../src/app/fold/patternGen.ts');
  const { importSVG } = await import('../src/app/fold/svgImport.ts');
  const { exportFOLDText } = await import('../src/app/fold/foldFormat.ts');
  const f = JSON.parse(exportFOLDText(importSVG(generatePattern('gluelessBox', {})))); // has B, C, V, F
  f.edges_assignment.forEach((a, i) => {
    const ang = f.edges_foldAngle[i];
    if (a === 'M') assert.ok(ang <= 0, `mountain foldAngle must be ≤ 0, got ${ang}`);
    else if (a === 'V') assert.ok(ang >= 0, `valley foldAngle must be ≥ 0, got ${ang}`);
    else if (a === 'B') assert.equal(ang, 0, `border foldAngle must be 0 (flat), got ${ang}`);
    else if (a === 'F') assert.equal(ang, 0, `facet foldAngle must be 0, got ${ang}`);
    else if (a === 'C') assert.equal(ang, null, `cut foldAngle must be null, got ${ang}`);
  });
  console.log('ok  FOLD foldAngle convention: M≤0 · V≥0 · B=0 · F=0 · C=null');
}

console.log('check:fold passed');
