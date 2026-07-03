import {
  triangulate,
  type Assignment,
  type FoldPattern,
  type Graph,
  type PatternEdge,
} from './svgImport.ts'; // explicit .ts so node --run check:fold can load this module directly

/**
 * FOLD file format (https://github.com/edemaine/fold) import/export — SPEC B4.
 * Import expects a flat crease pattern (frame_classes creasePattern or 2D
 * coords); export writes the crease pattern as the top frame plus, when the
 * solver has run, the folded 3D form as an inherited file_frames entry.
 */

const DEFAULT_ANGLE: Partial<Record<Assignment, number>> = { M: -180, V: 180, F: 0 };

interface FoldFile {
  vertices_coords?: number[][];
  edges_vertices?: [number, number][];
  edges_assignment?: string[];
  edges_foldAngle?: (number | null)[];
  faces_vertices?: number[][];
  file_frames?: unknown[];
  [key: string]: unknown;
}

export function importFOLD(jsonText: string): FoldPattern {
  const warnings: string[] = [];
  let fold: FoldFile;
  try {
    fold = JSON.parse(jsonText) as FoldFile;
  } catch {
    throw new Error('not a valid JSON (.fold) file');
  }

  const coords = fold.vertices_coords;
  const edgesVerts = fold.edges_vertices;
  const facesVerts = fold.faces_vertices;
  if (!coords?.length || !edgesVerts?.length) {
    throw new Error('FOLD file needs vertices_coords and edges_vertices');
  }
  if (!facesVerts?.length) {
    throw new Error('FOLD file has no faces_vertices — export it with faces from your editor');
  }
  if (fold.file_frames?.length) warnings.push('file_frames ignored — using top-level frame');

  // Must be a flat crease pattern: 2D coords, or 3D with z ≈ 0.
  let extent = 0;
  for (const c of coords) extent = Math.max(extent, Math.abs(c[0]), Math.abs(c[1]));
  if (coords.some((c) => c.length > 2 && Math.abs(c[2]) > 1e-6 * extent)) {
    throw new Error('FOLD frame is not flat — import the crease-pattern frame, not the folded form');
  }

  const assignments = fold.edges_assignment ?? [];
  const angles = fold.edges_foldAngle ?? [];
  const edges: PatternEdge[] = edgesVerts.map(([v1, v2], i) => {
    let assignment = (assignments[i] ?? 'U') as Assignment;
    if (!'BMVCFU'.includes(assignment)) {
      warnings.push(`unknown edge assignment "${assignment}" — treated as unassigned`);
      assignment = 'U';
    }
    if (assignment === 'C') {
      warnings.push('cut (C) edges are not supported — treated as border');
      assignment = 'B';
    }
    const targetAngle =
      typeof angles[i] === 'number' ? (angles[i] as number) : (DEFAULT_ANGLE[assignment] ?? null);
    return { v1, v2, assignment, targetAngle };
  });

  // FOLD is y-up; raw (print-SVG source) is y-down like raw SVG units.
  const raw: FoldPattern['raw'] = {
    vertices: coords.map((c) => [c[0], -c[1]] as [number, number]),
    edges: edges.map((e) => ({ ...e })),
  };

  const g: Graph = { vertices: coords.map((c) => [c[0], c[1]] as [number, number]), edges };
  const tris = triangulate(g, facesVerts);

  // Normalize: center, max extent 2 (same as importSVG, minus the y-flip).
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
  const vertices = g.vertices.map(([x, y]) => [(x - cx) * scale, (y - cy) * scale] as [number, number]);

  const ccwTris = tris.map((t) => {
    const [a, b, c] = t;
    const cross =
      (vertices[b][0] - vertices[a][0]) * (vertices[c][1] - vertices[a][1]) -
      (vertices[b][1] - vertices[a][1]) * (vertices[c][0] - vertices[a][0]);
    return (cross >= 0 ? t : [a, c, b]) as [number, number, number];
  });

  return { vertices, edges: g.edges, faces: ccwTris, raw, warnings };
}

/** FOLD JSON: crease pattern as top frame; folded 3D form (if given) as an inherited frame. */
export function exportFOLDText(pattern: FoldPattern, folded?: Float32Array | null): string {
  const fold: FoldFile = {
    file_spec: 1.1,
    file_creator: 'heejinchae/portfolio origami simulator',
    frame_classes: ['creasePattern'],
    frame_attributes: ['2D'],
    vertices_coords: pattern.vertices.map(([x, y]) => [x, y]),
    edges_vertices: pattern.edges.map((e) => [e.v1, e.v2]),
    edges_assignment: pattern.edges.map((e) => e.assignment),
    edges_foldAngle: pattern.edges.map((e) => e.targetAngle),
    faces_vertices: pattern.faces.map((f) => [...f]),
  };
  if (folded) {
    const coords: number[][] = [];
    for (let i = 0; i < pattern.vertices.length; i++) {
      coords.push([folded[i * 3], folded[i * 3 + 1], folded[i * 3 + 2]]);
    }
    fold.file_frames = [
      {
        frame_classes: ['foldedForm'],
        frame_attributes: ['3D'],
        frame_parent: 0,
        frame_inherit: true,
        vertices_coords: coords,
      },
    ];
  }
  return JSON.stringify(fold);
}
