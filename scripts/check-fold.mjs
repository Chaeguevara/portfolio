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

console.log('check:fold passed');
