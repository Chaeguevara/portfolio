/**
 * @fileoverview Designer engine — pattern generation, rendering, validation, export.
 * Drives the /designer page canvas and sidebar controls.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

interface Pt { x: number; y: number; }

interface DCrease {
    p0: Pt; p1: Pt;
    mv: 'M' | 'V' | 'U';
    /** Normalized coordinates (0-1) for export */
    n0: Pt; n1: Pt;
}

interface DVertex {
    pos: Pt;
    creaseIds: number[];
    boundary: boolean;
    kawasakiOk: boolean;
    maekawaOk: boolean;
}

interface DesignerState {
    pattern: string;
    cols: number;
    rows: number;
    paperW: number;
    paperH: number;
    creases: DCrease[];
    vertices: DVertex[];
    hoveredCrease: number;
    canvasW: number;
    canvasH: number;
    sheetOx: number;
    sheetOy: number;
    sheetSize: number;
}

// ─── Colors ──────────────────────────────────────────────────────────────────

const M_COL = '#e74c3c';
const V_COL = '#3498db';
const U_COL = '#bbb';
const PAPER_COL = '#faf3e0';

// ─── Pattern Generators ─────────────────────────────────────────────────────

function findOrAdd(pts: Pt[], p: Pt): number {
    for (let i = 0; i < pts.length; i++) {
        if (Math.abs(pts[i].x - p.x) < 0.5 && Math.abs(pts[i].y - p.y) < 0.5) return i;
    }
    pts.push({ ...p });
    return pts.length - 1;
}

function generatePattern(
    pattern: string, cols: number, rows: number,
    size: number, ox: number, oy: number
): { creases: DCrease[]; vertices: DVertex[] } {
    switch (pattern) {
        case 'miura': return genMiura(cols, rows, size, ox, oy);
        case 'square-twist': return genSquareTwist(cols, rows, size, ox, oy);
        case 'waterbomb': return genWaterbomb(cols, rows, size, ox, oy);
        default: return genDiagonal(cols, rows, size, ox, oy);
    }
}

function genMiura(cols: number, rows: number, size: number, ox: number, oy: number) {
    const cw = size / cols, ch = size / rows;
    const offset = cw * 0.25;
    const raw: DCrease[] = [];

    const pt = (r: number, c: number): Pt => {
        const xShift = (r % 2 === 1 && c > 0 && c < cols) ? offset : 0;
        return { x: ox + c * cw + xShift, y: oy + r * ch };
    };

    // Horizontals
    for (let r = 0; r <= rows; r++)
        for (let c = 0; c < cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r, c + 1), 'V', size, ox, oy));

    // Verticals
    for (let r = 0; r < rows; r++)
        for (let c = 0; c <= cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r + 1, c), 'M', size, ox, oy));

    return finalize(raw, ox, oy, size);
}

function genSquareTwist(cols: number, rows: number, size: number, ox: number, oy: number) {
    const cw = size / cols, ch = size / rows;
    const raw: DCrease[] = [];

    const pt = (r: number, c: number): Pt => ({ x: ox + c * cw, y: oy + r * ch });

    // Grid
    for (let r = 0; r <= rows; r++)
        for (let c = 0; c < cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r, c + 1), 'V', size, ox, oy));
    for (let r = 0; r < rows; r++)
        for (let c = 0; c <= cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r + 1, c), 'V', size, ox, oy));

    // Alternating diagonals
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
            if ((r + c) % 2 === 0)
                raw.push(mkCrease(pt(r, c), pt(r + 1, c + 1), 'M', size, ox, oy));
            else
                raw.push(mkCrease(pt(r + 1, c), pt(r, c + 1), 'M', size, ox, oy));
        }

    return finalize(raw, ox, oy, size);
}

function genDiagonal(cols: number, rows: number, size: number, ox: number, oy: number) {
    const cw = size / cols, ch = size / rows;
    const raw: DCrease[] = [];
    const pt = (r: number, c: number): Pt => ({ x: ox + c * cw, y: oy + r * ch });

    for (let r = 0; r <= rows; r++)
        for (let c = 0; c < cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r, c + 1), 'V', size, ox, oy));
    for (let r = 0; r < rows; r++)
        for (let c = 0; c <= cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r + 1, c), 'V', size, ox, oy));
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r + 1, c + 1), 'M', size, ox, oy));

    return finalize(raw, ox, oy, size);
}

function genWaterbomb(cols: number, rows: number, size: number, ox: number, oy: number) {
    const cw = size / cols, ch = size / rows;
    const raw: DCrease[] = [];
    const pt = (r: number, c: number): Pt => ({ x: ox + c * cw, y: oy + r * ch });

    // Grid
    for (let r = 0; r <= rows; r++)
        for (let c = 0; c < cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r, c + 1), 'V', size, ox, oy));
    for (let r = 0; r < rows; r++)
        for (let c = 0; c <= cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r + 1, c), 'M', size, ox, oy));

    // Both diagonals in each cell
    for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
            raw.push(mkCrease(pt(r, c), pt(r + 1, c + 1), 'M', size, ox, oy));
            raw.push(mkCrease(pt(r + 1, c), pt(r, c + 1), 'V', size, ox, oy));
        }

    return finalize(raw, ox, oy, size);
}

function mkCrease(p0: Pt, p1: Pt, mv: 'M' | 'V' | 'U', size: number, ox: number, oy: number): DCrease {
    return {
        p0, p1, mv,
        n0: { x: (p0.x - ox) / size, y: (p0.y - oy) / size },
        n1: { x: (p1.x - ox) / size, y: (p1.y - oy) / size },
    };
}

function finalize(creases: DCrease[], ox: number, oy: number, size: number) {
    const pts: Pt[] = [];
    for (const c of creases) { findOrAdd(pts, c.p0); findOrAdd(pts, c.p1); }

    const EPS = 0.5;
    const vertices: DVertex[] = pts.map(p => {
        const cids: number[] = [];
        for (let ci = 0; ci < creases.length; ci++) {
            const c = creases[ci];
            if ((Math.abs(c.p0.x - p.x) < EPS && Math.abs(c.p0.y - p.y) < EPS) ||
                (Math.abs(c.p1.x - p.x) < EPS && Math.abs(c.p1.y - p.y) < EPS))
                cids.push(ci);
        }
        const onEdge = p.x <= ox + 1 || p.x >= ox + size - 1 || p.y <= oy + 1 || p.y >= oy + size - 1;
        return { pos: p, creaseIds: cids, boundary: onEdge, kawasakiOk: true, maekawaOk: true };
    });

    validate(vertices, creases);
    return { creases, vertices };
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validate(vertices: DVertex[], creases: DCrease[]) {
    for (const v of vertices) {
        if (v.boundary) { v.kawasakiOk = true; v.maekawaOk = true; continue; }
        if (v.creaseIds.length < 2) { v.kawasakiOk = true; v.maekawaOk = true; continue; }
        // Odd degree vertices cannot be flat-foldable (Maekawa requires even)
        if (v.creaseIds.length % 2 !== 0) { v.kawasakiOk = false; v.maekawaOk = false; continue; }
        if (v.creaseIds.length < 4) { v.kawasakiOk = true; v.maekawaOk = true; continue; }
        // Kawasaki
        const angles: number[] = [];
        for (const ci of v.creaseIds) {
            const c = creases[ci];
            const other = (Math.abs(c.p0.x - v.pos.x) < 0.5 && Math.abs(c.p0.y - v.pos.y) < 0.5) ? c.p1 : c.p0;
            angles.push(Math.atan2(other.y - v.pos.y, other.x - v.pos.x));
        }
        angles.sort((a, b) => a - b);
        const sectors: number[] = [];
        for (let i = 0; i < angles.length; i++) {
            let d = angles[(i + 1) % angles.length] - angles[i];
            if (d <= 0) d += Math.PI * 2;
            sectors.push(d);
        }
        if (sectors.length >= 4 && sectors.length % 2 === 0) {
            let eS = 0, oS = 0;
            for (let i = 0; i < sectors.length; i++) { if (i % 2 === 0) eS += sectors[i]; else oS += sectors[i]; }
            v.kawasakiOk = Math.abs(eS - Math.PI) < 0.1 && Math.abs(oS - Math.PI) < 0.1;
        } else { v.kawasakiOk = sectors.length < 4; }

        // Maekawa
        let m = 0, vv = 0;
        for (const ci of v.creaseIds) { if (creases[ci].mv === 'M') m++; else if (creases[ci].mv === 'V') vv++; }
        const hasU = v.creaseIds.some(ci => creases[ci].mv === 'U');
        v.maekawaOk = hasU || Math.abs(m - vv) === 2;
    }
}

// ─── Rendering ───────────────────────────────────────────────────────────────

function render(ctx: CanvasRenderingContext2D, state: DesignerState) {
    const { creases, vertices, canvasW: w, canvasH: h, sheetOx: sx, sheetOy: sy, sheetSize: ss, hoveredCrease } = state;
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'var(--bg-color, #141923)';
    ctx.fillRect(0, 0, w, h);

    // Paper
    ctx.fillStyle = PAPER_COL;
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 12;
    ctx.fillRect(sx, sy, ss, ss);
    ctx.shadowBlur = 0;

    // Creases
    for (let i = 0; i < creases.length; i++) {
        const c = creases[i];
        const isHov = i === hoveredCrease;
        ctx.beginPath();
        ctx.moveTo(c.p0.x, c.p0.y);
        ctx.lineTo(c.p1.x, c.p1.y);
        ctx.strokeStyle = isHov ? '#fff' : (c.mv === 'M' ? M_COL : c.mv === 'V' ? V_COL : U_COL);
        ctx.lineWidth = isHov ? 3 : (c.mv === 'U' ? 0.8 : 1.8);
        if (c.mv === 'V') ctx.setLineDash([4, 3]);
        else ctx.setLineDash([]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Vertices with issues
    for (const v of vertices) {
        if (v.boundary) continue;
        const ok = v.kawasakiOk && v.maekawaOk;
        ctx.beginPath();
        ctx.arc(v.pos.x, v.pos.y, ok ? 2 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = ok ? 'rgba(46,204,113,0.4)' : '#e74c3c';
        ctx.fill();
    }
}

// ─── SVG Export ──────────────────────────────────────────────────────────────

function exportSVG(state: DesignerState): string {
    const { paperW, paperH, creases } = state;
    const lines = creases.map(c => {
        const x1 = (c.n0.x * paperW).toFixed(2);
        const y1 = (c.n0.y * paperH).toFixed(2);
        const x2 = (c.n1.x * paperW).toFixed(2);
        const y2 = (c.n1.y * paperH).toFixed(2);
        const color = c.mv === 'M' ? 'red' : c.mv === 'V' ? 'blue' : '#999';
        const dash = c.mv === 'V' ? ' stroke-dasharray="3,2"' : '';
        const width = c.mv === 'U' ? '0.3' : '0.5';
        return `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash}/>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${paperW}mm" height="${paperH}mm" viewBox="0 0 ${paperW} ${paperH}">
  <rect width="${paperW}" height="${paperH}" fill="#faf3e0" stroke="#ccc" stroke-width="0.5"/>
${lines}
</svg>`;
}

// ─── PDF Export (SVG embedded) ───────────────────────────────────────────────

function exportPDF(state: DesignerState) {
    // Simple approach: create a printable HTML page with the SVG
    const svg = exportSVG(state);
    const html = `<!DOCTYPE html>
<html><head><title>Crease Pattern - ${state.pattern}</title>
<style>body{margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh}
@media print{@page{size:${state.paperW}mm ${state.paperH}mm;margin:0}}</style>
</head><body>${svg}</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (w) {
        w.onload = () => { w.print(); URL.revokeObjectURL(url); };
    }
}

// ─── 3D Print Export (STL with living hinges) ────────────────────────────────
//
// Concept:
//   Panel (face between creases) = solid slab, e.g. 2mm thick
//   Crease line (hinge) = thin living hinge strip, e.g. 0.4mm thick × 1.5mm wide
//
// The hinge is thinner so it bends; the panels are rigid.
// For each grid cell we extrude a polygon as a panel.
// Along each crease we place a thin bridge connecting adjacent panels.
//
// Geometry (all in mm, matching paperW × paperH):
//   - Panel: rectangle extruded to PANEL_THICKNESS
//   - Hinge: narrow rectangle along crease, extruded to HINGE_THICKNESS
//   - Small gap between panel edge and hinge for flexibility

const PANEL_THICKNESS = 2.0;   // mm
const HINGE_THICKNESS = 0.4;   // mm
const HINGE_WIDTH = 1.5;       // mm (width of the hinge strip)
const HINGE_GAP = 0.3;         // mm gap between panel and hinge

interface Face {
    /** Vertices in order (normalized 0-1 coords) */
    pts: Pt[];
}

/**
 * Extract rectangular faces from grid-based crease patterns.
 * For grid patterns, faces are the cells between grid lines.
 */
function extractFaces(state: DesignerState): Face[] {
    const { cols, rows } = state;
    const faces: Face[] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Each grid cell is a face
            const x0 = c / cols, y0 = r / rows;
            const x1 = (c + 1) / cols, y1 = (r + 1) / rows;
            faces.push({
                pts: [
                    { x: x0, y: y0 },
                    { x: x1, y: y0 },
                    { x: x1, y: y1 },
                    { x: x0, y: y1 },
                ],
            });
        }
    }
    return faces;
}

/**
 * Build STL binary buffer with panels and hinges.
 */
function buildPrintableSTL(state: DesignerState): ArrayBuffer {
    const { paperW, paperH, creases } = state;
    const faces = extractFaces(state);
    const triangles: number[][] = []; // each: [nx,ny,nz, v1x,v1y,v1z, v2x,v2y,v2z, v3x,v3y,v3z]

    // Helper: add a box (6 faces = 12 triangles)
    function addBox(x: number, y: number, w: number, h: number, z0: number, z1: number) {
        // Bottom face (z=z0)
        triangles.push([0,0,-1, x,y,z0, x+w,y,z0, x+w,y+h,z0]);
        triangles.push([0,0,-1, x,y,z0, x+w,y+h,z0, x,y+h,z0]);
        // Top face (z=z1)
        triangles.push([0,0,1, x,y,z1, x+w,y+h,z1, x+w,y,z1]);
        triangles.push([0,0,1, x,y,z1, x,y+h,z1, x+w,y+h,z1]);
        // Front (y=y)
        triangles.push([0,-1,0, x,y,z0, x+w,y,z0, x+w,y,z1]);
        triangles.push([0,-1,0, x,y,z0, x+w,y,z1, x,y,z1]);
        // Back (y=y+h)
        triangles.push([0,1,0, x,y+h,z0, x+w,y+h,z1, x+w,y+h,z0]);
        triangles.push([0,1,0, x,y+h,z0, x,y+h,z1, x+w,y+h,z1]);
        // Left (x=x)
        triangles.push([-1,0,0, x,y,z0, x,y+h,z1, x,y+h,z0]);
        triangles.push([-1,0,0, x,y,z0, x,y,z1, x,y+h,z1]);
        // Right (x=x+w)
        triangles.push([1,0,0, x+w,y,z0, x+w,y+h,z0, x+w,y+h,z1]);
        triangles.push([1,0,0, x+w,y,z0, x+w,y+h,z1, x+w,y,z1]);
    }

    // --- Panels: each face is a rectangular slab with inset for hinge gaps ---
    const gap = HINGE_GAP + HINGE_WIDTH / 2; // total inset per side in mm
    for (const face of faces) {
        const x = face.pts[0].x * paperW + gap;
        const y = face.pts[0].y * paperH + gap;
        const w = (face.pts[1].x - face.pts[0].x) * paperW - gap * 2;
        const h = (face.pts[2].y - face.pts[0].y) * paperH - gap * 2;
        if (w > 0.1 && h > 0.1) {
            addBox(x, y, w, h, 0, PANEL_THICKNESS);
        }
    }

    // --- Hinges: thin strips along each crease line ---
    const hw = HINGE_WIDTH;
    for (const c of creases) {
        if (c.mv === 'U') continue; // only assigned creases get hinges

        const x0 = c.n0.x * paperW, y0 = c.n0.y * paperH;
        const x1 = c.n1.x * paperW, y1 = c.n1.y * paperH;
        const dx = x1 - x0, dy = y1 - y0;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 0.1) continue;

        // Perpendicular direction for hinge width
        const px = -dy / len * (hw / 2);
        const py = dx / len * (hw / 2);

        // Hinge is a thin box along the crease
        // We approximate with an axis-aligned box for simplicity
        const isHorizontal = Math.abs(dy) < 0.1;
        const isVertical = Math.abs(dx) < 0.1;

        if (isHorizontal) {
            const hx = Math.min(x0, x1);
            const hy = Math.min(y0, y1) - hw / 2;
            addBox(hx, hy, Math.abs(dx), hw, 0, HINGE_THICKNESS);
        } else if (isVertical) {
            const hx = Math.min(x0, x1) - hw / 2;
            const hy = Math.min(y0, y1);
            addBox(hx, hy, hw, Math.abs(dy), 0, HINGE_THICKNESS);
        } else {
            // Diagonal hinge: approximate as series of small boxes
            const steps = Math.ceil(len / 3);
            const stepLen = len / steps;
            const ndx = dx / len, ndy = dy / len;
            for (let s = 0; s < steps; s++) {
                const sx = x0 + ndx * stepLen * s + px;
                const sy = y0 + ndy * stepLen * s + py;
                const sw = Math.abs(ndx * stepLen) + hw * Math.abs(ndy / ndx || 0) * 0.5;
                const sh = Math.abs(ndy * stepLen) + hw * Math.abs(ndx / ndy || 0) * 0.5;
                addBox(
                    Math.min(sx, sx + ndx * stepLen),
                    Math.min(sy, sy + ndy * stepLen),
                    Math.max(sw, hw), Math.max(sh, hw),
                    0, HINGE_THICKNESS
                );
            }
        }
    }

    // --- Encode as binary STL ---
    const numTriangles = triangles.length;
    const bufferSize = 84 + numTriangles * 50; // 80 header + 4 count + 50 per triangle
    const buffer = new ArrayBuffer(bufferSize);
    const view = new DataView(buffer);

    // Header (80 bytes)
    const header = 'Crease Pattern 3D Print - Living Hinge Model';
    for (let i = 0; i < 80; i++) {
        view.setUint8(i, i < header.length ? header.charCodeAt(i) : 0);
    }

    // Triangle count
    view.setUint32(80, numTriangles, true);

    // Triangles
    let offset = 84;
    for (const tri of triangles) {
        // Normal (3 floats)
        view.setFloat32(offset, tri[0], true); offset += 4;
        view.setFloat32(offset, tri[1], true); offset += 4;
        view.setFloat32(offset, tri[2], true); offset += 4;
        // Vertex 1
        view.setFloat32(offset, tri[3], true); offset += 4;
        view.setFloat32(offset, tri[4], true); offset += 4;
        view.setFloat32(offset, tri[5], true); offset += 4;
        // Vertex 2
        view.setFloat32(offset, tri[6], true); offset += 4;
        view.setFloat32(offset, tri[7], true); offset += 4;
        view.setFloat32(offset, tri[8], true); offset += 4;
        // Vertex 3
        view.setFloat32(offset, tri[9], true); offset += 4;
        view.setFloat32(offset, tri[10], true); offset += 4;
        view.setFloat32(offset, tri[11], true); offset += 4;
        // Attribute byte count
        view.setUint16(offset, 0, true); offset += 2;
    }

    return buffer;
}

function exportSTL(state: DesignerState) {
    const buffer = buildPrintableSTL(state);
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crease-pattern-${state.pattern}-3dprint.stl`;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Main init ───────────────────────────────────────────────────────────────

export function initDesigner(): () => void {
    const canvas = document.getElementById('designer-canvas') as HTMLCanvasElement | null;
    if (!canvas) return () => {};

    const container = canvas.parentElement!;
    const dpr = window.devicePixelRatio || 1;

    const state: DesignerState = {
        pattern: 'miura',
        cols: 8,
        rows: 6,
        paperW: 210,
        paperH: 210,
        creases: [],
        vertices: [],
        hoveredCrease: -1,
        canvasW: 0,
        canvasH: 0,
        sheetOx: 0,
        sheetOy: 0,
        sheetSize: 0,
    };

    const ctx = canvas.getContext('2d')!;

    function resize() {
        const w = container.clientWidth;
        const h = container.clientHeight;
        canvas!.width = w * dpr;
        canvas!.height = h * dpr;
        canvas!.style.width = w + 'px';
        canvas!.style.height = h + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        state.canvasW = w;
        state.canvasH = h;
        const pad = 40;
        state.sheetSize = Math.min(w, h) - pad * 2;
        state.sheetOx = (w - state.sheetSize) / 2;
        state.sheetOy = (h - state.sheetSize) / 2;
    }

    function rebuild() {
        resize();
        const { creases, vertices } = generatePattern(
            state.pattern, state.cols, state.rows,
            state.sheetSize, state.sheetOx, state.sheetOy
        );
        state.creases = creases;
        state.vertices = vertices;
        updateValidation();
        render(ctx, state);
    }

    function updateValidation() {
        validate(state.vertices, state.creases);
        const el = document.getElementById('validation-status');
        if (!el) return;
        const invalid = state.vertices.filter(v => !v.boundary && v.creaseIds.length >= 4 && (!v.kawasakiOk || !v.maekawaOk));
        const total = state.vertices.filter(v => !v.boundary && v.creaseIds.length >= 4).length;
        if (invalid.length === 0) {
            el.innerHTML = '<span class="status-dot status-dot--ok"></span> All ' + total + ' vertices valid';
        } else {
            el.innerHTML = '<span class="status-dot status-dot--err"></span> ' + invalid.length + '/' + total + ' vertices invalid';
        }
    }

    // Bind controls
    const bind = (id: string, event: string, handler: (e: Event) => void) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, handler);
    };

    bind('pattern-select', 'change', (e) => {
        state.pattern = (e.target as HTMLSelectElement).value;
        rebuild();
    });

    const sliderBind = (sliderId: string, valId: string, key: 'cols' | 'rows' | 'paperW' | 'paperH') => {
        bind(sliderId, 'input', (e) => {
            const val = parseInt((e.target as HTMLInputElement).value);
            (state as any)[key] = val;
            const valEl = document.getElementById(valId);
            if (valEl) valEl.textContent = String(val);
            rebuild();
        });
    };

    sliderBind('cols-slider', 'cols-val', 'cols');
    sliderBind('rows-slider', 'rows-val', 'rows');
    sliderBind('paper-w-slider', 'paper-w-val', 'paperW');
    sliderBind('paper-h-slider', 'paper-h-val', 'paperH');

    bind('export-svg', 'click', () => {
        const svg = exportSVG(state);
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crease-pattern-${state.pattern}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    });

    bind('export-pdf', 'click', () => exportPDF(state));
    bind('export-stl', 'click', () => exportSTL(state));

    // Canvas interaction
    const getXY = (e: MouseEvent): [number, number] => {
        const r = canvas!.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    };

    const hitCrease = (mx: number, my: number): number => {
        let best = -1, bestDist = 6;
        for (let i = 0; i < state.creases.length; i++) {
            const c = state.creases[i];
            const dx = c.p1.x - c.p0.x, dy = c.p1.y - c.p0.y;
            const len2 = dx * dx + dy * dy;
            if (len2 < 1) continue;
            const t = Math.max(0, Math.min(1, ((mx - c.p0.x) * dx + (my - c.p0.y) * dy) / len2));
            const px = c.p0.x + t * dx, py = c.p0.y + t * dy;
            const d = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
            if (d < bestDist) { bestDist = d; best = i; }
        }
        return best;
    };

    const onClick = (e: MouseEvent) => {
        const [mx, my] = getXY(e);
        const idx = hitCrease(mx, my);
        if (idx >= 0) {
            const c = state.creases[idx];
            c.mv = c.mv === 'U' ? 'M' : c.mv === 'M' ? 'V' : 'U';
            updateValidation();
            render(ctx, state);
        }
    };

    const onMove = (e: MouseEvent) => {
        const [mx, my] = getXY(e);
        state.hoveredCrease = hitCrease(mx, my);
        canvas!.style.cursor = state.hoveredCrease >= 0 ? 'pointer' : 'default';
        render(ctx, state);
    };

    const onResize = () => rebuild();

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('resize', onResize);

    // Initial build
    rebuild();

    return () => {
        canvas.removeEventListener('click', onClick);
        canvas.removeEventListener('mousemove', onMove);
        window.removeEventListener('resize', onResize);
    };
}
