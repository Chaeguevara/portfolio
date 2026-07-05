/**
 * Self-intersection detection — the physical-validity test the compliant solver
 * doesn't do: when folded, do two non-adjacent panels pass THROUGH each other
 * (impossible with real material)? Uses Möller–Trumbore segment–triangle tests,
 * transversal only — coplanar overlaps (stacked layers) are excluded.
 *
 * IMPORTANT: only meaningful BELOW the fully-flat-folded state. At ~100% fold a
 * flat-foldable pattern's layers become coplanar and read as false crossings, so
 * evaluate at a mid/high fold (≈0.6–0.8). A count > 0 means the sheet penetrates
 * itself while folding — a real defect regardless of the flat theorems.
 */

type V3 = [number, number, number];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a: V3, b: V3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/** Does segment p0→p1 pass through the interior of triangle (a,b,c)? Coplanar → false. */
function segmentTriangle(p0: V3, p1: V3, a: V3, b: V3, c: V3, scale: number): boolean {
  const dir = sub(p1, p0);
  const e1 = sub(b, a);
  const e2 = sub(c, a);
  const pv = cross(dir, e2);
  const det = dot(e1, pv);
  if (Math.abs(det) < 1e-6 * scale) return false; // parallel / coplanar → not a crossing
  const inv = 1 / det;
  const tv = sub(p0, a);
  const eps = 1e-4;
  const u = dot(tv, pv) * inv;
  if (u < eps || u > 1 - eps) return false;
  const qv = cross(tv, e1);
  const v = dot(dir, qv) * inv;
  if (v < eps || u + v > 1 - eps) return false;
  const t = dot(e2, qv) * inv;
  return t > eps && t < 1 - eps; // strictly inside the segment (excludes shared-vertex touches)
}

/** Count pairs of non-adjacent triangles that transversally penetrate. O(faces²). */
export function selfIntersectionCount(positions: Float32Array, faces: number[][]): number {
  const P = (i: number): V3 => [positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]];
  let scale = 0;
  for (let i = 0; i < positions.length; i++) scale = Math.max(scale, Math.abs(positions[i]));
  scale = scale || 1;
  let hits = 0;
  for (let i = 0; i < faces.length; i++) {
    const A = faces[i];
    if (A.length !== 3) continue;
    const a0 = P(A[0]), a1 = P(A[1]), a2 = P(A[2]);
    for (let j = i + 1; j < faces.length; j++) {
      const B = faces[j];
      if (B.length !== 3 || A[0] === B[0] || A[0] === B[1] || A[0] === B[2] || A[1] === B[0] || A[1] === B[1] || A[1] === B[2] || A[2] === B[0] || A[2] === B[1] || A[2] === B[2]) continue; // adjacent → skip
      const b0 = P(B[0]), b1 = P(B[1]), b2 = P(B[2]);
      if (
        segmentTriangle(a0, a1, b0, b1, b2, scale) ||
        segmentTriangle(a1, a2, b0, b1, b2, scale) ||
        segmentTriangle(a2, a0, b0, b1, b2, scale) ||
        segmentTriangle(b0, b1, a0, a1, a2, scale) ||
        segmentTriangle(b1, b2, a0, a1, a2, scale) ||
        segmentTriangle(b2, b0, a0, a1, a2, scale)
      )
        hits++;
    }
  }
  return hits;
}
