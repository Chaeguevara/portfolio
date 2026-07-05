/**
 * Pattern Foundry — parametric crease-pattern GENERATORS. Each returns a flat
 * crease pattern as an origamisimulator-convention SVG (red mountain / blue
 * valley / black border, stroke-opacity = fold-angle fraction). The OUTPUT IS THE
 * PATTERN — fold it in this app's solver, in origamisimulator.org, or on a real
 * cutter. No 3D export here; the flat sheet is the product.
 *
 * Every generator is exercised by scripts/check-fold.mjs, which imports the SVG
 * and folds it with the compliant solver to confirm it actually folds (no NaN,
 * leaves the plane).
 */

const M = '#ff0000', V = '#0000ff', B = '#000000';

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  c: string;
  op?: number;
}
function svgOf(segs: Seg[]): string {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of segs) {
    minX = Math.min(minX, s.x1, s.x2);
    maxX = Math.max(maxX, s.x1, s.x2);
    minY = Math.min(minY, s.y1, s.y2);
    maxY = Math.max(maxY, s.y1, s.y2);
  }
  const w = maxX - minX || 1, h = maxY - minY || 1;
  const b = Math.max(w, h) * 0.03;
  const sw = (Math.max(w, h) / 200).toFixed(3);
  // fold angle is the element `opacity` (origamisimulator convention); reads `opacity`.
  const lineStr = (s: Seg) => {
    const op = s.c === M || s.c === V ? ` opacity="${(s.op ?? 1).toFixed(3)}"` : '';
    return `    <line x1="${(s.x1 - minX).toFixed(2)}" y1="${(s.y1 - minY).toFixed(2)}" x2="${(s.x2 - minX).toFixed(2)}" y2="${(s.y2 - minY).toFixed(2)}" stroke="${s.c}"${op}/>`;
  };
  // Laser layers: border + kirigami cuts = CUT-THROUGH; M/V/facet = SCORE (fold).
  // Grouping is non-destructive — the folder still reads every line; a cutter reads the layers.
  const isCut = (c: string) => c === B || c === '#00ff00';
  const cut = segs.filter((s) => isCut(s.c)).map(lineStr);
  const score = segs.filter((s) => !isCut(s.c)).map(lineStr);
  // Golden-standard, real-world ready: physical mm size (1 unit = 1 mm) so the file
  // prints/cuts at true scale, plus a self-documenting legend inside the file.
  const vbw = w + 2 * b, vbh = h + 2 * b;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${vbw.toFixed(1)}mm" height="${vbh.toFixed(1)}mm" viewBox="${(-b).toFixed(2)} ${(-b).toFixed(2)} ${vbw.toFixed(2)} ${vbh.toFixed(2)}" fill="none" stroke-width="${sw}" stroke-linecap="round">`,
    `  <title>Foldable crease pattern</title>`,
    `  <desc>origamisimulator convention: stroke #ff0000=mountain, #0000ff=valley, #000000=border, #00ff00=cut, #ffff00=facet; line opacity = fold angle (1.0=180deg, 0.5=90deg). Scale: 1 unit = 1 mm. Laser: layer "cut" = cut-through, layer "score" = fold/score.</desc>`,
    `  <g id="cut" data-laser="cut">`,
    ...cut,
    `  </g>`,
    `  <g id="score" data-laser="score">`,
    ...score,
    `  </g>`,
    `</svg>`,
    '',
  ].join('\n');
}

export interface FoundryParam {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  default: number;
}
export interface Generator {
  id: string;
  label: string;
  params: FoundryParam[];
  make: (p: Record<string, number>) => string;
}

/* ---------- Yoshimura barrel / oval (single sheet → rounded barrel) ---------- */
function yoshimura(p: Record<string, number>): string {
  const n = Math.round(p.n),
    m = Math.round(p.m),
    taper = p.taper,
    op = p.angle;
  const w = 10,
    h = 8;
  const s = (i: number) => Math.max(0.35, 1 - taper * (1 - Math.sin((Math.PI * i) / m))); // barrel: mid wide, ends narrow (floor keeps ends from degenerating → outline stays closed)
  const X = (i: number, j: number) => (j + (i % 2 ? 0.5 : 0) - n / 2) * w * s(i);
  const Y = (i: number) => i * h;
  const segs: Seg[] = [];
  for (let i = 0; i <= m; i++)
    for (let j = 0; j < n; j++) segs.push({ x1: X(i, j), y1: Y(i), x2: X(i, j + 1), y2: Y(i), c: i === 0 || i === m ? B : M, op });
  for (let i = 0; i < m; i++)
    for (let j = 0; j <= n; j++) {
      // j=0 / j=n verticals are the left/right outline → border (was duplicated as a
      // separate B loop, which collided with these V diagonals and lost the outline).
      const side = j === 0 || j === n;
      if (i % 2 === 0) {
        if (j > 0) segs.push({ x1: X(i, j), y1: Y(i), x2: X(i + 1, j - 1), y2: Y(i + 1), c: V, op });
        segs.push({ x1: X(i, j), y1: Y(i), x2: X(i + 1, j), y2: Y(i + 1), c: side ? B : V, op });
      } else {
        segs.push({ x1: X(i, j), y1: Y(i), x2: X(i + 1, j), y2: Y(i + 1), c: side ? B : V, op });
        if (j < n) segs.push({ x1: X(i, j), y1: Y(i), x2: X(i + 1, j + 1), y2: Y(i + 1), c: V, op });
      }
    }
  return svgOf(segs);
}

/* ---------- Kresling twisted tower (bistable / self-locking) ---------- */
function kresling(p: Record<string, number>): string {
  const n = Math.round(p.n),
    m = Math.round(p.m),
    twist = p.twist / 100, // 0..1 shear of one cell per tier
    op = p.angle;
  const w = 10,
    h = 8;
  const X = (i: number, j: number) => (j + i * twist - n / 2) * w; // progressive shear = twist
  const Y = (i: number) => i * h;
  const segs: Seg[] = [];
  for (let i = 0; i <= m; i++) for (let j = 0; j < n; j++) segs.push({ x1: X(i, j), y1: Y(i), x2: X(i, j + 1), y2: Y(i), c: i === 0 || i === m ? B : M, op });
  for (let i = 0; i < m; i++)
    for (let j = 0; j <= n; j++) {
      // left/right seam verticals are the outline → border/cut; interior verticals fold
      segs.push({ x1: X(i, j), y1: Y(i), x2: X(i + 1, j), y2: Y(i + 1), c: j === 0 || j === n ? B : M, op });
      if (j < n) segs.push({ x1: X(i, j), y1: Y(i), x2: X(i + 1, j + 1), y2: Y(i + 1), c: V, op }); // diagonal
    }
  return svgOf(segs);
}

/* ---------- Miura tube (herringbone that rolls into a tube) ---------- */
function miuraTube(p: Record<string, number>): string {
  const n = Math.round(p.n),
    m = Math.round(p.m),
    slant = p.slant, // horizontal zigzag amplitude fraction
    op = p.angle;
  const w = 10,
    h = 8;
  const X = (i: number, j: number) => j * w + (i % 2 ? slant * w : 0);
  const Y = (i: number) => i * h;
  const segs: Seg[] = [];
  // Flat-foldable Miura M/V (Maekawa 3-1 at every vertex): horizontals all mountain,
  // verticals alternate BY ROW so a vertex's up/down verticals are opposite →
  // 2 mountains (horiz) + 1 mountain + 1 valley (vert) = 3M+1V. Outline = border.
  for (let j = 0; j <= n; j++)
    for (let i = 0; i < m; i++) segs.push({ x1: X(i, j), y1: Y(i), x2: X(i + 1, j), y2: Y(i + 1), c: j === 0 || j === n ? B : i % 2 ? M : V, op });
  for (let i = 0; i <= m; i++)
    for (let j = 0; j < n; j++) segs.push({ x1: X(i, j), y1: Y(i), x2: X(i, j + 1), y2: Y(i), c: i === 0 || i === m ? B : M, op });
  // facet diagonals (yellow, stay flat): pin the quad triangulation so the physical
  // fold matches the simulation — a quad's two triangulations are different models.
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) segs.push({ x1: X(i, j), y1: Y(i), x2: X(i + 1, j + 1), y2: Y(i + 1), c: '#ffff00' });
  return svgOf(segs);
}

/* ---------- Waterbomb tessellation (flat-foldable, degree-6 molecule) ---------- */
function waterbomb(p: Record<string, number>): string {
  // Real waterbomb structure: checkerboard lattice (i+j even), every interior
  // vertex degree-6 (2 vertical mountains + 4 diagonal valleys) → sectors
  // 45/45/90/45/45/90, Maekawa 2M-4V, Kawasaki holds. Verified flat-foldable.
  const N = Math.round(p.n),
    Mr = Math.round(p.m),
    op = p.angle,
    cs = 10;
  const has = (i: number, j: number) => i >= 0 && i <= N && j >= 0 && j <= Mr && (i + j) % 2 === 0;
  // Count triangle usage per edge so the outline (edges in one triangle) becomes a
  // border/cut, not a scored crease. Every triangle has exactly one vertical edge.
  type Pt = [number, number];
  const edges = new Map<string, { a: Pt; b: Pt; count: number }>();
  const key = (a: Pt, b: Pt) => (a[0] < b[0] || (a[0] === b[0] && a[1] <= b[1]) ? `${a[0]},${a[1]}_${b[0]},${b[1]}` : `${b[0]},${b[1]}_${a[0]},${a[1]}`);
  const addEdge = (a: Pt, b: Pt) => {
    const k = key(a, b);
    const e = edges.get(k) ?? { a, b, count: 0 };
    e.count++;
    edges.set(k, e);
  };
  const addTri = (p1: Pt, p2: Pt, p3: Pt) => {
    addEdge(p1, p2);
    addEdge(p2, p3);
    addEdge(p3, p1);
  };
  for (let i = 0; i <= N; i++)
    for (let j = 0; j <= Mr; j++) {
      if ((i + j) % 2 || !has(i, j + 2)) continue;
      if (has(i + 1, j + 1)) addTri([i, j], [i, j + 2], [i + 1, j + 1]);
      if (has(i - 1, j + 1)) addTri([i, j], [i, j + 2], [i - 1, j + 1]);
    }
  const segs: Seg[] = [];
  for (const e of edges.values()) {
    const border = e.count === 1; // outline edge → cut
    const vertical = e.a[0] === e.b[0]; // interior vertical = mountain, diagonal = valley
    segs.push({ x1: e.a[0] * cs, y1: e.a[1] * cs, x2: e.b[0] * cs, y2: e.b[1] * cs, c: border ? B : vertical ? M : V, op: border ? undefined : op });
  }
  return svgOf(segs);
}

/* ---------- Glueless carton (base + walls fold up 90°, corner tuck-tabs) ---------- */
function gluelessBox(p: Record<string, number>): string {
  const W = p.w,
    D = p.d,
    H = p.h,
    t = p.tab,
    op = 0.5; // 0.5 opacity = 90° walls
  const f = Math.max(3, H * 0.7); // lock-flap depth
  // rectangles: base, 4 walls, 4 side-wall tabs, a lid off the back wall, and a
  // lock flap off the lid that folds down the front and tucks into the slot.
  const rects: [number, number, number, number][] = [
    [0, 0, W, D],
    [0, -H, W, 0],
    [0, D, W, D + H],
    [-H, 0, 0, D],
    [W, 0, W + H, D],
    [-H, -t, 0, 0],
    [-H, D, 0, D + t],
    [W, -t, W + H, 0],
    [W, D, W + H, D + t],
    [0, D + H, W, D + H + D], // lid (folds forward over the top)
    [0, D + H + D, W, D + H + D + f], // lock flap (folds down the front)
  ];
  // Robust border/crease classification: split every rect edge at all grid
  // coordinates (T-junctions from overlapping tabs), then sample both sides —
  // covered↔uncovered = border/cut, covered↔covered = fold crease. Order-free.
  const xs = new Set<number>(), ys = new Set<number>();
  for (const [x0, y0, x1, y1] of rects) {
    xs.add(x0);
    xs.add(x1);
    ys.add(y0);
    ys.add(y1);
  }
  const xa = [...xs].sort((a, b) => a - b),
    ya = [...ys].sort((a, b) => a - b);
  const eps = 1e-3;
  const inRect = (px: number, py: number) => rects.some(([x0, y0, x1, y1]) => px > Math.min(x0, x1) + eps / 2 && px < Math.max(x0, x1) - eps / 2 && py > Math.min(y0, y1) + eps / 2 && py < Math.max(y0, y1) - eps / 2);
  const key = (a: number, b: number, c: number, d: number) => (a < c || (a === c && b <= d) ? `${a},${b},${c},${d}` : `${c},${d},${a},${b}`);
  const edgeMap = new Map<string, Seg>();
  for (const [x0, y0, x1, y1] of rects) {
    for (const y of [y0, y1]) {
      const pts = xa.filter((x) => x >= Math.min(x0, x1) - eps && x <= Math.max(x0, x1) + eps);
      for (let i = 0; i < pts.length - 1; i++) {
        const mx = (pts[i] + pts[i + 1]) / 2;
        const c = inRect(mx, y + eps) !== inRect(mx, y - eps) ? B : inRect(mx, y + eps) && inRect(mx, y - eps) ? V : null;
        if (c) edgeMap.set(key(pts[i], y, pts[i + 1], y), { x1: pts[i], y1: y, x2: pts[i + 1], y2: y, c, ...(c === V ? { op } : {}) });
      }
    }
    for (const x of [x0, x1]) {
      const pts = ya.filter((yy) => yy >= Math.min(y0, y1) - eps && yy <= Math.max(y0, y1) + eps);
      for (let i = 0; i < pts.length - 1; i++) {
        const my = (pts[i] + pts[i + 1]) / 2;
        const c = inRect(x - eps, my) !== inRect(x + eps, my) ? B : inRect(x - eps, my) && inRect(x + eps, my) ? V : null;
        if (c) edgeMap.set(key(x, pts[i], x, pts[i + 1]), { x1: x, y1: pts[i], x2: x, y2: pts[i + 1], c, ...(c === V ? { op } : {}) });
      }
    }
  }
  const segs: Seg[] = [...edgeMap.values()];
  // facet diagonals (yellow) pin each panel's triangulation → deterministic fold.
  // Skip the front wall (rect 1) — it carries the slot cut; a crossing diagonal slivers it.
  rects.forEach(([x0, y0, x1, y1], i) => {
    if (i !== 1) segs.push({ x1: x0, y1: y0, x2: x1, y2: y1, c: '#ffff00' });
  });
  // slot in the front wall (green cut) the lock flap tucks into — the glueless catch
  const slotY = -H * 0.5;
  segs.push({ x1: W * 0.28, y1: slotY, x2: W * 0.72, y2: slotY, c: '#00ff00' });
  return svgOf(segs);
}

export const GENERATORS: Generator[] = [
  {
    id: 'yoshimura',
    label: 'Yoshimura barrel/oval',
    params: [
      { key: 'n', label: 'around', min: 6, max: 20, step: 1, default: 12 },
      { key: 'm', label: 'tiers', min: 2, max: 12, step: 1, default: 6 },
      { key: 'taper', label: 'barrel', min: 0, max: 0.8, step: 0.05, default: 0.4 },
      { key: 'angle', label: 'fold', min: 0.2, max: 1, step: 0.05, default: 0.7 },
    ],
    make: yoshimura,
  },
  {
    id: 'kresling',
    label: 'Kresling twist tower',
    params: [
      { key: 'n', label: 'around', min: 5, max: 16, step: 1, default: 8 },
      { key: 'm', label: 'tiers', min: 2, max: 10, step: 1, default: 5 },
      { key: 'twist', label: 'twist %', min: 10, max: 60, step: 5, default: 30 },
      { key: 'angle', label: 'fold', min: 0.2, max: 1, step: 0.05, default: 0.7 },
    ],
    make: kresling,
  },
  {
    id: 'miuraTube',
    label: 'Miura tube',
    params: [
      { key: 'n', label: 'cols', min: 4, max: 20, step: 1, default: 10 },
      { key: 'm', label: 'rows', min: 2, max: 12, step: 1, default: 6 },
      { key: 'slant', label: 'slant', min: 0.1, max: 0.6, step: 0.05, default: 0.35 },
      { key: 'angle', label: 'fold', min: 0.2, max: 1, step: 0.05, default: 0.6 },
    ],
    make: miuraTube,
  },
  {
    id: 'waterbomb',
    label: 'Waterbomb tessellation',
    params: [
      { key: 'n', label: 'cols', min: 4, max: 16, step: 1, default: 8 },
      { key: 'm', label: 'rows', min: 3, max: 12, step: 1, default: 6 },
      { key: 'angle', label: 'fold', min: 0.3, max: 1, step: 0.05, default: 0.85 },
    ],
    make: waterbomb,
  },
  {
    id: 'gluelessBox',
    label: 'Glueless carton',
    params: [
      { key: 'w', label: 'width', min: 10, max: 30, step: 1, default: 18 },
      { key: 'd', label: 'depth', min: 8, max: 24, step: 1, default: 12 },
      { key: 'h', label: 'height', min: 4, max: 16, step: 1, default: 8 },
      { key: 'tab', label: 'tuck tab', min: 3, max: 8, step: 1, default: 5 },
    ],
    make: gluelessBox,
  },
];

export function generatePattern(id: string, params: Record<string, number>): string {
  const g = GENERATORS.find((x) => x.id === id) ?? GENERATORS[0];
  const p: Record<string, number> = {};
  for (const pr of g.params) p[pr.key] = params[pr.key] ?? pr.default;
  return g.make(p);
}
