import type { FoldPattern, PatternEdge, Assignment } from './svgImport';

/**
 * Kirigami: honour cut edges ('C', green in origamisimulator.org).
 *
 * The solver makes an axial spring for every edge, so a cut edge would keep the
 * two sides glued. A real cut must SEPARATE the sheet. This splits vertices
 * along cut lines: around each vertex the incident faces are grouped by
 * connectivity through non-cut edges, and each group gets its own copy of the
 * vertex. Cut edges then tear into two independent boundary edges (kept as 'B'
 * so each side still has structural beams, but with no crease across the gap).
 *
 * No-op when the pattern has no cuts, so it is safe to run on every import.
 * `raw` (pre-triangulation, for SVG export) is left untouched — the printed
 * crease pattern keeps its green cut lines.
 */
export function applyCuts(p: FoldPattern): FoldPattern {
  const key = (a: number, b: number) => (a < b ? `${a},${b}` : `${b},${a}`);
  const cutKeys = new Set<string>();
  for (const e of p.edges) if (e.assignment === 'C') cutKeys.add(key(e.v1, e.v2));
  if (cutKeys.size === 0) return p;

  const N = p.vertices.length;
  const faces = p.faces;
  const F = faces.length;

  // incident face-corners per original vertex
  const cornersAt: { f: number; k: number }[][] = Array.from({ length: N }, () => []);
  for (let f = 0; f < F; f++) for (let k = 0; k < 3; k++) cornersAt[faces[f][k]].push({ f, k });

  const newIdOf = new Int32Array(F * 3).fill(-1); // face-corner → new vertex id
  const newVerts: [number, number][] = [];
  const origOf: number[] = []; // new id → old id

  for (let v = 0; v < N; v++) {
    const corners = cornersAt[v];
    if (corners.length === 0) continue;

    // union-find over this vertex's corners; link corners sharing a NON-cut edge (v,w)
    const parent = corners.map((_, i) => i);
    const find = (i: number): number => {
      while (parent[i] !== i) {
        parent[i] = parent[parent[i]];
        i = parent[i];
      }
      return i;
    };
    const uni = (a: number, b: number) => {
      const ra = find(a),
        rb = find(b);
      if (ra !== rb) parent[ra] = rb;
    };
    const byNeighbor = new Map<number, number[]>();
    corners.forEach((c, ci) => {
      const tri = faces[c.f];
      for (let k = 0; k < 3; k++) {
        const w = tri[k];
        if (w === v) continue;
        let arr = byNeighbor.get(w);
        if (!arr) {
          arr = [];
          byNeighbor.set(w, arr);
        }
        arr.push(ci);
      }
    });
    for (const [w, cis] of byNeighbor) {
      if (cutKeys.has(key(v, w))) continue; // cut: keep the fan separated here
      for (let i = 1; i < cis.length; i++) uni(cis[0], cis[i]);
    }

    const rootToId = new Map<number, number>();
    corners.forEach((c, ci) => {
      const r = find(ci);
      let id = rootToId.get(r);
      if (id === undefined) {
        id = newVerts.length;
        newVerts.push([p.vertices[v][0], p.vertices[v][1]]);
        origOf.push(v);
        rootToId.set(r, id);
      }
      newIdOf[c.f * 3 + c.k] = id;
    });
  }

  const newFaces: [number, number, number][] = faces.map(
    (_, f) => [newIdOf[f * 3], newIdOf[f * 3 + 1], newIdOf[f * 3 + 2]] as [number, number, number]
  );

  // rebuild the edge set from the new faces, carrying M/V/F assignments across;
  // torn cut edges become plain boundaries ('B').
  const origEdge = new Map<string, PatternEdge>();
  for (const e of p.edges) origEdge.set(key(e.v1, e.v2), e);
  const newEdgeMap = new Map<string, PatternEdge>();
  for (const tri of newFaces) {
    for (let k = 0; k < 3; k++) {
      const a = tri[k],
        b = tri[(k + 1) % 3];
      const nk = key(a, b);
      if (newEdgeMap.has(nk)) continue;
      const oe = origEdge.get(key(origOf[a], origOf[b]));
      let assignment: Assignment = 'B';
      let targetAngle: number | null = null;
      if (oe && oe.assignment !== 'C') {
        assignment = oe.assignment;
        targetAngle = oe.targetAngle;
      }
      newEdgeMap.set(nk, { v1: a, v2: b, assignment, targetAngle });
    }
  }

  return {
    vertices: newVerts,
    faces: newFaces,
    edges: [...newEdgeMap.values()],
    raw: p.raw,
    warnings: [...p.warnings, `kirigami: ${cutKeys.size} cut edge(s) — sheet split into separable pieces`],
  };
}
