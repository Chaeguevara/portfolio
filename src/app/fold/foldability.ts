import type { FoldPattern } from './svgImport';

/**
 * Flat-foldability theorems (geometric-folding ontology). A crease pattern can
 * fold flat only if EVERY interior vertex satisfies both, so this is the real-world
 * test behind "will this SVG actually fold": for a single vertex —
 *   Maekawa:  |#mountain − #valley| = 2
 *   Kawasaki: the alternating sum of consecutive sector angles is 0
 *             (equivalently, alternate angles each sum to π).
 * These are necessary (not sufficient) conditions — they catch patterns that
 * provably CANNOT fold flat. Curved/3D patterns (Yoshimura, Kresling) are not
 * flat-foldable and are expected to fail; the check is a diagnostic, not a gate.
 */

/** Maekawa's theorem at one vertex. */
export function maekawa(mountains: number, valleys: number): boolean {
  return Math.abs(mountains - valleys) === 2;
}

/** Kawasaki's theorem: alternating sum of the (ordered) sector angles ≈ 0. */
export function kawasaki(sectorAngles: number[], tol = 1e-4): boolean {
  if (sectorAngles.length === 0 || sectorAngles.length % 2 !== 0) return false;
  let alt = 0;
  for (let i = 0; i < sectorAngles.length; i++) alt += (i % 2 ? -1 : 1) * sectorAngles[i];
  return Math.abs(alt) < tol;
}

export interface VertexFoldability {
  vertex: number;
  degree: number;
  maekawaOk: boolean;
  kawasakiOk: boolean;
}

/** Analyze every interior vertex against both theorems. */
export function analyzeFlatFoldability(pattern: FoldPattern): { flatFoldable: boolean; interior: number; vertices: VertexFoldability[] } {
  const V = pattern.vertices;
  const boundary = new Set<number>();
  const inc = new Map<number, { to: number; m: boolean }[]>();
  const add = (v: number, to: number, m: boolean) => {
    if (!inc.has(v)) inc.set(v, []);
    inc.get(v)!.push({ to, m });
  };
  for (const e of pattern.edges) {
    if (e.assignment === 'B') {
      boundary.add(e.v1);
      boundary.add(e.v2);
    } else if (e.assignment === 'M' || e.assignment === 'V') {
      const m = e.assignment === 'M';
      add(e.v1, e.v2, m);
      add(e.v2, e.v1, m);
    }
  }
  // Topological boundary: any vertex on an edge bordering < 2 faces is on the
  // outline (theorems apply to fully-surrounded interior vertices only). More
  // robust than a border-stroke or angle heuristic. Skipped when faces are absent.
  if (pattern.faces.length) {
    const ek = (a: number, b: number) => (a < b ? `${a}_${b}` : `${b}_${a}`);
    const faceCount = new Map<string, number>();
    for (const f of pattern.faces) for (let i = 0; i < f.length; i++) faceCount.set(ek(f[i], f[(i + 1) % f.length]), (faceCount.get(ek(f[i], f[(i + 1) % f.length])) ?? 0) + 1);
    for (const e of pattern.edges) if ((faceCount.get(ek(e.v1, e.v2)) ?? 0) < 2) {
      boundary.add(e.v1);
      boundary.add(e.v2);
    }
  }
  const vertices: VertexFoldability[] = [];
  for (let v = 0; v < V.length; v++) {
    if (boundary.has(v)) continue; // marked boundary (incident to a border edge)
    const creases = inc.get(v) ?? [];
    if (creases.length < 2) continue; // dangling / isolated — not a fold vertex
    const angs = creases.map((c) => Math.atan2(V[c.to][1] - V[v][1], V[c.to][0] - V[v][0])).sort((a, b) => a - b);
    const sectors = angs.map((a, i) => {
      let d = angs[(i + 1) % angs.length] - a;
      if (d <= 0) d += 2 * Math.PI;
      return d;
    });
    // Geometry-based boundary test: an interior vertex is fully surrounded (every
    // sector < π); a gap > π means the paper's exterior is on one side → boundary.
    if (Math.max(...sectors) > Math.PI + 1e-3) continue;
    if (creases.length % 2 !== 0) {
      // genuine odd-degree interior vertex: cannot fold flat
      vertices.push({ vertex: v, degree: creases.length, maekawaOk: false, kawasakiOk: false });
      continue;
    }
    let mountains = 0;
    for (const c of creases) if (c.m) mountains++;
    vertices.push({
      vertex: v,
      degree: creases.length,
      maekawaOk: maekawa(mountains, creases.length - mountains),
      kawasakiOk: kawasaki(sectors),
    });
  }
  return {
    flatFoldable: vertices.every((x) => x.maekawaOk && x.kawasakiOk),
    interior: vertices.length,
    vertices,
  };
}
