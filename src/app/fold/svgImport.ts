import earcut from 'earcut';

/**
 * SVG crease-pattern importer — a TypeScript port of the import pipeline in
 * Amanda Ghassaei's Origami Simulator (MIT, github.com/amandaghassaei/OrigamiSimulator,
 * js/pattern.js). Conventions are kept identical so patterns round-trip with
 * origamisimulator.org:
 *   black = border, red = mountain, blue = valley, yellow = facet (preset
 *   triangulation), magenta = free hinge, green = cut (unsupported here).
 *   Fold target angle = stroke opacity × 180°, mountain negative.
 */

export type Assignment = 'B' | 'M' | 'V' | 'C' | 'F' | 'U';

export interface PatternEdge {
  v1: number;
  v2: number;
  assignment: Assignment;
  /** Target dihedral in degrees (M negative, V positive, F 0); null = no target. */
  targetAngle: number | null;
}

export interface FoldPattern {
  /** Normalized: centered, max extent 2, y flipped to y-up. */
  vertices: [number, number][];
  /** Triangulated edge set (includes generated 'F' diagonals). */
  edges: PatternEdge[];
  /** CCW triangles into `vertices`. */
  faces: [number, number, number][];
  /** Pre-triangulation pattern in raw SVG units (y-down) — for print/SVG export. */
  raw: { vertices: [number, number][]; edges: PatternEdge[] };
  warnings: string[];
}

// ---------------------------------------------------------------- color → assignment

const COLOR_MAP: Record<string, Assignment> = {
  '0,0,0': 'B',
  '255,0,0': 'M',
  '0,0,255': 'V',
  '0,255,0': 'C',
  '255,255,0': 'F',
  '255,0,255': 'U',
};

const NAMED: Record<string, string> = {
  black: '0,0,0',
  red: '255,0,0',
  blue: '0,0,255',
  green: '0,255,0',
  yellow: '255,255,0',
  magenta: '255,0,255',
};

function colorKey(stroke: string): string | null {
  const s = stroke.trim().toLowerCase().replace(/\s/g, '');
  if (NAMED[s]) return NAMED[s];
  let m = s.match(/^#([0-9a-f]{3})$/);
  if (m) {
    const h = m[1];
    return [0, 1, 2].map((i) => parseInt(h[i] + h[i], 16)).join(',');
  }
  m = s.match(/^#([0-9a-f]{6})$/);
  if (m) {
    const h = m[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(',');
  }
  m = s.match(/^rgb\((\d+),(\d+),(\d+)\)$/);
  if (m) return `${m[1]},${m[2]},${m[3]}`;
  return null;
}

// ---------------------------------------------------------------- style helpers

function styleProp(el: Element, prop: string): string | null {
  const style = el.getAttribute('style');
  if (style) {
    const m = style.match(new RegExp(`(?:^|;)\\s*${prop}\\s*:\\s*([^;]+)`));
    if (m) return m[1].trim();
  }
  return el.getAttribute(prop);
}

/** Attribute/style lookup climbing ancestor groups (for Inkscape-style files). */
function inherited(el: Element, prop: string): string | null {
  let cur: Element | null = el;
  while (cur && cur.tagName.toLowerCase() !== 'svg') {
    const v = styleProp(cur, prop);
    if (v !== null && v !== '') return v;
    cur = cur.parentElement;
  }
  return null;
}

function foldOpacity(el: Element): number {
  let o = parseFloat(inherited(el, 'opacity') ?? '');
  let so = parseFloat(inherited(el, 'stroke-opacity') ?? '');
  if (Number.isNaN(o)) o = 1;
  if (Number.isNaN(so)) so = 1;
  return o * so;
}

// ---------------------------------------------------------------- SVG → segments

interface Seg {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  assignment: Assignment;
  targetAngle: number | null;
}

const SKIP_TAGS = new Set(['defs', 'symbol', 'metadata', 'title', 'desc', 'style', 'sodipodi:namedview']);

function parsePathData(d: string): [number, number][][] {
  // M/L/H/V/Z (abs + rel) only — curves are not crease lines.
  const tokens = d.match(/[MmLlHhVvZz]|-?[\d.]+(?:e-?\d+)?/g) ?? [];
  const subpaths: [number, number][][] = [];
  let cur: [number, number][] = [];
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let i = 0;
  let cmd = '';
  const num = () => parseFloat(tokens[i++]);
  while (i < tokens.length) {
    const t = tokens[i];
    if (/[A-Za-z]/.test(t)) {
      cmd = t;
      i++;
      if (cmd === 'Z' || cmd === 'z') {
        if (cur.length) cur.push([sx, sy]);
        continue;
      }
    }
    switch (cmd) {
      case 'M':
      case 'm': {
        const rel = cmd === 'm' && cur.length + subpaths.length > 0;
        x = rel ? x + num() : num(); // first 'm' of a path is absolute per spec
        y = rel ? y + num() : num();
        if (cur.length > 1) subpaths.push(cur);
        cur = [[x, y]];
        sx = x;
        sy = y;
        cmd = cmd === 'M' ? 'L' : 'l'; // subsequent pairs are implicit lineto
        break;
      }
      case 'L':
      case 'l':
        x = cmd === 'l' ? x + num() : num();
        y = cmd === 'l' ? y + num() : num();
        cur.push([x, y]);
        break;
      case 'H':
      case 'h':
        x = cmd === 'h' ? x + num() : num();
        cur.push([x, y]);
        break;
      case 'V':
      case 'v':
        y = cmd === 'v' ? y + num() : num();
        cur.push([x, y]);
        break;
      default:
        throw new Error(`unsupported path command "${cmd}"`);
    }
  }
  if (cur.length > 1) subpaths.push(cur);
  return subpaths;
}

function collectSegments(svg: Element, warnings: string[]): Seg[] {
  const segs: Seg[] = [];
  const badColors = new Set<string>();

  function push(el: Element, pts: [number, number][], close: boolean) {
    const stroke = inherited(el, 'stroke');
    if (!stroke) return;
    const key = colorKey(stroke);
    const assignment = key ? COLOR_MAP[key] : undefined;
    if (!assignment) {
      badColors.add(stroke);
      return;
    }
    let targetAngle: number | null = null;
    if (assignment === 'M') targetAngle = -foldOpacity(el) * 180;
    else if (assignment === 'V') targetAngle = foldOpacity(el) * 180;
    else if (assignment === 'F') targetAngle = 0;
    const ring = close ? [...pts, pts[0]] : pts;
    for (let i = 0; i + 1 < ring.length; i++) {
      segs.push({ x1: ring[i][0], y1: ring[i][1], x2: ring[i + 1][0], y2: ring[i + 1][1], assignment, targetAngle });
    }
  }

  function walk(el: Element) {
    const tag = el.tagName.toLowerCase();
    if (SKIP_TAGS.has(tag)) return;
    const attr = (n: string) => parseFloat(el.getAttribute(n) ?? '0');
    switch (tag) {
      case 'line':
        push(el, [[attr('x1'), attr('y1')], [attr('x2'), attr('y2')]], false);
        break;
      case 'rect': {
        const x = attr('x');
        const y = attr('y');
        const w = attr('width');
        const h = attr('height');
        push(el, [[x, y], [x + w, y], [x + w, y + h], [x, y + h]], true);
        break;
      }
      case 'polygon':
      case 'polyline': {
        const nums = (el.getAttribute('points') ?? '').match(/-?[\d.]+(?:e-?\d+)?/g)?.map(Number) ?? [];
        const pts: [number, number][] = [];
        for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
        if (pts.length > 1) push(el, pts, tag === 'polygon');
        break;
      }
      case 'path': {
        const d = el.getAttribute('d');
        if (!d) break;
        try {
          for (const sub of parsePathData(d)) push(el, sub, false);
        } catch (e) {
          warnings.push(`skipped path: ${(e as Error).message}`);
        }
        break;
      }
      default:
        for (const child of Array.from(el.children)) walk(child);
    }
  }
  walk(svg);
  if (badColors.size) warnings.push(`ignored stroke colors: ${Array.from(badColors).join(', ')}`);
  return segs;
}

// ---------------------------------------------------------------- graph cleaning

export interface Graph {
  vertices: [number, number][];
  edges: PatternEdge[];
}

function buildGraph(segs: Seg[], tol: number): Graph {
  // Merge endpoints within tol via a spatial hash.
  const vertices: [number, number][] = [];
  const cell = new Map<string, number[]>();
  const keyOf = (x: number, y: number) => `${Math.round(x / tol)},${Math.round(y / tol)}`;
  function vertexFor(x: number, y: number): number {
    const cx = Math.round(x / tol);
    const cy = Math.round(y / tol);
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const i of cell.get(`${cx + dx},${cy + dy}`) ?? []) {
          const [vx, vy] = vertices[i];
          if (Math.hypot(vx - x, vy - y) < tol) return i;
        }
      }
    }
    vertices.push([x, y]);
    const k = keyOf(x, y);
    if (!cell.has(k)) cell.set(k, []);
    cell.get(k)!.push(vertices.length - 1);
    return vertices.length - 1;
  }
  const edges: PatternEdge[] = [];
  for (const s of segs) {
    const v1 = vertexFor(s.x1, s.y1);
    const v2 = vertexFor(s.x2, s.y2);
    edges.push({ v1, v2, assignment: s.assignment, targetAngle: s.targetAngle });
  }
  return { vertices, edges };
}

function dedupe(g: Graph): void {
  const seen = new Set<string>();
  g.edges = g.edges.filter((e) => {
    if (e.v1 === e.v2) return false; // loop edge
    const k = e.v1 < e.v2 ? `${e.v1},${e.v2}` : `${e.v2},${e.v1}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** Split edges at pairwise interior intersections (Bourke line-line test). */
function splitIntersections(g: Graph, tol: number): void {
  for (let i = 0; i < g.edges.length; i++) {
    for (let j = i + 1; j < g.edges.length; j++) {
      const a = g.edges[i];
      const b = g.edges[j];
      if (a.v1 === b.v1 || a.v1 === b.v2 || a.v2 === b.v1 || a.v2 === b.v2) continue;
      const [x1, y1] = g.vertices[a.v1];
      const [x2, y2] = g.vertices[a.v2];
      const [x3, y3] = g.vertices[b.v1];
      const [x4, y4] = g.vertices[b.v2];
      const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
      if (Math.abs(denom) < 1e-12) continue;
      const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
      const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;
      const lenA = Math.hypot(x2 - x1, y2 - y1);
      const lenB = Math.hypot(x4 - x3, y4 - y3);
      if (ua * lenA < -tol || (ua - 1) * lenA > tol || ub * lenB < -tol || (ub - 1) * lenB > tol) continue;
      const intA = ua * lenA > tol && (1 - ua) * lenA > tol;
      const intB = ub * lenB > tol && (1 - ub) * lenB > tol;
      const split = (e: PatternEdge, vi: number) => {
        g.edges.push({ ...e, v1: vi, v2: e.v2 });
        e.v2 = vi;
      };
      if (intA && intB) {
        // proper crossing: insert a vertex, split both
        g.vertices.push([x1 + ua * (x2 - x1), y1 + ua * (y2 - y1)]);
        const vi = g.vertices.length - 1;
        split(a, vi);
        split(b, vi);
        j--; // re-test shortened edge j against the rest
      } else if (intA && !intB) {
        // T-junction: b's endpoint lies on a's interior — split a at it
        split(a, ub * lenB <= tol ? b.v1 : b.v2);
        j--;
      } else if (intB && !intA) {
        split(b, ua * lenA <= tol ? a.v1 : a.v2);
        j--;
      }
    }
  }
}

/** Drop degree-0 vertices; merge colinear degree-2 vertices. Reindexes. */
function simplify(g: Graph): void {
  // merge colinear degree-2 vertices
  let changed = true;
  while (changed) {
    changed = false;
    const incident: number[][] = g.vertices.map(() => []);
    g.edges.forEach((e, i) => {
      incident[e.v1].push(i);
      incident[e.v2].push(i);
    });
    for (let v = 0; v < g.vertices.length; v++) {
      if (incident[v].length !== 2) continue;
      const [i1, i2] = incident[v];
      const e1 = g.edges[i1];
      const e2 = g.edges[i2];
      if (e1.assignment !== e2.assignment) continue;
      const a = e1.v1 === v ? e1.v2 : e1.v1;
      const b = e2.v1 === v ? e2.v2 : e2.v1;
      if (a === b) continue;
      const [vx, vy] = g.vertices[v];
      const [ax, ay] = g.vertices[a];
      const [bx, by] = g.vertices[b];
      const d1x = (ax - vx) / Math.hypot(ax - vx, ay - vy);
      const d1y = (ay - vy) / Math.hypot(ax - vx, ay - vy);
      const d2x = (bx - vx) / Math.hypot(bx - vx, by - vy);
      const d2y = (by - vy) / Math.hypot(bx - vx, by - vy);
      if (d1x * d2x + d1y * d2y > -1 + 0.01) continue; // not colinear
      // merge: e1 spans a—b, drop e2
      e1.v1 = a;
      e1.v2 = b;
      if (e1.targetAngle !== null && e2.targetAngle !== null) {
        e1.targetAngle = (e1.targetAngle + e2.targetAngle) / 2;
      }
      g.edges.splice(i2, 1);
      changed = true;
      break;
    }
  }
  // drop stray vertices, reindex
  const used = new Set<number>();
  g.edges.forEach((e) => {
    used.add(e.v1);
    used.add(e.v2);
  });
  const remap = new Map<number, number>();
  const vertices: [number, number][] = [];
  for (let v = 0; v < g.vertices.length; v++) {
    if (used.has(v)) {
      remap.set(v, vertices.length);
      vertices.push(g.vertices[v]);
    }
  }
  g.vertices = vertices;
  g.edges.forEach((e) => {
    e.v1 = remap.get(e.v1)!;
    e.v2 = remap.get(e.v2)!;
  });
}

// ---------------------------------------------------------------- faces

/** Planar face tracing: sort neighbors angularly, walk next-clockwise edges. */
function traceFaces(g: Graph): number[][] {
  const nbrs: { v: number; angle: number }[][] = g.vertices.map(() => []);
  for (const e of g.edges) {
    const [x1, y1] = g.vertices[e.v1];
    const [x2, y2] = g.vertices[e.v2];
    nbrs[e.v1].push({ v: e.v2, angle: Math.atan2(y2 - y1, x2 - x1) });
    nbrs[e.v2].push({ v: e.v1, angle: Math.atan2(y1 - y2, x1 - x2) });
  }
  nbrs.forEach((l) => l.sort((a, b) => a.angle - b.angle));

  const visited = new Set<string>();
  const faces: number[][] = [];
  for (const e of g.edges) {
    for (const [from, to] of [
      [e.v1, e.v2],
      [e.v2, e.v1],
    ]) {
      if (visited.has(`${from},${to}`)) continue;
      const face: number[] = [];
      let a = from;
      let b = to;
      let guard = 0;
      while (!visited.has(`${a},${b}`) && guard++ < 10000) {
        visited.add(`${a},${b}`);
        face.push(a);
        // at b, incoming direction is b→a; take the next neighbor clockwise
        const list = nbrs[b];
        const back = Math.atan2(g.vertices[a][1] - g.vertices[b][1], g.vertices[a][0] - g.vertices[b][0]);
        let idx = list.findIndex((n) => n.v === a && Math.abs(n.angle - back) < 1e-9);
        if (idx < 0) idx = list.findIndex((n) => n.v === a);
        const next = list[(idx + 1) % list.length];
        a = b;
        b = next.v;
      }
      if (face.length >= 3) faces.push(face);
    }
  }
  return faces;
}

function signedArea(g: Graph, face: number[]): number {
  let s = 0;
  for (let i = 0; i < face.length; i++) {
    const [x1, y1] = g.vertices[face[i]];
    const [x2, y2] = g.vertices[face[(i + 1) % face.length]];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

// ---------------------------------------------------------------- triangulation

export function triangulate(g: Graph, faces: number[][]): [number, number, number][] {
  const tris: [number, number, number][] = [];
  const edgeSet = new Set(g.edges.map((e) => (e.v1 < e.v2 ? `${e.v1},${e.v2}` : `${e.v2},${e.v1}`)));
  const addFacet = (a: number, b: number) => {
    const k = a < b ? `${a},${b}` : `${b},${a}`;
    if (!edgeSet.has(k)) {
      edgeSet.add(k);
      g.edges.push({ v1: a, v2: b, assignment: 'F', targetAngle: 0 });
    }
  };
  for (const f of faces) {
    if (f.length === 3) {
      tris.push([f[0], f[1], f[2]]);
    } else if (f.length === 4) {
      const d = (i: number, j: number) =>
        Math.hypot(g.vertices[f[i]][0] - g.vertices[f[j]][0], g.vertices[f[i]][1] - g.vertices[f[j]][1]);
      if (d(0, 2) <= d(1, 3)) {
        tris.push([f[0], f[1], f[2]], [f[0], f[2], f[3]]);
        addFacet(f[0], f[2]);
      } else {
        tris.push([f[0], f[1], f[3]], [f[1], f[2], f[3]]);
        addFacet(f[1], f[3]);
      }
    } else {
      const flat: number[] = [];
      for (const v of f) flat.push(g.vertices[v][0], g.vertices[v][1]);
      const out = earcut(flat);
      for (let i = 0; i + 2 < out.length; i += 3) {
        const t: [number, number, number] = [f[out[i]], f[out[i + 1]], f[out[i + 2]]];
        tris.push(t);
        addFacet(t[0], t[1]);
        addFacet(t[1], t[2]);
        addFacet(t[2], t[0]);
      }
    }
  }
  return tris;
}

// ---------------------------------------------------------------- entry point

export function importSVG(svgText: string, vertTol = 3): FoldPattern {
  const warnings: string[] = [];
  const doc = new DOMParser().parseFromString(svgText, 'image/svg+xml');
  const svg = doc.querySelector('svg');
  if (!svg) throw new Error('not an SVG document');

  const segs = collectSegments(svg, warnings);
  if (!segs.length) throw new Error('no crease lines found (need black/red/blue strokes)');
  if (segs.some((s) => s.assignment === 'C')) warnings.push('cut (green) edges are not supported — treated as border');
  segs.forEach((s) => {
    if (s.assignment === 'C') s.assignment = 'B';
  });

  const g = buildGraph(segs, vertTol);
  dedupe(g);
  splitIntersections(g, vertTol);
  dedupe(g);
  simplify(g);

  const raw: FoldPattern['raw'] = {
    vertices: g.vertices.map(([x, y]) => [x, y] as [number, number]),
    edges: g.edges.map((e) => ({ ...e })),
  };

  const allFaces = traceFaces(g);
  // Interior faces all share one orientation; the outer face has the other.
  const areas = allFaces.map((f) => signedArea(g, f));
  const plus = areas.filter((a) => a > 0).length;
  const interiorSign = plus > allFaces.length / 2 ? 1 : -1;
  const faces = allFaces.filter((_, i) => Math.sign(areas[i]) === interiorSign);
  if (!faces.length) throw new Error('no faces found — pattern may not be a closed border');

  const tris = triangulate(g, faces);

  // Normalize: center, max extent 2, flip y (SVG y-down → render y-up).
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of g.vertices) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const scale = 2 / Math.max(maxX - minX, maxY - minY);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const vertices = g.vertices.map(([x, y]) => [(x - cx) * scale, -(y - cy) * scale] as [number, number]);

  // y-flip reverses winding — restore CCW.
  const ccwTris = tris.map((t) => {
    const [a, b, c] = t;
    const cross =
      (vertices[b][0] - vertices[a][0]) * (vertices[c][1] - vertices[a][1]) -
      (vertices[b][1] - vertices[a][1]) * (vertices[c][0] - vertices[a][0]);
    return (cross >= 0 ? t : [a, c, b]) as [number, number, number];
  });

  return { vertices, edges: g.edges, faces: ccwTris, raw, warnings };
}
