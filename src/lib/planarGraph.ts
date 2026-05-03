/**
 * @fileoverview Planar graph face extraction for crease patterns.
 *
 * Input: vertices + crease segments (+ paper boundary).
 * Output: ordered face polygons (each face = closed loop of vertex indices).
 *
 * Algorithm: standard "next clockwise edge" face traversal on a planar
 * straight-line embedding.
 *
 *   For each directed half-edge (u → v):
 *     at v, find the incoming half-edge from u and pick the NEXT half-edge
 *     in clockwise order around v. This gives the next half-edge along the
 *     face boundary on the LEFT side of u→v.
 *
 *   Iterating until we return to the start traces one face.
 *   Doing this for every directed half-edge enumerates every face exactly
 *   once (plus the outer face — discarded as the largest CCW polygon, or
 *   detected by signed-area sign).
 *
 * The crease pattern must include paper-boundary segments as edges so the
 * outer faces close properly. Generators in designerEngine.ts emit creases
 * but not boundaries — `extractFaces()` here adds the four paper edges.
 */

export interface PGPoint { x: number; y: number; }
export interface PGEdge { a: number; b: number; }
export interface PGFace {
    /** Vertex indices in CCW order (interior face). */
    loop: number[];
    /** Signed area (always positive for interior CCW face). */
    area: number;
    /** Centroid for picking / debug. */
    centroid: PGPoint;
}

const EPS = 1e-6;

/**
 * Build planar graph from a list of crease segments. Coincident endpoints
 * are merged; intersecting creases are NOT split here (caller must pre-split).
 * For grid-based tessellations all intersections occur at grid vertices, so
 * pre-split is implicit.
 */
export function buildGraph(
    rawSegments: { p0: PGPoint; p1: PGPoint }[],
    paperBounds?: { minX: number; minY: number; maxX: number; maxY: number },
    mergeTol = 0.5
): { verts: PGPoint[]; edges: PGEdge[] } {
    const verts: PGPoint[] = [];

    function findOrAdd(p: PGPoint): number {
        for (let i = 0; i < verts.length; i++) {
            if (Math.abs(verts[i].x - p.x) < mergeTol && Math.abs(verts[i].y - p.y) < mergeTol) return i;
        }
        verts.push({ x: p.x, y: p.y });
        return verts.length - 1;
    }

    const edgeKey = new Set<string>();
    const edges: PGEdge[] = [];
    function addEdge(a: number, b: number) {
        if (a === b) return;
        const k = a < b ? `${a}_${b}` : `${b}_${a}`;
        if (edgeKey.has(k)) return;
        edgeKey.add(k);
        edges.push({ a, b });
    }

    for (const seg of rawSegments) {
        const a = findOrAdd(seg.p0);
        const b = findOrAdd(seg.p1);
        addEdge(a, b);
    }

    // Paper boundary as 4 edges (so outer face closes & boundary creases are
    // part of the planar graph). Boundary corners and any boundary-incident
    // vertices need to be placed onto the boundary edge if a crease ends there.
    if (paperBounds) {
        const { minX, minY, maxX, maxY } = paperBounds;
        const corners = [
            findOrAdd({ x: minX, y: minY }),
            findOrAdd({ x: maxX, y: minY }),
            findOrAdd({ x: maxX, y: maxY }),
            findOrAdd({ x: minX, y: maxY }),
        ];

        // Collect all vertices lying on each boundary edge, sorted along it.
        const onEdge = (axis: 'x' | 'y', fixed: number, fixedTol: number,
                        otherMin: number, otherMax: number) => {
            const idxs: number[] = [];
            for (let i = 0; i < verts.length; i++) {
                const v = verts[i];
                const fv = axis === 'x' ? v.y : v.x;
                const ov = axis === 'x' ? v.x : v.y;
                if (Math.abs(fv - fixed) < fixedTol && ov >= otherMin - mergeTol && ov <= otherMax + mergeTol) {
                    idxs.push(i);
                }
            }
            idxs.sort((i, j) => (axis === 'x' ? verts[i].x - verts[j].x : verts[i].y - verts[j].y));
            return idxs;
        };

        const top = onEdge('x', minY, mergeTol, minX, maxX);
        const bot = onEdge('x', maxY, mergeTol, minX, maxX);
        const left = onEdge('y', minX, mergeTol, minY, maxY);
        const right = onEdge('y', maxX, mergeTol, minY, maxY);

        for (let i = 0; i < top.length - 1; i++) addEdge(top[i], top[i + 1]);
        for (let i = 0; i < bot.length - 1; i++) addEdge(bot[i], bot[i + 1]);
        for (let i = 0; i < left.length - 1; i++) addEdge(left[i], left[i + 1]);
        for (let i = 0; i < right.length - 1; i++) addEdge(right[i], right[i + 1]);
        void corners;
    }

    return { verts, edges };
}

/**
 * Enumerate all interior faces via next-CW-edge traversal.
 * Returns faces with CCW orientation (positive area). The outer (CW) face is
 * discarded.
 */
export function extractFaces(verts: PGPoint[], edges: PGEdge[]): PGFace[] {
    // Adjacency: for each vertex, list of (neighborIndex, angle), sorted by angle (CCW).
    const adj: { v: number; angle: number }[][] = verts.map(() => []);
    for (const e of edges) {
        const va = verts[e.a], vb = verts[e.b];
        const angAB = Math.atan2(vb.y - va.y, vb.x - va.x);
        const angBA = Math.atan2(va.y - vb.y, va.x - vb.x);
        adj[e.a].push({ v: e.b, angle: angAB });
        adj[e.b].push({ v: e.a, angle: angBA });
    }
    for (const list of adj) list.sort((p, q) => p.angle - q.angle);

    /** Given directed half-edge (from u → v), at v pick the next half-edge
     *  going CCW around v (which is the next edge along the LEFT face). */
    function nextHalfEdge(u: number, v: number): { from: number; to: number } | null {
        const list = adj[v];
        if (list.length === 0) return null;
        // Incoming direction at v is from v→u, angle:
        const va = verts[v], vu = verts[u];
        const incomingAngle = Math.atan2(vu.y - va.y, vu.x - va.x);
        // Find index of v→u in adj[v]
        let idx = -1;
        for (let i = 0; i < list.length; i++) {
            if (list[i].v === u && Math.abs(list[i].angle - incomingAngle) < 1e-9) { idx = i; break; }
        }
        if (idx === -1) {
            // Fallback: nearest by angle
            let best = -1, bestDiff = Infinity;
            for (let i = 0; i < list.length; i++) {
                const d = Math.abs(list[i].angle - incomingAngle);
                const d2 = Math.min(d, Math.PI * 2 - d);
                if (d2 < bestDiff) { bestDiff = d2; best = i; }
            }
            idx = best;
        }
        // Next CCW = previous in CCW-sorted list (rotating right gives CW; rotating left gives CCW)
        // Half-edge "next around face on left side": previous edge in CCW order
        const nextIdx = (idx - 1 + list.length) % list.length;
        return { from: v, to: list[nextIdx].v };
    }

    const visited = new Set<string>();
    const faces: PGFace[] = [];

    for (const e of edges) {
        for (const dir of [[e.a, e.b], [e.b, e.a]] as const) {
            const startKey = `${dir[0]}_${dir[1]}`;
            if (visited.has(startKey)) continue;

            const loop: number[] = [];
            let cur: { from: number; to: number } = { from: dir[0], to: dir[1] };
            let safety = 0;
            while (safety++ < 10000) {
                const k = `${cur.from}_${cur.to}`;
                if (visited.has(k)) break;
                visited.add(k);
                loop.push(cur.from);
                const nxt = nextHalfEdge(cur.from, cur.to);
                if (!nxt) break;
                if (nxt.from === dir[0] && nxt.to === dir[1]) break;
                cur = nxt;
            }
            if (loop.length < 3) continue;

            const area = signedArea(loop, verts);
            if (area < EPS) continue; // outer/CW face — skip

            faces.push({ loop, area, centroid: centroidOf(loop, verts) });
        }
    }

    return faces;
}

export function signedArea(loop: number[], verts: PGPoint[]): number {
    let s = 0;
    for (let i = 0; i < loop.length; i++) {
        const a = verts[loop[i]];
        const b = verts[loop[(i + 1) % loop.length]];
        s += a.x * b.y - b.x * a.y;
    }
    return s / 2;
}

function centroidOf(loop: number[], verts: PGPoint[]): PGPoint {
    let cx = 0, cy = 0;
    for (const i of loop) { cx += verts[i].x; cy += verts[i].y; }
    return { x: cx / loop.length, y: cy / loop.length };
}

/**
 * For each crease edge, find which faces sit on its two sides.
 * Returns map: edgeKey "min_max" → [faceIndex_left, faceIndex_right] (or -1 if boundary).
 */
export function buildEdgeFaceMap(faces: PGFace[]): Map<string, number[]> {
    const m = new Map<string, number[]>();
    faces.forEach((f, fi) => {
        const loop = f.loop;
        for (let i = 0; i < loop.length; i++) {
            const a = loop[i], b = loop[(i + 1) % loop.length];
            const k = a < b ? `${a}_${b}` : `${b}_${a}`;
            if (!m.has(k)) m.set(k, []);
            m.get(k)!.push(fi);
        }
    });
    return m;
}

/**
 * Inset a (CCW, convex-ish) polygon by distance d. For each edge, push it
 * inward by d along its inward normal; intersect adjacent insetted edges to
 * get the new vertex. Robust for convex polygons; concave polygons may
 * self-intersect (acceptable for our grid faces, which are all convex).
 */
export function insetPolygon(loop: PGPoint[], d: number): PGPoint[] {
    const n = loop.length;
    const result: PGPoint[] = [];
    for (let i = 0; i < n; i++) {
        const prev = loop[(i - 1 + n) % n];
        const cur = loop[i];
        const next = loop[(i + 1) % n];

        // Edge directions (unit)
        const e1x = cur.x - prev.x, e1y = cur.y - prev.y;
        const e1L = Math.hypot(e1x, e1y);
        const u1x = e1x / e1L, u1y = e1y / e1L;
        const n1x = u1y, n1y = -u1x; // inward normal for CCW polygon

        const e2x = next.x - cur.x, e2y = next.y - cur.y;
        const e2L = Math.hypot(e2x, e2y);
        const u2x = e2x / e2L, u2y = e2y / e2L;
        const n2x = u2y, n2y = -u2x;

        // Two parallel offset edges; find their intersection
        const p1x = prev.x + n1x * d, p1y = prev.y + n1y * d;
        const p2x = cur.x + n2x * d, p2y = cur.y + n2y * d;

        // Solve p1 + t * u1 = p2 + s * u2
        const det = u1x * (-u2y) - u1y * (-u2x);
        if (Math.abs(det) < 1e-9) {
            // Parallel — fallback: midpoint
            result.push({ x: cur.x + (n1x + n2x) / 2 * d, y: cur.y + (n1y + n2y) / 2 * d });
            continue;
        }
        const dx = p2x - p1x, dy = p2y - p1y;
        const t = (dx * (-u2y) - dy * (-u2x)) / det;
        result.push({ x: p1x + u1x * t, y: p1y + u1y * t });
    }
    return result;
}
