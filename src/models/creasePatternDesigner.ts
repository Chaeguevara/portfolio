/**
 * @fileoverview Flat-Foldable Crease Pattern Designer
 *
 * Preset tessellation patterns (Miura-ori, square twist, diagonal grid)
 * with real-time Kawasaki + Maekawa validation at every vertex.
 * Click creases to toggle M/V assignment; invalid vertices highlight red.
 *
 * Based on MIT 6.849 — flat-foldability of tessellations.
 */

import * as THREE from 'three';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Pt { x: number; y: number; }

interface TessCrease {
    p0: Pt;
    p1: Pt;
    mv: 'M' | 'V' | 'U';
}

interface TessVertex {
    pos: Pt;
    creaseIndices: number[];
    boundary: boolean;
    kawasakiOk: boolean;
    maekawaOk: boolean;
}

interface Tessellation {
    name: string;
    build: (size: number, ox: number, oy: number) => { creases: TessCrease[]; vertices: TessVertex[] };
    description: string;
}

// ─── Pattern builders ────────────────────────────────────────────────────────

function findOrAddVertex(verts: Pt[], p: Pt): number {
    const EPS = 0.5;
    for (let i = 0; i < verts.length; i++) {
        if (Math.abs(verts[i].x - p.x) < EPS && Math.abs(verts[i].y - p.y) < EPS) return i;
    }
    verts.push({ ...p });
    return verts.length - 1;
}

function buildMiuraOri(size: number, ox: number, oy: number) {
    const rows = 6, cols = 8;
    const cellW = size / cols;
    const cellH = size / rows;
    const offset = cellW * 0.25; // zigzag offset

    const pts: Pt[] = [];
    const rawCreases: [number, number][] = [];

    // Generate grid vertices with zigzag
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c <= cols; c++) {
            const xShift = (r % 2 === 1 && c > 0 && c < cols) ? offset : 0;
            pts.push({ x: ox + c * cellW + xShift, y: oy + r * cellH });
        }
    }

    const idx = (r: number, c: number) => r * (cols + 1) + c;

    // Horizontal creases
    for (let r = 0; r <= rows; r++) {
        for (let c = 0; c < cols; c++) {
            rawCreases.push([idx(r, c), idx(r, c + 1)]);
        }
    }

    // Vertical/diagonal creases
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c <= cols; c++) {
            rawCreases.push([idx(r, c), idx(r + 1, c)]);
        }
    }

    // Build creases and vertices
    const creases: TessCrease[] = rawCreases.map(([i0, i1]) => ({
        p0: pts[i0], p1: pts[i1], mv: 'U' as const,
    }));

    // Default MV: horizontals = V, verticals = M
    for (let i = 0; i < creases.length; i++) {
        const c = creases[i];
        const dy = Math.abs(c.p1.y - c.p0.y);
        const dx = Math.abs(c.p1.x - c.p0.x);
        if (dy < 1) creases[i].mv = 'V';      // horizontal
        else if (dx < cellW * 0.4) creases[i].mv = 'M';  // mostly vertical
        else creases[i].mv = 'M';
    }

    const vertices = buildVerticesFromCreases(pts, creases, ox, oy, size);
    return { creases, vertices };
}

function buildSquareTwist(size: number, ox: number, oy: number) {
    const n = 4; // 4x4 grid
    const cell = size / n;
    const pts: Pt[] = [];
    const rawCreases: [Pt, Pt, 'M' | 'V' | 'U'][] = [];

    // Grid vertices
    for (let r = 0; r <= n; r++) {
        for (let c = 0; c <= n; c++) {
            pts.push({ x: ox + c * cell, y: oy + r * cell });
        }
    }

    // Grid lines (horizontal + vertical)
    for (let r = 0; r <= n; r++) {
        for (let c = 0; c < n; c++) {
            rawCreases.push([
                { x: ox + c * cell, y: oy + r * cell },
                { x: ox + (c + 1) * cell, y: oy + r * cell },
                r === 0 || r === n ? 'U' : 'V',
            ]);
        }
    }
    for (let r = 0; r < n; r++) {
        for (let c = 0; c <= n; c++) {
            rawCreases.push([
                { x: ox + c * cell, y: oy + r * cell },
                { x: ox + c * cell, y: oy + (r + 1) * cell },
                c === 0 || c === n ? 'U' : 'V',
            ]);
        }
    }

    // Diagonal creases in alternating cells
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if ((r + c) % 2 === 0) {
                rawCreases.push([
                    { x: ox + c * cell, y: oy + r * cell },
                    { x: ox + (c + 1) * cell, y: oy + (r + 1) * cell },
                    'M',
                ]);
            } else {
                rawCreases.push([
                    { x: ox + (c + 1) * cell, y: oy + r * cell },
                    { x: ox + c * cell, y: oy + (r + 1) * cell },
                    'M',
                ]);
            }
        }
    }

    const creases: TessCrease[] = rawCreases.map(([p0, p1, mv]) => ({
        p0: p0 as Pt, p1: p1 as Pt, mv,
    }));

    const allPts: Pt[] = [];
    for (const c of creases) {
        findOrAddVertex(allPts, c.p0);
        findOrAddVertex(allPts, c.p1);
    }

    const vertices = buildVerticesFromCreases(allPts, creases, ox, oy, size);
    return { creases, vertices };
}

function buildDiagonalGrid(size: number, ox: number, oy: number) {
    const n = 5;
    const cell = size / n;
    const rawCreases: [Pt, Pt, 'M' | 'V' | 'U'][] = [];

    // Horizontal + vertical grid
    for (let r = 0; r <= n; r++) {
        for (let c = 0; c < n; c++) {
            rawCreases.push([
                { x: ox + c * cell, y: oy + r * cell },
                { x: ox + (c + 1) * cell, y: oy + r * cell },
                'V',
            ]);
        }
    }
    for (let r = 0; r < n; r++) {
        for (let c = 0; c <= n; c++) {
            rawCreases.push([
                { x: ox + c * cell, y: oy + r * cell },
                { x: ox + c * cell, y: oy + (r + 1) * cell },
                'V',
            ]);
        }
    }

    // All diagonals (one direction)
    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            rawCreases.push([
                { x: ox + c * cell, y: oy + r * cell },
                { x: ox + (c + 1) * cell, y: oy + (r + 1) * cell },
                'M',
            ]);
        }
    }

    const creases: TessCrease[] = rawCreases.map(([p0, p1, mv]) => ({
        p0: p0 as Pt, p1: p1 as Pt, mv,
    }));

    const allPts: Pt[] = [];
    for (const c of creases) {
        findOrAddVertex(allPts, c.p0);
        findOrAddVertex(allPts, c.p1);
    }

    const vertices = buildVerticesFromCreases(allPts, creases, ox, oy, size);
    return { creases, vertices };
}

function buildVerticesFromCreases(pts: Pt[], creases: TessCrease[], ox: number, oy: number, size: number): TessVertex[] {
    const EPS = 0.5;
    return pts.map(p => {
        const cids: number[] = [];
        for (let ci = 0; ci < creases.length; ci++) {
            const c = creases[ci];
            if ((Math.abs(c.p0.x - p.x) < EPS && Math.abs(c.p0.y - p.y) < EPS) ||
                (Math.abs(c.p1.x - p.x) < EPS && Math.abs(c.p1.y - p.y) < EPS)) {
                cids.push(ci);
            }
        }
        const onEdge = p.x <= ox + 1 || p.x >= ox + size - 1 || p.y <= oy + 1 || p.y >= oy + size - 1;
        return {
            pos: p,
            creaseIndices: cids,
            boundary: onEdge,
            kawasakiOk: true,
            maekawaOk: true,
        };
    });
}

// ─── Validation ──────────────────────────────────────────────────────────────

function validateVertices(vertices: TessVertex[], creases: TessCrease[]) {
    for (const v of vertices) {
        if (v.boundary) { v.kawasakiOk = true; v.maekawaOk = true; continue; }
        if (v.creaseIndices.length < 2) { v.kawasakiOk = true; v.maekawaOk = true; continue; }
        if (v.creaseIndices.length % 2 !== 0) { v.kawasakiOk = false; v.maekawaOk = false; continue; }
        if (v.creaseIndices.length < 4) { v.kawasakiOk = true; v.maekawaOk = true; continue; }

        // Kawasaki: compute sector angles
        const angles: number[] = [];
        for (const ci of v.creaseIndices) {
            const c = creases[ci];
            const other = (Math.abs(c.p0.x - v.pos.x) < 0.5 && Math.abs(c.p0.y - v.pos.y) < 0.5) ? c.p1 : c.p0;
            angles.push(Math.atan2(other.y - v.pos.y, other.x - v.pos.x));
        }
        angles.sort((a, b) => a - b);

        const sectors: number[] = [];
        for (let i = 0; i < angles.length; i++) {
            let diff = angles[(i + 1) % angles.length] - angles[i];
            if (diff <= 0) diff += Math.PI * 2;
            sectors.push(diff);
        }

        if (sectors.length >= 4 && sectors.length % 2 === 0) {
            let evenSum = 0, oddSum = 0;
            for (let i = 0; i < sectors.length; i++) {
                if (i % 2 === 0) evenSum += sectors[i];
                else oddSum += sectors[i];
            }
            v.kawasakiOk = Math.abs(evenSum - Math.PI) < 0.1 && Math.abs(oddSum - Math.PI) < 0.1;
        } else {
            v.kawasakiOk = sectors.length < 4; // trivial vertices are OK
        }

        // Maekawa: |M-V| = 2
        let m = 0, vv = 0;
        for (const ci of v.creaseIndices) {
            if (creases[ci].mv === 'M') m++;
            else if (creases[ci].mv === 'V') vv++;
        }
        const hasUnassigned = v.creaseIndices.some(ci => creases[ci].mv === 'U');
        v.maekawaOk = hasUnassigned || Math.abs(m - vv) === 2;
    }
}

// ─── Tessellation definitions ────────────────────────────────────────────────

const TESSELLATIONS: Tessellation[] = [
    { name: 'Miura-ori', build: buildMiuraOri, description: 'Classic deployable fold — all vertices flat-foldable' },
    { name: 'Square Twist Grid', build: buildSquareTwist, description: 'Alternating diagonal twists on a grid' },
    { name: 'Diagonal Grid', build: buildDiagonalGrid, description: 'Simple grid + diagonals — check foldability' },
];

// ─── Rendering ───────────────────────────────────────────────────────────────

const M_COL = '#e74c3c';
const V_COL = '#3498db';
const U_COL = 'rgba(180,180,180,0.5)';

function render(
    ctx: CanvasRenderingContext2D,
    creases: TessCrease[],
    vertices: TessVertex[],
    w: number, h: number,
    hoveredCrease: number,
    tessName: string,
    tessDesc: string,
    isPreview: boolean
) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(20, 25, 35, 1)';
    ctx.fillRect(0, 0, w, h);

    // Paper shadow
    if (creases.length > 0) {
        const minX = Math.min(...creases.flatMap(c => [c.p0.x, c.p1.x])) - 10;
        const minY = Math.min(...creases.flatMap(c => [c.p0.y, c.p1.y])) - 10;
        const maxX = Math.max(...creases.flatMap(c => [c.p0.x, c.p1.x])) + 10;
        const maxY = Math.max(...creases.flatMap(c => [c.p0.y, c.p1.y])) + 10;

        ctx.fillStyle = '#faf3e0';
        ctx.shadowColor = 'rgba(0,0,0,0.3)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetY = 3;
        ctx.beginPath();
        ctx.roundRect(minX, minY, maxX - minX, maxY - minY, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
    }

    // Creases
    for (let i = 0; i < creases.length; i++) {
        const c = creases[i];
        const isHov = i === hoveredCrease;

        ctx.beginPath();
        ctx.moveTo(c.p0.x, c.p0.y);
        ctx.lineTo(c.p1.x, c.p1.y);

        const color = c.mv === 'M' ? M_COL : c.mv === 'V' ? V_COL : U_COL;
        ctx.strokeStyle = isHov ? '#fff' : color;
        ctx.lineWidth = isHov ? 3.5 : (c.mv === 'U' ? 1 : 2);
        if (c.mv === 'V') ctx.setLineDash([5, 3]);
        else ctx.setLineDash([]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Vertices (only non-boundary with issues)
    for (const v of vertices) {
        if (v.boundary) continue;
        const ok = v.kawasakiOk && v.maekawaOk;
        if (!ok || !isPreview) {
            ctx.beginPath();
            ctx.arc(v.pos.x, v.pos.y, ok ? 3 : 5, 0, Math.PI * 2);
            ctx.fillStyle = ok ? 'rgba(46,204,113,0.5)' : '#e74c3c';
            ctx.fill();
            if (!ok) {
                ctx.strokeStyle = '#e74c3c';
                ctx.lineWidth = 1.5;
                ctx.stroke();
            }
        }
    }

    if (isPreview) return;

    // Panel
    const invalid = vertices.filter(v => !v.boundary && (!v.kawasakiOk || !v.maekawaOk));
    const total = vertices.filter(v => !v.boundary && v.creaseIndices.length >= 4).length;

    const px = 16, py = 16, pw = 320;
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.beginPath();
    ctx.roundRect(px, py, pw, 120, 12);
    ctx.fill();

    let y = py + 16;
    const txt = (s: string, c: string, f: string) => {
        ctx.fillStyle = c; ctx.font = f; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(s, px + 14, y); y += 20;
    };

    txt(`Pattern: ${tessName}`, '#fff', 'bold 13px Inter, system-ui, sans-serif');
    txt(tessDesc, 'rgba(255,255,255,0.5)', '11px Inter, system-ui, sans-serif');
    y += 2;

    if (invalid.length === 0) {
        txt(`✓ All ${total} interior vertices are flat-foldable`, '#2ecc71', 'bold 12px Inter, system-ui, sans-serif');
    } else {
        txt(`✗ ${invalid.length}/${total} vertices violate flat-foldability`, '#e74c3c', 'bold 12px Inter, system-ui, sans-serif');
    }

    const mCount = creases.filter(c => c.mv === 'M').length;
    const vCount = creases.filter(c => c.mv === 'V').length;
    txt(`Creases: ${creases.length} total (M=${mCount}, V=${vCount})`, 'rgba(255,255,255,0.5)', '11px "SF Mono", monospace');

    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click crease to toggle M/V · 1/2/3 to switch pattern · R to reset', w / 2, h - 14);
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function creasePatternDesigner(
    _scene: THREE.Scene,
    opts?: { mount?: HTMLElement; preview?: boolean }
): () => void {
    const mount = opts?.mount ?? document.getElementById('work')!;
    const isPreview = opts?.preview ?? false;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const canvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    mount.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    const pad = isPreview ? 15 : 50;
    const sheetSize = Math.min(width, height) - pad * 2;
    const ox = (width - sheetSize) / 2;
    const oy = (height - sheetSize) / 2 + (isPreview ? 0 : 12);

    let tessIdx = 0;
    let { creases, vertices } = TESSELLATIONS[tessIdx].build(sheetSize, ox, oy);
    validateVertices(vertices, creases);
    let hoveredCrease = -1;

    const redraw = () => render(ctx, creases, vertices, width, height, hoveredCrease,
        TESSELLATIONS[tessIdx].name, TESSELLATIONS[tessIdx].description, isPreview);
    redraw();

    if (isPreview) {
        // Static preview, no interaction
        return () => { if (mount.contains(canvas)) mount.removeChild(canvas); };
    }

    // Interaction
    const getXY = (e: MouseEvent): [number, number] => {
        const r = canvas.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    };

    const hitCrease = (mx: number, my: number): number => {
        let best = -1, bestDist = 8;
        for (let i = 0; i < creases.length; i++) {
            const c = creases[i];
            const dx = c.p1.x - c.p0.x, dy = c.p1.y - c.p0.y;
            const len2 = dx * dx + dy * dy;
            if (len2 < 1) continue;
            const t = Math.max(0, Math.min(1, ((mx - c.p0.x) * dx + (my - c.p0.y) * dy) / len2));
            const px = c.p0.x + t * dx, py = c.p0.y + t * dy;
            const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
            if (dist < bestDist) { bestDist = dist; best = i; }
        }
        return best;
    };

    const onClick = (e: MouseEvent) => {
        const [mx, my] = getXY(e);
        const idx = hitCrease(mx, my);
        if (idx >= 0) {
            // Cycle U → M → V → U
            const c = creases[idx];
            if (c.mv === 'U') c.mv = 'M';
            else if (c.mv === 'M') c.mv = 'V';
            else c.mv = 'U';
            validateVertices(vertices, creases);
            redraw();
        }
    };

    const onMove = (e: MouseEvent) => {
        const [mx, my] = getXY(e);
        hoveredCrease = hitCrease(mx, my);
        canvas.style.cursor = hoveredCrease >= 0 ? 'pointer' : 'default';
        redraw();
    };

    const onKey = (e: KeyboardEvent) => {
        if (e.key === '1' || e.key === '2' || e.key === '3') {
            tessIdx = parseInt(e.key) - 1;
            if (tessIdx >= TESSELLATIONS.length) tessIdx = 0;
            ({ creases, vertices } = TESSELLATIONS[tessIdx].build(sheetSize, ox, oy));
            validateVertices(vertices, creases);
            redraw();
        } else if (e.key === 'r' || e.key === 'R') {
            ({ creases, vertices } = TESSELLATIONS[tessIdx].build(sheetSize, ox, oy));
            validateVertices(vertices, creases);
            redraw();
        }
    };

    const onResize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        const newSheet = Math.min(w, h) - pad * 2;
        const nox = (w - newSheet) / 2;
        const noy = (h - newSheet) / 2 + 12;
        ({ creases, vertices } = TESSELLATIONS[tessIdx].build(newSheet, nox, noy));
        validateVertices(vertices, creases);
        redraw();
    };

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    return () => {
        canvas.removeEventListener('click', onClick);
        canvas.removeEventListener('mousemove', onMove);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onResize);
        if (mount.contains(canvas)) mount.removeChild(canvas);
    };
}
