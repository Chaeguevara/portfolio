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
    const opacity =
      e.assignment === 'M' || e.assignment === 'V'
        ? Math.min(Math.abs(e.targetAngle ?? 180) / 180, 1)
        : 1;
    const op = opacity < 1 ? ` stroke-opacity="${opacity.toFixed(3)}"` : '';
    return `  <line x1="${x1.toFixed(3)}" y1="${y1.toFixed(3)}" x2="${x2.toFixed(3)}" y2="${y2.toFixed(3)}" stroke="${STROKE[e.assignment]}"${op}/>`;
  };

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${(minX - border).toFixed(3)} ${(minY - border).toFixed(3)} ${w.toFixed(3)} ${h.toFixed(3)}" stroke-width="${strokeWidth.toFixed(3)}" fill="none" stroke-linecap="round">`,
    ...pattern.raw.edges.map(line),
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
