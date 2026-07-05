/**
 * Bidirectional Yoshimura oval — a SINGLE CONNECTED diamond sheet that folds in
 * two directions (around the circumference AND pole-to-pole) so one flat sheet
 * closes into a faceted OVAL (prolate ellipsoid). Base pattern for armadillo-
 * inspired glueless packaging (spec 2026-07-04-gore-lantern-oval-packaging-design;
 * revised from separate gores → one sheet).
 *
 * (M+1)×(N+1) shared-vertex grid → one connected mesh (no separate petals). The
 * fold slider MORPHS each vertex between the flat sheet (fold 0) and the ellipsoid
 * wrap (fold 1): φ = 2π·col/N around, θ = latitude down the rows; the top/bottom
 * rows collapse to the two poles, closing the oval. Diamond creases (alternating
 * diagonals + horizontals) are the Yoshimura tessellation whose folds absorb the
 * double curvature — so, unlike a gore, this is genuinely ONE sheet.
 *
 * Note: an ellipsoid has Gaussian curvature, so the wrap is NOT isometric to the
 * flat sheet — the tessellation's folds take up the difference (that's the point
 * of Yoshimura). The morph's endpoints are exact (flat sheet ✓, ellipsoid ✓).
 */
export interface GoreBuilder {
  nV: number;
  grid: Float32Array;
  faces: number[];
  pairs: number[];
  cols: [number, number, number][];
  extent: number;
  strainDen: number;
  update(fold: number): void;
}

const BRD: [number, number, number] = [0.38, 0.42, 0.47];
const VAL: [number, number, number] = [0.23, 0.66, 0.92];
const MNT: [number, number, number] = [0.55, 0.6, 0.66];

export function buildGore(N: number, M: number, aspect: number, r = 1): GoreBuilder {
  const c = aspect * r; // polar semi-axis (aspect>1 = egg/oval)
  const cols = N + 1; // meridians (col 0 meets col N at the seam when folded)
  const rows = M + 1; // latitude rings (row 0 = south pole, row M = north pole)
  const vid = (i: number, j: number) => i * cols + j;
  const nV = rows * cols;
  const grid = new Float32Array(nV * 3);
  const flat = new Float32Array(nV * 3);
  const oval = new Float32Array(nV * 3);

  const dx = (2 * Math.PI * r) / N; // flat cell width ≈ circumference/N
  const dz = (Math.PI * ((r + c) / 2)) / M; // flat cell height ≈ meridian/M
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < cols; j++) {
      const o = vid(i, j) * 3;
      flat[o] = (j - N / 2) * dx;
      flat[o + 1] = 0;
      flat[o + 2] = (i - M / 2) * dz;
      const theta = -Math.PI / 2 + (Math.PI * i) / M;
      const phi = (2 * Math.PI * j) / N;
      oval[o] = r * Math.cos(theta) * Math.cos(phi);
      oval[o + 1] = c * Math.sin(theta);
      oval[o + 2] = r * Math.cos(theta) * Math.sin(phi);
    }

  const faces: number[] = [],
    pairs: number[] = [],
    cols2: [number, number, number][] = [];
  for (let i = 0; i < M; i++)
    for (let j = 0; j < N; j++) {
      const a = vid(i, j),
        b = vid(i, j + 1),
        d = vid(i + 1, j),
        e = vid(i + 1, j + 1);
      // alternating diagonal → diamonds (Yoshimura zigzag)
      if ((i + j) % 2 === 0) {
        faces.push(a, b, e, a, e, d);
        pairs.push(a, e);
        cols2.push(VAL); // valley diagonal
      } else {
        faces.push(a, b, d, b, e, d);
        pairs.push(b, d);
        cols2.push(VAL);
      }
    }
  // horizontal ring creases (mountains) + left/right border edges
  for (let i = 0; i < rows; i++)
    for (let j = 0; j < N; j++) {
      pairs.push(vid(i, j), vid(i, j + 1));
      cols2.push(MNT);
    }
  for (let i = 0; i < M; i++) {
    pairs.push(vid(i, 0), vid(i + 1, 0));
    cols2.push(BRD);
    pairs.push(vid(i, N), vid(i + 1, N));
    cols2.push(BRD);
  }

  const extent = Math.max(N * dx, M * dz, 2 * c, 2 * r) * 0.6;
  const ease = (u: number) => u * u * u * (u * (u * 6 - 15) + 10);
  return {
    nV,
    grid,
    faces,
    pairs,
    cols: cols2,
    extent,
    strainDen: c,
    update(fold: number) {
      const t = ease(Math.max(0, Math.min(1, fold)));
      for (let k = 0; k < nV * 3; k++) grid[k] = flat[k] + (oval[k] - flat[k]) * t;
    },
  };
}
