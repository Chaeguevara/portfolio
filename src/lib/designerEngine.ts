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
        case 'masu-box': return genMasuBox(size, ox, oy);
        case 'tray-box': return genTrayBox(cols, rows, size, ox, oy);
        default: return genDiagonal(cols, rows, size, ox, oy);
    }
}

// Glueless box (Masu) — folds to a 3D open-top cube.
// NOT flat-foldable: interior vertices are degree-5 (Maekawa fails by parity).
// LFFG framework still applies for verifying the pre-fold state and edge-locking
// behaviour at the corner triangles, but the final form is 3D, not flat.
function genMasuBox(size: number, ox: number, oy: number) {
    const raw: DCrease[] = [];
    const u = size / 4;
    const pt = (r: number, c: number): Pt => ({ x: ox + c * u, y: oy + r * u });

    // 4×4 grid: only the 4 wall creases (between bottom and walls). The two outer
    // grid lines are paper edges (not folded); inner two are box wall hinges.
    const wall = (p0: Pt, p1: Pt) => raw.push(mkCrease(p0, p1, 'M', size, ox, oy));
    wall(pt(1, 1), pt(1, 3)); // top wall hinge
    wall(pt(3, 1), pt(3, 3)); // bottom wall hinge
    wall(pt(1, 1), pt(3, 1)); // left wall hinge
    wall(pt(1, 3), pt(3, 3)); // right wall hinge

    // Corner-tab diagonals (V): each outer corner folds along the diagonal,
    // tucking a triangular tab inside an adjacent wall — this is the lock.
    const diag = (p0: Pt, p1: Pt) => raw.push(mkCrease(p0, p1, 'V', size, ox, oy));
    diag(pt(0, 0), pt(1, 1));
    diag(pt(0, 4), pt(1, 3));
    diag(pt(4, 0), pt(3, 1));
    diag(pt(4, 4), pt(3, 3));

    // Tab-fold M creases that pre-bias the triangle to fold inward
    const fold = (p0: Pt, p1: Pt) => raw.push(mkCrease(p0, p1, 'M', size, ox, oy));
    fold(pt(1, 1), pt(0, 2));
    fold(pt(1, 1), pt(2, 0));
    fold(pt(1, 3), pt(0, 2));
    fold(pt(1, 3), pt(2, 4));
    fold(pt(3, 1), pt(4, 2));
    fold(pt(3, 1), pt(2, 0));
    fold(pt(3, 3), pt(4, 2));
    fold(pt(3, 3), pt(2, 4));

    return finalize(raw, ox, oy, size);
}

// Cross-shaped tray box — purely 90° M folds, glueless via tab-and-slot lock.
// Not a flat-fold pattern at all (rigid origami only). Validation flags expected.
function genTrayBox(cols: number, rows: number, size: number, ox: number, oy: number) {
    const raw: DCrease[] = [];
    // We build a fixed cross shape inside the paper regardless of cols/rows
    // (sliders left active for paper sizing only).
    void cols; void rows;
    const u = size / 5;
    const pt = (r: number, c: number): Pt => ({ x: ox + c * u, y: oy + r * u });

    const m = (p0: Pt, p1: Pt) => raw.push(mkCrease(p0, p1, 'M', size, ox, oy));
    // Bottom outline (cells (2,1)-(2,3) is the box floor; (3,1)-(3,3) too — 2×3 floor)
    m(pt(2, 1), pt(2, 4)); // top hinge of floor
    m(pt(3, 1), pt(3, 4)); // bottom hinge of floor
    m(pt(2, 1), pt(3, 1)); // left hinge
    m(pt(2, 4), pt(3, 4)); // right hinge

    // Outer wall outlines drawn as light U-creases for cut-line guidance
    const u_ = (p0: Pt, p1: Pt) => raw.push(mkCrease(p0, p1, 'U', size, ox, oy));
    u_(pt(1, 1), pt(1, 4)); // top wall top edge
    u_(pt(1, 1), pt(2, 1));
    u_(pt(1, 4), pt(2, 4));
    u_(pt(4, 1), pt(4, 4)); // bottom wall bottom edge
    u_(pt(3, 1), pt(4, 1));
    u_(pt(3, 4), pt(4, 4));
    u_(pt(2, 0), pt(3, 0)); // left wall left edge
    u_(pt(2, 0), pt(2, 1));
    u_(pt(3, 0), pt(3, 1));
    u_(pt(2, 5), pt(3, 5)); // right wall right edge
    u_(pt(2, 5), pt(2, 4));
    u_(pt(3, 5), pt(3, 4));

    return finalize(raw, ox, oy, size);
}

function genMiura(cols: number, rows: number, size: number, ox: number, oy: number) {
    const cw = size / cols, ch = size / rows;
    const offset = cw * 0.25;
    const raw: DCrease[] = [];

    const pt = (r: number, c: number): Pt => {
        const xShift = (r % 2 === 1 && c > 0 && c < cols) ? offset : 0;
        return { x: ox + c * cw + xShift, y: oy + r * ch };
    };

    // Horizontals: all V (zigzag lines)
    for (let r = 0; r <= rows; r++)
        for (let c = 0; c < cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r, c + 1), 'V', size, ox, oy));

    // Verticals: alternate M/V per row so every interior vertex gets 3V:1M
    // Vertical from row r to r+1: M when r even, V when r odd
    for (let r = 0; r < rows; r++)
        for (let c = 0; c <= cols; c++)
            raw.push(mkCrease(pt(r, c), pt(r + 1, c), r % 2 === 0 ? 'M' : 'V', size, ox, oy));

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

import { buildGraph, extractFaces as extractPGFaces } from './planarGraph';

// ─── 3D Print Export (parametric pin-hinges via THREE.Shape) ─────────────────
//
// Parametric model. The geometry is built with THREE.Shape + ExtrudeGeometry
// so the lollipop-shaped knuckle cross-section (tab + half-disc + bore hole)
// is described once analytically, then extruded along each crease axis.
// Maintenance: change a constant below → all geometry updates consistently.
//
// Cross-section (in the plane perpendicular to the crease):
//
//      Y (vertical, = world Z)
//      ▲
//   T ─┤───┐                  ●●●
//      │   │tab             ●     ●
//   ½T ┤   │      ←─bore──→ │  ⊙   │     ⊙ = bore (Ø 2·R_IN)
//      │   │               ●     ●
//   0 ─┤───┘                  ●●●
//      └───┴─────────────────► X (perp to crease, in paper plane)
//      -d  0                 R_OUT
//
//  Side A: tab on -X (panel A side), disc bulges +X, hinge axis at (0, ½T)
//  Side B: mirror image (tab +X, disc -X)
//
//  Extruded for KNUCKLE_LEN along Z (= crease direction in world).
//
// Why R_OUT = T/2:
//   The knuckle's outer circle is exactly inscribed in panel thickness, so
//   when the hinge folds 90° the rotating knuckle never protrudes beyond the
//   panel surface (no surface-to-surface interference at fold).
//
// Why panel inset d = R_OUT + clearance:
//   The closest the panel face can sit to the rotation axis without the
//   knuckle scraping it during rotation. With clearance > 0, hinge spins free.
//
// Adjacent knuckles alternate ownership (A, B, A, B …) along the crease,
// so when assembled the bores line up but the tabs interleave like a piano
// hinge. Pin = 1.5mm rod (filament/wire) inserted post-print, OR print-in-
// place with the geometry as-is (slicer adds 0.3mm clearance via gap).

const T = 2.0;                       // panel thickness
const R_OUT = T / 2;                 // = 1.0 — knuckle inscribed in panel thickness
const R_IN = 0.7;                    // bore radius (Ø 1.4mm, fits 1.5mm pin + clearance)
const PANEL_INSET = R_OUT + 0.2;     // = 1.2 — distance from crease to panel edge
const KNUCKLE_LEN = 3.0;             // axial length of one knuckle
const KNUCKLE_GAP = 0.4;             // axial clearance between adjacent knuckles
const ARC_SEGMENTS = 16;             // disc facet count

interface Face {
    /** Vertices in order (normalized 0-1 coords) */
    pts: Pt[];
}

/**
 * Extract rectangular faces from grid-based crease patterns.
 * Only valid for tessellation patterns (Miura, diagonal, waterbomb).
 * For Masu/Tray boxes the face topology is non-grid and STL is disabled.
 */
function extractFaces(state: DesignerState): Face[] {
    const { cols, rows } = state;
    const faces: Face[] = [];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
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
 * Parametric lollipop cross-section for one knuckle.
 * Side 'A' = tab on -X (panel A direction), disc bulges +X.
 * Side 'B' = mirrored.
 * Hole = bore through disc center for the pin.
 */
function buildKnuckleShape(THREE: typeof import('three'), side: 'A' | 'B'): InstanceType<typeof THREE.Shape> {
    const shape = new THREE.Shape();
    if (side === 'A') {
        // Outline CCW: (-d,0) → (0,0) → arc(+X half) → (0,T) → (-d,T) → close
        shape.moveTo(-PANEL_INSET, 0);
        shape.lineTo(0, 0);
        shape.absarc(0, T / 2, R_OUT, -Math.PI / 2, Math.PI / 2, false);
        shape.lineTo(-PANEL_INSET, T);
        shape.lineTo(-PANEL_INSET, 0);
    } else {
        // Mirror image: (d,0) → (d,T) → (0,T) → arc(-X half) → (0,0) → close
        shape.moveTo(PANEL_INSET, 0);
        shape.lineTo(PANEL_INSET, T);
        shape.lineTo(0, T);
        shape.absarc(0, T / 2, R_OUT, Math.PI / 2, 3 * Math.PI / 2, false);
        shape.lineTo(PANEL_INSET, 0);
    }

    // Bore — hole subpath (clockwise winding)
    const hole = new THREE.Path();
    hole.absarc(0, T / 2, R_IN, 0, Math.PI * 2, true);
    shape.holes.push(hole);

    return shape;
}

/**
 * World transform for a knuckle.
 *
 * Local frame:
 *   X = perpendicular to crease (in paper plane)
 *   Y = vertical (= world Z)
 *   Z = along crease (extrusion axis)
 *
 * World frame:
 *   X = paper X, Y = paper Y, Z = up
 *
 * Origin (0,0,0) maps to (px, py, 0) — the start of the knuckle on the
 * crease line at floor level.
 */
function knuckleMatrix(THREE: typeof import('three'),
                       sx: number, sy: number, ux: number, uy: number): InstanceType<typeof THREE.Matrix4> {
    const m = new THREE.Matrix4();
    // perp in paper plane (left-hand rotated): (-uy, ux)
    // Rows of M; col 0 = localX-in-world, col 1 = localY-in-world, col 2 = localZ-in-world, col 3 = origin
    m.set(
        -uy, 0, ux, sx,
         ux, 0, uy, sy,
          0, 1,  0,  0,
          0, 0,  0,  1
    );
    return m;
}

/**
 * Build the printable mesh: panels + knuckles, returned as one merged Mesh.
 * Each panel is a simple inset box. Each knuckle is a parametric lollipop
 * extrusion with bore. They overlap deliberately at tab/panel edges — the
 * slicer treats coincident manifold meshes as union, which is the standard
 * "multi-part STL" pattern (used widely for print-in-place mechanisms).
 */
async function buildPrintableMesh(state: DesignerState): Promise<{
    geometry: import('three').BufferGeometry;
    THREE: typeof import('three');
}> {
    const THREE = await import('three');
    const BufferGeometryUtils = await import('three/examples/jsm/utils/BufferGeometryUtils.js');

    const { paperW, paperH, creases } = state;
    const faces = extractFaces(state);
    const geoms: InstanceType<typeof THREE.BufferGeometry>[] = [];

    // Panels — inset on all sides by PANEL_INSET (deckle edge along paper boundary too)
    for (const face of faces) {
        const x = face.pts[0].x * paperW + PANEL_INSET;
        const y = face.pts[0].y * paperH + PANEL_INSET;
        const w = (face.pts[1].x - face.pts[0].x) * paperW - 2 * PANEL_INSET;
        const h = (face.pts[2].y - face.pts[0].y) * paperH - 2 * PANEL_INSET;
        if (w < 0.5 || h < 0.5) continue;
        const g = new THREE.BoxGeometry(w, h, T);
        g.translate(x + w / 2, y + h / 2, T / 2);
        geoms.push(g);
    }

    // Knuckles — alternating A/B along each assigned crease
    const knuckleStride = KNUCKLE_LEN + KNUCKLE_GAP;
    const extrudeOpts = {
        depth: KNUCKLE_LEN,
        bevelEnabled: false,
        steps: 1,
        curveSegments: ARC_SEGMENTS,
    };

    for (const c of creases) {
        if (c.mv === 'U') continue;
        const x0 = c.n0.x * paperW, y0 = c.n0.y * paperH;
        const x1 = c.n1.x * paperW, y1 = c.n1.y * paperH;
        const dx = x1 - x0, dy = y1 - y0;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < KNUCKLE_LEN * 2 + KNUCKLE_GAP) continue; // need ≥2 knuckles for a real hinge

        const ux = dx / len, uy = dy / len;

        const numKnuckles = Math.floor((len + KNUCKLE_GAP) / knuckleStride);
        if (numKnuckles < 2) continue;
        const totalLen = numKnuckles * KNUCKLE_LEN + (numKnuckles - 1) * KNUCKLE_GAP;
        const startOffset = (len - totalLen) / 2;

        // Pre-build A / B shapes once per crease (reuse across knuckles)
        const shapeA = buildKnuckleShape(THREE, 'A');
        const shapeB = buildKnuckleShape(THREE, 'B');

        for (let i = 0; i < numKnuckles; i++) {
            const side = i % 2 === 0 ? 'A' : 'B';
            const shape = side === 'A' ? shapeA : shapeB;
            const s0 = startOffset + i * knuckleStride;
            const sx = x0 + ux * s0, sy = y0 + uy * s0;

            const g = new THREE.ExtrudeGeometry(shape, extrudeOpts);
            g.applyMatrix4(knuckleMatrix(THREE, sx, sy, ux, uy));
            geoms.push(g);
        }
    }

    if (geoms.length === 0) {
        return { geometry: new THREE.BufferGeometry(), THREE };
    }

    // Normalize geometry attributes (BoxGeometry has uv/normal, ExtrudeGeometry too,
    // but mergeGeometries requires consistent attribute sets).
    for (const g of geoms) {
        if (g.attributes.uv && !g.attributes.normal) g.computeVertexNormals();
    }
    // Merge into one buffer. Box (indexed, has uv) + Extrude (non-indexed, no uv)
    // need normalization: convert all to non-indexed and strip uv before merging.
    const cleaned = geoms.map(g => {
        const flat = g.index ? g.toNonIndexed() : g.clone();
        delete (flat.attributes as Record<string, unknown>).uv;
        // Keep only position + normal (STL only needs position; normals recomputed)
        for (const key of Object.keys(flat.attributes)) {
            if (key !== 'position' && key !== 'normal') {
                delete (flat.attributes as Record<string, unknown>)[key];
            }
        }
        if (!flat.attributes.normal) flat.computeVertexNormals();
        return flat as InstanceType<typeof THREE.BufferGeometry>;
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const merged = (BufferGeometryUtils.mergeGeometries as any)(cleaned, false);
    if (!merged) {
        throw new Error('Geometry merge failed — incompatible attributes between panels and knuckles.');
    }
    return { geometry: merged, THREE };
}

async function exportSTL(state: DesignerState): Promise<void> {
    if (state.pattern === 'masu-box' || state.pattern === 'tray-box') {
        alert('STL export currently supports tessellation patterns only (Miura, Square Twist, Diagonal, Waterbomb). Glueless boxes have non-grid face topology — coming soon.');
        return;
    }

    const { geometry, THREE } = await buildPrintableMesh(state);
    const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter.js');
    const mesh = new THREE.Mesh(geometry);
    const result = new STLExporter().parse(mesh, { binary: true }) as DataView;

    const blob = new Blob([result.buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crease-pattern-${state.pattern}-3dprint.stl`;
    a.click();
    URL.revokeObjectURL(url);

    geometry.dispose();
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
        update3DPreview();
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

    // ─── 3D Preview lifecycle ────────────────────────────────────────────
    // Mounts the Three.js viewport into #designer-3d. Updates whenever the
    // crease pattern changes. Built lazily via dynamic import.
    type PreviewCtl = import('./designer3DPreview').Preview3DController | null;
    let preview3D: PreviewCtl = null;
    const preview3DMount = document.getElementById('designer-3d');

    if (preview3DMount) {
        import('./designer3DPreview').then(mod => {
            return mod.initPreview3D(preview3DMount, {
                panelInset: PANEL_INSET,
                panelT: T,
                knuckleR: R_OUT,
                boreR: R_IN,
                knuckleLen: KNUCKLE_LEN,
                knuckleGap: KNUCKLE_GAP,
            });
        }).then(ctl => {
            preview3D = ctl;
            update3DPreview();
            // Bind toggles after preview is ready
            const bindToggle = (id: string, fn: (v: boolean) => void) => {
                const el = document.getElementById(id) as HTMLInputElement | null;
                if (el) el.addEventListener('change', () => fn(el.checked));
            };
            bindToggle('show-panels', v => ctl.setShowPanels(v));
            bindToggle('show-hinges', v => ctl.setShowHinges(v));
            bindToggle('show-wireframe', v => ctl.setWireframe(v));
        }).catch(err => {
            console.error('[Designer] 3D preview init failed', err);
        });
    }

    // Compute face decomposition + push it to the 3D preview.
    function update3DPreview() {
        if (!preview3D) return;

        // Map crease coords from canvas pixels to mm via paper bounds
        const sx = state.sheetOx, sy = state.sheetOy, ss = state.sheetSize;
        const toMm = (px: number, py: number) => ({
            x: ((px - sx) / ss) * state.paperW,
            y: ((py - sy) / ss) * state.paperH,
        });

        const segs = state.creases.map(c => ({
            p0: toMm(c.p0.x, c.p0.y),
            p1: toMm(c.p1.x, c.p1.y),
        }));

        const { verts, edges } = buildGraph(segs, {
            minX: 0, minY: 0, maxX: state.paperW, maxY: state.paperH,
        });
        const faces = extractPGFaces(verts, edges);

        const previewCreases = state.creases.map(c => ({
            p0: toMm(c.p0.x, c.p0.y),
            p1: toMm(c.p1.x, c.p1.y),
            mv: c.mv,
        }));

        preview3D.update({
            verts,
            faces,
            creases: previewCreases,
            paperW: state.paperW,
            paperH: state.paperH,
        });
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
    bind('export-stl', 'click', () => { void exportSTL(state); });

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
            update3DPreview();
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
        if (preview3D) { preview3D.dispose(); preview3D = null; }
    };
}
