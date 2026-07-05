import type { FoldPattern, PatternEdge } from './svgImport';

/**
 * Print-ready crease-pattern SVG from the pre-triangulation pattern.
 * Colors/opacity follow the Origami Simulator convention, so the exported
 * file re-imports into origamisimulator.org (and back into this app):
 * black border, red mountain, blue valley (stroke-opacity = |angle|/180),
 * yellow facet, magenta hinge.
 */

const STROKE: Record<string, string> = {
  B: '#000000',
  M: '#ff0000',
  V: '#0000ff',
  F: '#ffff00',
  U: '#ff00ff',
  C: '#00ff00',
};

export function exportPatternSVG(pattern: FoldPattern): string {
  const { vertices } = pattern.raw;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const [x, y] of vertices) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const extent = Math.max(maxX - minX, maxY - minY);
  const border = 0.05 * extent;
  const w = maxX - minX + 2 * border;
  const h = maxY - minY + 2 * border;
  const strokeWidth = extent / 300; // reads as a fine pen line at print size

  const line = (e: PatternEdge) => {
    const [x1, y1] = vertices[e.v1];
    const [x2, y2] = vertices[e.v2];
    // fold angle is the element `opacity` (origamisimulator reads `opacity`, not stroke-opacity)
    const op = e.assignment === 'M' || e.assignment === 'V' ? ` opacity="${Math.min(Math.abs(e.targetAngle ?? 180) / 180, 1).toFixed(3)}"` : '';
    return `    <line x1="${x1.toFixed(3)}" y1="${y1.toFixed(3)}" x2="${x2.toFixed(3)}" y2="${y2.toFixed(3)}" stroke="${STROKE[e.assignment]}"${op}/>`;
  };

  // Laser layers: border + cut = cut-through; mountain/valley/facet/hinge = score/fold.
  const isCut = (a: string) => a === 'B' || a === 'C';
  const cut = pattern.raw.edges.filter((e) => isCut(e.assignment)).map(line);
  const score = pattern.raw.edges.filter((e) => !isCut(e.assignment)).map(line);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(minX - border).toFixed(3)} ${(minY - border).toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}" stroke-width="${strokeWidth.toFixed(3)}" fill="none" stroke-linecap="round">`,
    `  <title>Crease pattern</title>`,
    `  <desc>origamisimulator convention: #ff0000=mountain, #0000ff=valley, #000000=border, #00ff00=cut, #ffff00=facet, #ff00ff=free hinge; line opacity = fold angle (1.0=180deg, 0.5=90deg). Laser: layer "cut" = cut-through, layer "score" = fold/score.</desc>`,
    `  <g id="cut" data-laser="cut">`,
    ...cut,
    `  </g>`,
    `  <g id="score" data-laser="score">`,
    ...score,
    `  </g>`,
    `</svg>`,
    '',
  ].join('\n');
}

export function downloadSVG(pattern: FoldPattern, filename: string): void {
  const blob = new Blob([exportPatternSVG(pattern)], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.svg') ? filename : `${filename}.svg`;
  a.click();
  URL.revokeObjectURL(url);
}
