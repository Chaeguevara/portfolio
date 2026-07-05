import * as THREE from 'three';
import earcut from 'earcut';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import type { FoldPattern } from './svgImport';

/**
 * 3D-print kit for a folded crease pattern. Two hinge strategies (ontology
 * rhino-mcp/{printing-design, thick-foldability, material-constraints,
 * assembly-hinge, panelization}), both printed FLAT on the bed (grounded,
 * support-free) and folded/assembled AFTER — never the folded pose.
 *
 *  • 'living' — one connected flat sheet. Panels retreat from each crease by a
 *    thickness CREASE GAP (g = 2t·sin(ρ/2) membrane, or t·tan(ρ/2) tan), joined
 *    by a thin living-hinge web on the mountain top / valley bottom face (Tachi
 *    axis-shift). Print-in-place; fold by hand. Best in ductile filament.
 *  • 'pin' — every panel is a SEPARATE part with butt-hinge knuckles along its
 *    creases, bored for a 1.75 mm filament-rod pin (over-size + clearance +
 *    shrink, wall ≥1.2 mm — assembly-hinge). Parts are bed-NESTED (shelf pack,
 *    ≥3 mm apart). Print the plate, mesh mating knuckles, push the pin. Works in
 *    rigid material where a living hinge would snap.
 */

export interface PinSpec {
  diameter: number; // pin Ø (mm) — 1.75 filament default
  clearance: number; // diametral free-fit clearance (mm)
  shrink: number; // FDM hole shrink per radius (mm)
  wall: number; // knuckle wall (mm)
  knuckleLen: number; // target knuckle length along the crease (mm)
  // 'rod' = bore only (supply a filament rod). 'midlock' = also emit a printable
  // two-piece pin that joins at mid-bore (male post + female socket) — ontology
  // rhino-mcp/midlock-screw-pin. Self-retaining, serviceable.
  style: 'rod' | 'midlock';
}

export interface PrintKitOpts {
  thickness?: number; // slab thickness t (mm)
  targetSize?: number; // largest pattern dimension in mm
  hingeType?: 'living' | 'pin';
  hingeModel?: 'membrane' | 'tan';
  hingeThickness?: number; // living-hinge web thickness (mm)
  bed?: { w: number; d: number };
  minFeature?: number; // smallest gap that stays open (mm)
  minPanelEdge?: number; // smallest surviving panel edge (mm)
  pin?: Partial<PinSpec>;
}

export interface PrintKitManifest {
  hingeType: 'living' | 'pin';
  thickness: number;
  targetSize: number;
  hingeModel: string;
  hingeThickness: number;
  panels: number;
  parts: number;
  creases: number;
  knuckles: number;
  pins: number;
  pinStyle: string;
  creaseGap: { min: number; max: number };
  pinDiameter: number;
  boreDiameter: number;
  bed: { w: number; d: number; fits: boolean };
  plates: number;
  buildHeight: number;
  supportFree: boolean;
  orientation: string;
  triangles: number;
  warnings: string[];
}

export interface PrintKit {
  geometry: THREE.BufferGeometry;
  stl: string;
  manifest: PrintKitManifest;
}

const DEFAULT_PIN: PinSpec = { diameter: 1.75, clearance: 0.6, shrink: 0.15, wall: 1.2, knuckleLen: 10, style: 'midlock' };
const DEFAULTS = {
  thickness: 2,
  targetSize: 120,
  hingeType: 'living' as const,
  hingeModel: 'membrane' as const,
  hingeThickness: 0.6,
  bed: { w: 256, d: 256 },
  minFeature: 0.5,
  minPanelEdge: 3,
};

function clamp(x: number, a: number, b: number): number {
  return x < a ? a : x > b ? b : x;
}

/** Crease gap for stock thickness t at dihedral ρ (deg). thick-foldability. */
export function creaseGap(t: number, rhoDeg: number, model: 'membrane' | 'tan'): number {
  const rho = clamp(Math.abs(rhoDeg) || 180, 0, 180);
  if (model === 'tan') return t * Math.tan((clamp(rho, 0, 179) * Math.PI) / 360);
  return 2 * t * Math.sin((rho * Math.PI) / 360);
}

type V2 = [number, number];
type V3 = [number, number, number];
const ekey = (a: number, b: number) => (a < b ? `${a},${b}` : `${b},${a}`);

function lineX(p0: V2, d0: V2, p1: V2, d1: V2): V2 | null {
  const den = d0[0] * d1[1] - d0[1] * d1[0];
  if (Math.abs(den) < 1e-9) return null;
  const s = ((p1[0] - p0[0]) * d1[1] - (p1[1] - p0[1]) * d1[0]) / den;
  return [p0[0] + s * d0[0], p0[1] + s * d0[1]];
}
function signedArea(poly: V2[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const j = (i + 1) % poly.length;
    a += poly[i][0] * poly[j][1] - poly[j][0] * poly[i][1];
  }
  return a / 2;
}
function offsetPolygon(poly: V2[], insets: number[]): V2[] | null {
  const n = poly.length;
  const lines: { p: V2; d: V2 }[] = [];
  for (let i = 0; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n];
    let dx = b[0] - a[0],
      dy = b[1] - a[1];
    const L = Math.hypot(dx, dy) || 1;
    dx /= L;
    dy /= L;
    lines.push({ p: [a[0] - dy * insets[i], a[1] + dx * insets[i]], d: [dx, dy] });
  }
  const out: V2[] = [];
  for (let i = 0; i < n; i++) {
    const prev = lines[(i - 1 + n) % n],
      cur = lines[i];
    out.push(lineX(prev.p, prev.d, cur.p, cur.d) ?? poly[i]);
  }
  return signedArea(out) > 1e-6 ? out : null;
}
function inradiusish(poly: V2[]): number {
  const cx = poly.reduce((s, p) => s + p[0], 0) / poly.length;
  const cy = poly.reduce((s, p) => s + p[1], 0) / poly.length;
  return Math.min(...poly.map((p) => Math.hypot(p[0] - cx, p[1] - cy)));
}
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => {
  const L = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / L, a[1] / L, a[2] / L];
};

function panelize(pattern: FoldPattern): number[][] {
  const F = pattern.faces.length;
  const parent = Array.from({ length: F }, (_, i) => i);
  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]];
      i = parent[i];
    }
    return i;
  };
  const asg = new Map<string, string>();
  for (const e of pattern.edges) asg.set(ekey(e.v1, e.v2), e.assignment);
  const facesOf = facesByEdge(pattern);
  for (const [key, fs] of facesOf) {
    if (fs.length !== 2) continue;
    const a = asg.get(key);
    if (a === 'M' || a === 'V' || a === 'C' || a === 'B') continue;
    const ra = find(fs[0]),
      rb = find(fs[1]);
    if (ra !== rb) parent[ra] = rb;
  }
  const groups = new Map<number, number[]>();
  for (let i = 0; i < F; i++) {
    const r = find(i);
    (groups.get(r) ?? groups.set(r, []).get(r)!).push(i);
  }
  return [...groups.values()];
}

function facesByEdge(pattern: FoldPattern): Map<string, number[]> {
  const m = new Map<string, number[]>();
  pattern.faces.forEach((f, fi) => {
    for (let k = 0; k < 3; k++) {
      const key = ekey(f[k], f[(k + 1) % 3]);
      (m.get(key) ?? m.set(key, []).get(key)!).push(fi);
    }
  });
  return m;
}

function boundaryLoop(pattern: FoldPattern, group: number[]): number[] {
  const count = new Map<string, number>();
  const rep = new Map<string, [number, number]>();
  for (const fi of group) {
    const f = pattern.faces[fi];
    for (let k = 0; k < 3; k++) {
      const a = f[k],
        b = f[(k + 1) % 3];
      const key = ekey(a, b);
      count.set(key, (count.get(key) ?? 0) + 1);
      if (!rep.has(key)) rep.set(key, [a, b]);
    }
  }
  const adj = new Map<number, number[]>();
  for (const [key, c] of count) {
    if (c !== 1) continue;
    const [a, b] = rep.get(key)!;
    (adj.get(a) ?? adj.set(a, []).get(a)!).push(b);
    (adj.get(b) ?? adj.set(b, []).get(b)!).push(a);
  }
  const seen = new Set<number>();
  let best: number[] = [];
  let bestArea = -1;
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const loop: number[] = [];
    let cur = start,
      prev = -1;
    for (let guard = 0; guard < adj.size + 2; guard++) {
      loop.push(cur);
      seen.add(cur);
      const nbrs = adj.get(cur) ?? [];
      const nxt = nbrs.find((x) => x !== prev && !(x === start && loop.length < 3)) ?? nbrs.find((x) => x !== prev);
      if (nxt === undefined || nxt === start) break;
      prev = cur;
      cur = nxt;
    }
    if (loop.length < 3) continue;
    const area = Math.abs(signedArea(loop.map((v) => pattern.vertices[v] as V2)));
    if (area > bestArea) {
      bestArea = area;
      best = loop;
    }
  }
  return best;
}

function pushTri(arr: number[], a: V3, b: V3, c: V3) {
  arr.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
}
function extrudeSlab(tris: number[], poly: V2[], z0: number, z1: number) {
  const flat: number[] = [];
  for (const p of poly) flat.push(p[0], p[1]);
  const idx = earcut(flat);
  for (let i = 0; i < idx.length; i += 3) {
    const a = poly[idx[i]],
      b = poly[idx[i + 1]],
      c = poly[idx[i + 2]];
    pushTri(tris, [a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1]);
    pushTri(tris, [a[0], a[1], z0], [c[0], c[1], z0], [b[0], b[1], z0]);
  }
  const n = poly.length;
  for (let i = 0; i < n; i++) {
    const a = poly[i],
      b = poly[(i + 1) % n];
    pushTri(tris, [a[0], a[1], z0], [b[0], b[1], z0], [b[0], b[1], z1]);
    pushTri(tris, [a[0], a[1], z0], [b[0], b[1], z1], [a[0], a[1], z1]);
  }
}
/** Hollow cylinder (knuckle bore) from p0 to p1: outer + inner walls + end caps. */
function addTube(out: number[], p0: V3, p1: V3, rO: number, rB: number, segs = 12) {
  const a = norm([p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]]);
  const t: V3 = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
  const u = norm(cross(a, t));
  const v = cross(a, u);
  const ring = (r: number, c: V3, i: number): V3 => {
    const th = (2 * Math.PI * i) / segs;
    const cs = Math.cos(th),
      sn = Math.sin(th);
    return [c[0] + r * (u[0] * cs + v[0] * sn), c[1] + r * (u[1] * cs + v[1] * sn), c[2] + r * (u[2] * cs + v[2] * sn)];
  };
  for (let i = 0; i < segs; i++) {
    const j = (i + 1) % segs;
    const o0i = ring(rO, p0, i),
      o0j = ring(rO, p0, j),
      o1i = ring(rO, p1, i),
      o1j = ring(rO, p1, j);
    const b0i = ring(rB, p0, i),
      b0j = ring(rB, p0, j),
      b1i = ring(rB, p1, i),
      b1j = ring(rB, p1, j);
    pushTri(out, o0i, o0j, o1j);
    pushTri(out, o0i, o1j, o1i); // outer wall
    pushTri(out, b0i, b1j, b0j);
    pushTri(out, b0i, b1i, b1j); // inner wall (bore)
    pushTri(out, o0i, b0j, o0j);
    pushTri(out, o0i, b0i, b0j); // cap @p0
    pushTri(out, o1i, o1j, b1j);
    pushTri(out, o1i, b1j, b1i); // cap @p1
  }
}

/**
 * One half of a mid-lock two-piece pin, lying along +X on the bed (ontology
 * rhino-mcp/midlock-screw-pin): flange (outer end) + shaft + a male post or a
 * female socket at the inner end. The two halves meet and lock at mid-bore.
 * Returns [] if the crease is too short for a two-piece pin.
 */
function midlockHalf(male: boolean, L: number, pin: PinSpec, boreR: number): number[] {
  const out: number[] = [];
  const shaftR = Math.max(0.8, boreR - pin.clearance / 2);
  const flangeR = boreR + 0.8;
  const flangeThk = 0.8;
  const postR = Math.max(0.9, shaftR - pin.wall);
  const engage = Math.max(3, 2 * postR);
  const half = L / 2 - 0.3; // slight preload gap so the halves cinch, not bottom out
  const z = shaftR; // rests on the bed
  if (half < engage + flangeThk + 1) return out;
  addTube(out, [0, 0, z], [flangeThk, 0, z], flangeR, 0, 14); // end flange / head
  addTube(out, [flangeThk, 0, z], [half - engage, 0, z], shaftR, 0, 14); // shaft
  if (male) addTube(out, [half - engage, 0, z], [half, 0, z], postR, 0, 14); // male post (screw/snap)
  else addTube(out, [half - engage, 0, z], [half, 0, z], shaftR, postR + 0.2, 14); // female socket
  return out;
}

function bbox2(tris: number[]): { minx: number; miny: number; w: number; h: number } {
  let minx = Infinity,
    miny = Infinity,
    maxx = -Infinity,
    maxy = -Infinity;
  for (let i = 0; i < tris.length; i += 3) {
    minx = Math.min(minx, tris[i]);
    maxx = Math.max(maxx, tris[i]);
    miny = Math.min(miny, tris[i + 1]);
    maxy = Math.max(maxy, tris[i + 1]);
  }
  return { minx, miny, w: maxx - minx, h: maxy - miny };
}
function translate(tris: number[], dx: number, dy: number) {
  for (let i = 0; i < tris.length; i += 3) {
    tris[i] += dx;
    tris[i + 1] += dy;
  }
}
/** Shelf-pack parts into the bed rectangle; returns plate count needed. */
function shelfNest(parts: number[][], bed: { w: number; d: number }, margin = 3): number {
  const boxes = parts.map(bbox2);
  const order = [...parts.keys()].filter((i) => boxes[i].w > 0).sort((i, j) => boxes[j].h - boxes[i].h);
  let x = margin,
    y = margin,
    rowH = 0,
    maxY = margin;
  for (const i of order) {
    const b = boxes[i];
    if (x + b.w + margin > bed.w) {
      x = margin;
      y += rowH + margin;
      rowH = 0;
    }
    translate(parts[i], x - b.minx, y - b.miny);
    x += b.w + margin;
    rowH = Math.max(rowH, b.h);
    maxY = Math.max(maxY, y + b.h);
  }
  return Math.max(1, Math.ceil(maxY / bed.d));
}

/**
 * Tilted-cut pattern for a rotating-units auxetic — the laser file the ULB /
 * Rafsanjani generators actually output (ontology bistable-auxetic-rafsanjani).
 * Cuts run along the lattice edges, each shortened by the ligament t (leaving a
 * flexure hinge at every vertex) and TILTED by θ about its midpoint — the tilt is
 * the chirality that makes the auxetic BISTABLE (θ=0 → monostable). Returns an SVG
 * of black cut lines (one cut layer) sized in mm; l = unit-cell size.
 */
export interface AuxeticCuts {
  lines: [number, number, number, number][];
  w: number;
  h: number;
}

/** The tilted cut segments (shared by the on-screen preview and the SVG export). */
export function auxeticCutLines(shape: 'square' | 'triangle', n: number, l: number, t: number, tiltDeg: number): AuxeticCuts {
  const cuts: [number, number, number, number][] = [];
  const tilt = (tiltDeg * Math.PI) / 180;
  const seg = (x1: number, y1: number, x2: number, y2: number) => {
    const mx = (x1 + x2) / 2,
      my = (y1 + y2) / 2;
    let dx = x2 - x1,
      dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    dx /= len;
    dy /= len;
    const half = (len - t) / 2; // leave ligament t at both vertices
    if (half <= 0) return;
    const ca = Math.cos(tilt),
      sa = Math.sin(tilt);
    const tx = dx * ca - dy * sa,
      ty = dx * sa + dy * ca; // tilt the cut direction (chirality → bistable)
    cuts.push([mx - tx * half, my - ty * half, mx + tx * half, my + ty * half]);
  };

  let W: number, H: number;
  if (shape === 'square') {
    W = n * l;
    H = n * l;
    for (let j = 1; j < n; j++) for (let i = 0; i < n; i++) seg(i * l, j * l, (i + 1) * l, j * l);
    for (let i = 1; i < n; i++) for (let j = 0; j < n; j++) seg(i * l, j * l, i * l, (j + 1) * l);
  } else {
    // triangular lattice: horizontal + two diagonal edge families, ligaments at nodes
    const dy = (l * Math.sqrt(3)) / 2;
    W = n * l + l / 2;
    H = n * dy;
    const seen = new Set<string>();
    const key = (a: number, b: number, c: number, d: number) => [a, b, c, d].map((v) => v.toFixed(1)).join(',');
    const tryseg = (x1: number, y1: number, x2: number, y2: number) => {
      const k = x1 < x2 || (x1 === x2 && y1 < y2) ? key(x1, y1, x2, y2) : key(x2, y2, x1, y1);
      if (seen.has(k)) return;
      seen.add(k);
      seg(x1, y1, x2, y2);
    };
    for (let j = 0; j < n; j++)
      for (let i = 0; i <= n; i++) {
        const x = i * l + (j % 2) * (l / 2),
          y = j * dy;
        const xu = i * l + ((j + 1) % 2) * (l / 2),
          yu = (j + 1) * dy;
        if (i < n) tryseg(x, y, x + l, y); // horizontal
        tryseg(x, y, xu, yu); // up-right
        tryseg(x, y, xu - l, yu); // up-left
      }
  }

  return { lines: cuts, w: W, h: H };
}

/** Laser-ready SVG (one black cut layer) of the tilted-cut auxetic pattern. */
export function auxeticCutSVG(shape: 'square' | 'triangle', n: number, l: number, t: number, tiltDeg: number): string {
  const { lines, w, h } = auxeticCutLines(shape, n, l, t, tiltDeg);
  const b = l * 0.15;
  const vbw = w + 2 * b,
    vbh = h + 2 * b;
  const sw = (Math.max(w, h) / 200).toFixed(3);
  const seg = (c: [number, number, number, number]) =>
    `    <line x1="${c[0].toFixed(2)}" y1="${c[1].toFixed(2)}" x2="${c[2].toFixed(2)}" y2="${c[3].toFixed(2)}" stroke="#00ff00"/>`;
  // Golden kirigami cut pattern: mm scale, self-documenting legend, single cut layer
  // (every line is cut-through) — green = interior slit, black = outline.
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${vbw.toFixed(1)}mm" height="${vbh.toFixed(1)}mm" viewBox="${(-b).toFixed(2)} ${(-b).toFixed(2)} ${vbw.toFixed(2)} ${vbh.toFixed(2)}" fill="none" stroke-width="${sw}" stroke-linecap="round">`,
    `  <title>Auxetic kirigami cut pattern (${shape})</title>`,
    `  <desc>Kirigami cut pattern (origamisimulator convention): #00ff00 = cut slit, #000000 = outline; all lines are cut-through. The sheet expands with a negative Poisson ratio as rigid ${shape}s rotate about the uncut ligaments (width ${t}). Scale: 1 unit = 1 mm.</desc>`,
    `  <g id="cut" data-laser="cut">`,
    `    <rect x="0" y="0" width="${w.toFixed(2)}" height="${h.toFixed(2)}" stroke="#000000"/>`,
    ...lines.map(seg),
    `  </g>`,
    `</svg>`,
    '',
  ].join('\n');
}

/* ---------- assembly plan (for the in-viewer assembly map) ---------- */
export interface AssemblyPart {
  id: number;
  faces: number[]; // triangle indices in pattern.faces
  loop: number[]; // boundary vertex indices (flat outline)
  centroid: V2; // flat centroid
  color: [number, number, number]; // stable hue, 0..1 rgb — shared by model + tray
}
export interface AssemblyHinge {
  code: string;
  v1: number;
  v2: number;
  mv: 'M' | 'V';
  partA: number;
  partB: number;
}
export interface AssemblyStep {
  step: number;
  part: number;
  onto: number;
  hinge: string;
  mv: 'M' | 'V';
}
export interface AssemblyPlan {
  parts: AssemblyPart[];
  hinges: AssemblyHinge[];
  sequence: AssemblyStep[];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const k = (n: number) => (n + h * 12) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)];
}

/** Panels numbered + coloured, hinge connections, and a build sequence. */
export function assemblyPlan(pattern: FoldPattern): AssemblyPlan {
  const groups = panelize(pattern);
  const raw = groups
    .map((g) => {
      const loop = boundaryLoop(pattern, g);
      const pts = loop.map((v) => pattern.vertices[v] as V2);
      const area = Math.abs(signedArea(pts));
      const cx = pts.reduce((s, p) => s + p[0], 0) / (pts.length || 1);
      const cy = pts.reduce((s, p) => s + p[1], 0) / (pts.length || 1);
      return { g, loop, area, centroid: [cx, cy] as V2 };
    })
    .filter((r) => r.loop.length >= 3)
    .sort((a, b) => b.area - a.area); // largest first → assembly root
  const parts: AssemblyPart[] = raw.map((r, i) => ({
    id: i,
    faces: r.g,
    loop: r.loop,
    centroid: r.centroid,
    color: hslToRgb(((i * 0.61803398875) % 1), 0.55, 0.6), // golden-ratio hues, distinct
  }));
  const facePart = new Map<number, number>();
  raw.forEach((r, i) => r.g.forEach((fi) => facePart.set(fi, i)));

  const faceOf = facesByEdge(pattern);
  const hinges: AssemblyHinge[] = [];
  let hc = 0;
  for (const e of pattern.edges) {
    if (e.assignment !== 'M' && e.assignment !== 'V') continue;
    const fs = faceOf.get(ekey(e.v1, e.v2));
    if (!fs || fs.length !== 2) continue;
    const pA = facePart.get(fs[0]),
      pB = facePart.get(fs[1]);
    if (pA === undefined || pB === undefined || pA === pB) continue;
    hinges.push({ code: 'H' + ++hc, v1: e.v1, v2: e.v2, mv: e.assignment, partA: pA, partB: pB });
  }

  // sequence: BFS spanning tree from the largest part; new subassembly per component
  const adj = new Map<number, { other: number; h: AssemblyHinge }[]>();
  parts.forEach((p) => adj.set(p.id, []));
  hinges.forEach((h) => {
    adj.get(h.partA)!.push({ other: h.partB, h });
    adj.get(h.partB)!.push({ other: h.partA, h });
  });
  const placed = new Set<number>();
  const sequence: AssemblyStep[] = [];
  let step = 0;
  for (const seed of parts.map((p) => p.id)) {
    if (placed.has(seed)) continue;
    placed.add(seed);
    const q = [seed];
    while (q.length) {
      const cur = q.shift()!;
      for (const { other, h } of adj.get(cur)!) {
        if (placed.has(other)) continue;
        placed.add(other);
        sequence.push({ step: ++step, part: other, onto: cur, hinge: h.code, mv: h.mv });
        q.push(other);
      }
    }
  }
  return { parts, hinges, sequence };
}

export function buildPrintKit(pattern: FoldPattern, opts: PrintKitOpts = {}): PrintKit {
  const o = { ...DEFAULTS, ...opts, bed: { ...DEFAULTS.bed, ...(opts.bed ?? {}) } };
  const pin: PinSpec = { ...DEFAULT_PIN, ...(opts.pin ?? {}) };
  const t = o.thickness;
  const warnings: string[] = [];

  // scale pattern (normalized extent≈2) to physical mm
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;
  for (const [x, y] of pattern.vertices) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const scale = o.targetSize / (Math.max(maxX - minX, maxY - minY) || 1);
  const V: V2[] = pattern.vertices.map(([x, y]) => [(x - minX) * scale, (y - minY) * scale]);
  const spat: FoldPattern = { ...pattern, vertices: V };

  const asg = new Map<string, { a: string; angle: number }>();
  for (const e of pattern.edges) asg.set(ekey(e.v1, e.v2), { a: e.assignment, angle: e.targetAngle ?? 180 });

  const groups = panelize(spat);
  const faceOf = facesByEdge(spat);
  const facePanel = new Int32Array(spat.faces.length).fill(-1);
  groups.forEach((g, gi) => g.forEach((fi) => (facePanel[fi] = gi)));

  // interior fold creases with their two panels
  interface Crease {
    v1: number;
    v2: number;
    angle: number;
    a: string;
    pA: number;
    pB: number;
  }
  const creases: Crease[] = [];
  let gapMin = Infinity,
    gapMax = 0;
  for (const e of pattern.edges) {
    if (e.assignment !== 'M' && e.assignment !== 'V') continue;
    const fs = faceOf.get(ekey(e.v1, e.v2));
    if (!fs || fs.length !== 2) continue;
    creases.push({ v1: e.v1, v2: e.v2, angle: e.targetAngle ?? 180, a: e.assignment, pA: facePanel[fs[0]], pB: facePanel[fs[1]] });
    const gp = creaseGap(t, e.targetAngle ?? 180, o.hingeModel);
    gapMin = Math.min(gapMin, gp);
    gapMax = Math.max(gapMax, gp);
    if (gp < o.minFeature) warnings.push(`crease gap ${gp.toFixed(2)} mm < ${o.minFeature} mm — may fuse (living) / knuckle-tight (pin)`);
  }

  const tris: number[] = [];
  let panelCount = 0;
  let partCount = 0;
  let knuckles = 0;
  let pins = 0;
  let plates = 1;
  const th = Math.min(o.hingeThickness, t * 0.8);
  const boreR = (pin.diameter + pin.clearance + 2 * pin.shrink) / 2;
  const knuckleR = boreR + pin.wall;

  if (o.hingeType === 'living') {
    // ── one connected flat sheet: trimmed panels + living-hinge webs ──
    for (const g of groups) {
      const loop = boundaryLoop(spat, g);
      if (loop.length < 3) continue;
      let poly = loop.map((v) => V[v]);
      if (signedArea(poly) < 0) {
        poly = poly.slice().reverse();
        loop.reverse();
      }
      const insets = loop.map((_, i) => {
        const info = asg.get(ekey(loop[i], loop[(i + 1) % loop.length]));
        return info && (info.a === 'M' || info.a === 'V') ? creaseGap(t, info.angle, o.hingeModel) / 2 : 0;
      });
      const cap = inradiusish(poly) * 0.9;
      const shrunk = insets.some((x) => x > 0) ? offsetPolygon(poly, insets.map((x) => Math.min(x, cap))) : poly;
      if (!shrunk) {
        warnings.push('a leaf is too small after crease-gap trimming — increase target size or reduce thickness');
        continue;
      }
      panelCount++;
      extrudeSlab(tris, shrunk, 0, t);
      for (let i = 0; i < shrunk.length; i++) {
        const a = shrunk[i],
          b = shrunk[(i + 1) % shrunk.length];
        if (Math.hypot(b[0] - a[0], b[1] - a[1]) < o.minPanelEdge) warnings.push(`panel edge < ${o.minPanelEdge} mm`);
      }
    }
    for (const c of creases) {
      const gp = creaseGap(t, c.angle, o.hingeModel);
      const a = V[c.v1],
        b = V[c.v2];
      let dx = b[0] - a[0],
        dy = b[1] - a[1];
      const L = Math.hypot(dx, dy) || 1;
      dx /= L;
      dy /= L;
      const nx = -dy,
        ny = dx;
      const half = gp / 2 + 1.5; // bond onto both panels
      const web: V2[] = [
        [a[0] - nx * half, a[1] - ny * half],
        [b[0] - nx * half, b[1] - ny * half],
        [b[0] + nx * half, b[1] + ny * half],
        [a[0] + nx * half, a[1] + ny * half],
      ];
      if (signedArea(web) < 0) web.reverse();
      const z0 = c.a === 'M' ? t - th : 0; // Tachi axis-shift
      extrudeSlab(tris, web, z0, z0 + th);
    }
    partCount = 1; // one connected sheet
    plates = bbox2(tris).w <= o.bed.w && bbox2(tris).h <= o.bed.d ? 1 : Math.ceil(bbox2(tris).h / o.bed.d);
  } else {
    // ── print-separately: per-panel parts + butt-hinge knuckles, bed-nested ──
    const parts: number[][] = groups.map(() => []);
    groups.forEach((g, gi) => {
      const loop = boundaryLoop(spat, g);
      if (loop.length < 3) return;
      let poly = loop.map((v) => V[v]);
      if (signedArea(poly) < 0) poly = poly.slice().reverse();
      extrudeSlab(parts[gi], poly, 0, t);
      panelCount++;
    });
    for (const c of creases) {
      if (c.pA < 0 || c.pB < 0) continue;
      const a = V[c.v1],
        b = V[c.v2];
      const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
      const K = Math.max(2, Math.round(L / pin.knuckleLen));
      for (let k = 0; k < K; k++) {
        const s0 = (k + 0.12) / K,
          s1 = (k + 0.88) / K;
        const p0: V3 = [a[0] + (b[0] - a[0]) * s0, a[1] + (b[1] - a[1]) * s0, t / 2];
        const p1: V3 = [a[0] + (b[0] - a[0]) * s1, a[1] + (b[1] - a[1]) * s1, t / 2];
        const owner = k % 2 === 0 ? c.pA : c.pB; // interleave A/B knuckles
        addTube(parts[owner], p0, p1, knuckleR, boreR, 12);
        knuckles++;
      }
    }
    partCount = parts.filter((p) => p.length > 0).length; // panels only, before pins

    // include the actual pin: a printable two-piece mid-lock pin per hinge
    if (pin.style === 'midlock') {
      for (const c of creases) {
        if (c.pA < 0 || c.pB < 0) continue;
        const a = V[c.v1],
          b = V[c.v2];
        const L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
        const male = midlockHalf(true, L, pin, boreR);
        const female = midlockHalf(false, L, pin, boreR);
        if (male.length) {
          parts.push(male);
          pins++;
        }
        if (female.length) {
          parts.push(female);
          pins++;
        }
      }
      if (pins === 0 && creases.length)
        warnings.push('creases too short for a two-piece mid-lock pin — set pin.style="rod" and use a filament rod');
      else if (pins > 0)
        warnings.push('mid-lock pins nest flat; print them axis-vertical for a round shaft + lock (ontology midlock-screw-pin)');
    } else {
      warnings.push('pin.style="rod": bore only — supply a 1.75 mm filament rod, heat-flare to retain');
    }

    plates = shelfNest(parts, o.bed, 3);
    for (const p of parts) for (const val of p) tris.push(val);
    if (knuckleR > o.bed.w) warnings.push('knuckle larger than bed — reduce pin/wall');
    warnings.push('pin bores print on a horizontal axis (oval/sag) — ream to ' + pin.diameter + ' mm or add a lead-in chamfer');
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(tris, 3));
  geometry.computeVertexNormals();
  const stl = new STLExporter().parse(new THREE.Mesh(geometry));

  const bb = bbox2(tris);
  const fits = bb.w <= o.bed.w && bb.h <= o.bed.d;
  if (!fits && o.hingeType === 'living')
    warnings.push(`flat sheet ${bb.w.toFixed(0)}×${bb.h.toFixed(0)} mm exceeds bed ${o.bed.w}×${o.bed.d} — use pin hinges to split + nest, or scale down`);
  if (plates > 1) warnings.push(`needs ${plates} bed plates (${o.bed.w}×${o.bed.d} mm each)`);

  const manifest: PrintKitManifest = {
    hingeType: o.hingeType,
    thickness: t,
    targetSize: o.targetSize,
    hingeModel: o.hingeModel,
    hingeThickness: o.hingeType === 'living' ? th : 0,
    panels: panelCount,
    parts: partCount,
    creases: creases.length,
    knuckles,
    pins,
    pinStyle: o.hingeType === 'pin' ? pin.style : '',
    creaseGap: { min: creases.length ? +gapMin.toFixed(2) : 0, max: +gapMax.toFixed(2) },
    pinDiameter: o.hingeType === 'pin' ? pin.diameter : 0,
    boreDiameter: o.hingeType === 'pin' ? +(boreR * 2).toFixed(2) : 0,
    bed: { w: o.bed.w, d: o.bed.d, fits: fits || o.hingeType === 'pin' },
    plates,
    buildHeight: o.hingeType === 'pin' ? +Math.max(t, knuckleR * 2).toFixed(2) : t,
    supportFree: true,
    orientation: 'flat on bed (grounded); ' + (o.hingeType === 'pin' ? 'assemble + pin after' : 'fold after'),
    triangles: tris.length / 9,
    warnings: [...new Set(warnings)],
  };

  return { geometry, stl, manifest };
}
