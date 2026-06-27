import * as THREE from 'three';

/**
 * Crease pattern data model — the flat (unfolded) sheet.
 * Distilled from MIT 6.849 (see src/content/study/maps/geometric-folding.md):
 * vertices live in the 2D plane, creases connect them with a mountain/valley
 * assignment, and the crease graph carves the sheet into rigid faces.
 */
export type Assignment = 'M' | 'V' | 'B'; // Mountain, Valley, Border (boundary, not folded)

export interface Crease {
  v1: number;
  v2: number;
  assignment: Assignment;
}

export interface CreasePattern {
  /** Flat-state coordinates (paper plane). */
  vertices: THREE.Vector2[];
  creases: Crease[];
  /** Each face = ordered ring of vertex indices (CCW in flat state). */
  faces: number[][];
  /** Interior vertices to validate for flat-foldability (no boundary verts). */
  interior: number[];
}

/**
 * Home pattern: a single degree-4 interior vertex with four 90° sectors.
 * Maekawa: 3 mountains + 1 valley → |M − V| = 2.  ✓
 * Kawasaki: alternating angle sums 90+90 = 90+90 = 180°.  ✓
 * → flat-foldable. The four faces become the four navigation panels.
 */
export function homePattern(): CreasePattern {
  const c = new THREE.Vector2(0, 0); // interior vertex (index 0)
  // Outer corners of a square, plus edge midpoints where creases hit the border.
  const R = 1;
  const E = new THREE.Vector2(R, 0); // index 1  (+x)
  const N = new THREE.Vector2(0, R); // index 2  (+y)
  const W = new THREE.Vector2(-R, 0); // index 3 (−x)
  const S = new THREE.Vector2(0, -R); // index 4 (−y)
  const NE = new THREE.Vector2(R, R); // 5
  const NW = new THREE.Vector2(-R, R); // 6
  const SW = new THREE.Vector2(-R, -R); // 7
  const SE = new THREE.Vector2(R, -R); // 8

  const vertices = [c, E, N, W, S, NE, NW, SW, SE];

  // Four folding creases from center to edge midpoints: 3 mountains, 1 valley.
  const creases: Crease[] = [
    { v1: 0, v2: 1, assignment: 'M' },
    { v1: 0, v2: 2, assignment: 'V' },
    { v1: 0, v2: 3, assignment: 'M' },
    { v1: 0, v2: 4, assignment: 'M' },
    // Border (paper boundary — never folded).
    { v1: 1, v2: 5, assignment: 'B' },
    { v1: 5, v2: 2, assignment: 'B' },
    { v1: 2, v2: 6, assignment: 'B' },
    { v1: 6, v2: 3, assignment: 'B' },
    { v1: 3, v2: 7, assignment: 'B' },
    { v1: 7, v2: 4, assignment: 'B' },
    { v1: 4, v2: 8, assignment: 'B' },
    { v1: 8, v2: 1, assignment: 'B' },
  ];

  // Four quadrant faces (CCW).
  const faces = [
    [0, 1, 5, 2], // NE quadrant → panel 0
    [0, 2, 6, 3], // NW quadrant → panel 1
    [0, 3, 7, 4], // SW quadrant → panel 2
    [0, 4, 8, 1], // SE quadrant → panel 3
  ];

  return { vertices, creases, faces, interior: [0] };
}
