import { homePattern, type CreasePattern } from './creasePattern';

/**
 * Flat-foldability theory from MIT 6.849, encoded as runnable checks.
 *   Maekawa: at a flat-foldable interior vertex, |#Mountain − #Valley| = 2.
 *   Kawasaki: alternating sums of consecutive sector angles are each 180°.
 * See src/content/study/concepts/{maekawa-theorem,kawasaki-theorem}.md.
 */

const EPS = 1e-6;

/** Folding creases incident to `vertex`, sorted CCW by angle in the flat plane. */
function spokes(p: CreasePattern, vertex: number) {
  const here = p.vertices[vertex];
  return p.creases
    .filter((c) => (c.v1 === vertex || c.v2 === vertex) && c.assignment !== 'B')
    .map((c) => {
      const other = c.v1 === vertex ? c.v2 : c.v1;
      const d = p.vertices[other].clone().sub(here);
      return { angle: Math.atan2(d.y, d.x), assignment: c.assignment };
    })
    .sort((a, b) => a.angle - b.angle);
}

export function maekawaHolds(p: CreasePattern, vertex: number): boolean {
  const s = spokes(p, vertex);
  const m = s.filter((x) => x.assignment === 'M').length;
  const v = s.filter((x) => x.assignment === 'V').length;
  return Math.abs(m - v) === 2;
}

export function kawasakiHolds(p: CreasePattern, vertex: number): boolean {
  const s = spokes(p, vertex);
  if (s.length < 2 || s.length % 2 !== 0) return false; // odd degree can't flat-fold
  // Consecutive sector angles around the vertex (wrap last→first).
  const sectors = s.map((cur, i) => {
    const next = s[(i + 1) % s.length].angle + (i + 1 === s.length ? 2 * Math.PI : 0);
    return next - cur.angle;
  });
  let even = 0;
  let odd = 0;
  sectors.forEach((a, i) => (i % 2 === 0 ? (even += a) : (odd += a)));
  return Math.abs(even - Math.PI) < EPS && Math.abs(odd - Math.PI) < EPS;
}

/** Local flat-foldability at every interior vertex (necessary conditions). */
export function isFlatFoldable(p: CreasePattern): boolean {
  return p.interior.every((v) => maekawaHolds(p, v) && kawasakiHolds(p, v));
}

// ponytail: single-vertex local conditions only. Global flat-foldability
// (layer ordering / non-crossing) is NP-hard — see flat-foldability-np-hardness.md.
// Upgrade path: add Bern–Hayes layer-ordering check if multi-vertex patterns land.

/** Self-check — runs in dev/test, not in the bundle. */
export function _selfCheck(): void {
  const p = homePattern();
  if (!maekawaHolds(p, 0)) throw new Error('Maekawa failed on home vertex (expect 3M/1V)');
  if (!kawasakiHolds(p, 0)) throw new Error('Kawasaki failed on home vertex (expect 90° quads)');
  if (!isFlatFoldable(p)) throw new Error('home pattern should be flat-foldable');

  // Negative: break Maekawa (4M/0V) → must reject.
  const bad = homePattern();
  bad.creases.forEach((c) => c.assignment === 'V' && (c.assignment = 'M'));
  if (maekawaHolds(bad, 0)) throw new Error('Maekawa should reject 4M/0V');
  if (isFlatFoldable(bad)) throw new Error('all-mountain vertex is not flat-foldable');
}
