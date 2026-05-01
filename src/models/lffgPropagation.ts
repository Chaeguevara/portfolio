/**
 * @fileoverview LFFG Constraint Propagation on Real Crease Patterns
 *
 * Shows an actual crease pattern on a square sheet of paper.
 * Each interior vertex has locally valid MV assignments.
 * Clicking a vertex fixes its MV assignment; constraints propagate
 * along shared creases to neighboring vertices (CSP on LFFG).
 *
 * Preset patterns: simple grid, waterbomb base, bird base.
 */

import * as THREE from 'three';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Vertex {
    x: number;
    y: number;
    /** Indices of creases meeting at this vertex */
    creaseIds: number[];
    /** Is this vertex on the boundary? Boundary vertices have no MV constraints */
    boundary: boolean;
    state: 'free' | 'fixed' | 'forced' | 'conflict';
}

interface Crease {
    v0: number;     // vertex index
    v1: number;
    mv: 'M' | 'V' | 'U';  // mountain, valley, unassigned
    fixedBy: number; // vertex that determined this, -1 if free
}

interface Pattern {
    name: string;
    vertices: [number, number][];
    creases: [number, number][];
    boundary: number[];  // indices of boundary vertices
}

// ─── Preset Patterns (on unit square 0-1) ────────────────────────────────────

const PATTERNS: Pattern[] = [
    {
        name: 'Grid 3×3',
        vertices: [
            // Row 0 (top)
            [0, 0], [0.333, 0], [0.667, 0], [1, 0],
            // Row 1
            [0, 0.333], [0.333, 0.333], [0.667, 0.333], [1, 0.333],
            // Row 2
            [0, 0.667], [0.333, 0.667], [0.667, 0.667], [1, 0.667],
            // Row 3 (bottom)
            [0, 1], [0.333, 1], [0.667, 1], [1, 1],
        ],
        creases: [
            // Horizontal
            [0,1],[1,2],[2,3],[4,5],[5,6],[6,7],[8,9],[9,10],[10,11],[12,13],[13,14],[14,15],
            // Vertical
            [0,4],[1,5],[2,6],[3,7],[4,8],[5,9],[6,10],[7,11],[8,12],[9,13],[10,14],[11,15],
            // Diagonals at interior vertices (to make degree-4)
            [0,5],[1,6],[2,7],[4,9],[5,10],[6,11],[8,13],[9,14],[10,15],
        ],
        boundary: [0,1,2,3,4,7,8,11,12,13,14,15],
    },
    {
        name: 'Waterbomb Base',
        vertices: [
            [0,0],[0.5,0],[1,0],       // top
            [0,0.5],[0.5,0.5],[1,0.5], // mid
            [0,1],[0.5,1],[1,1],       // bottom
        ],
        creases: [
            // Border
            [0,1],[1,2],[2,5],[5,8],[8,7],[7,6],[6,3],[3,0],
            // Cross
            [1,4],[3,4],[4,5],[4,7],
            // Diagonals
            [0,4],[2,4],[4,6],[4,8],
        ],
        boundary: [0,1,2,3,5,6,7,8],
    },
    {
        name: 'Bird Base (simplified)',
        vertices: [
            [0,0],[0.5,0],[1,0],
            [0,0.25],[0.5,0.25],[1,0.25],
            [0.25,0.5],[0.5,0.5],[0.75,0.5],
            [0,0.75],[0.5,0.75],[1,0.75],
            [0,1],[0.5,1],[1,1],
        ],
        creases: [
            // Outer edges
            [0,1],[1,2],[2,5],[5,8],[8,10],[10,14],[14,13],[13,12],[12,9],[9,6],[6,3],[3,0],
            // Horizontal internals
            [3,4],[4,5],[9,10],[10,11],
            // Vertical internals
            [1,4],[4,7],[7,10],[10,13],
            // Diagonals
            [0,4],[2,4],[6,7],[7,8],[9,7],[11,7],
            [6,4],[8,4],[12,10],[14,10],
        ],
        boundary: [0,1,2,3,5,6,8,9,11,12,13,14],
    },
];

// ─── Logic ───────────────────────────────────────────────────────────────────

function buildVertices(pattern: Pattern, scale: number, ox: number, oy: number): Vertex[] {
    return pattern.vertices.map(([px, py], i) => ({
        x: ox + px * scale,
        y: oy + py * scale,
        creaseIds: pattern.creases
            .map(([v0, v1], ci) => (v0 === i || v1 === i) ? ci : -1)
            .filter(ci => ci >= 0),
        boundary: pattern.boundary.includes(i),
        state: 'free' as const,
    }));
}

function buildCreases(pattern: Pattern): Crease[] {
    return pattern.creases.map(([v0, v1]) => ({
        v0, v1, mv: 'U' as const, fixedBy: -1,
    }));
}

/**
 * Propagate MV constraints from fixed/forced vertices along shared creases.
 */
function propagate(vertices: Vertex[], creases: Crease[]): void {
    // Reset non-fixed
    for (const v of vertices) {
        if (v.state !== 'fixed') v.state = 'free';
    }

    let changed = true;
    let iter = 0;
    while (changed && iter < 50) {
        changed = false;
        iter++;

        for (const crease of creases) {
            if (crease.mv === 'U') continue;

            // For each endpoint, check if the constraint creates a conflict
            for (const vi of [crease.v0, crease.v1]) {
                const vertex = vertices[vi];
                if (vertex.boundary || vertex.state === 'fixed' || vertex.state === 'conflict') continue;

                // Count assigned creases at this vertex
                let m = 0, v = 0, u = 0;
                for (const ci of vertex.creaseIds) {
                    if (creases[ci].mv === 'M') m++;
                    else if (creases[ci].mv === 'V') v++;
                    else u++;
                }

                const total = m + v + u;
                if (u === 0 && total >= 4) {
                    // All assigned — check Maekawa
                    if (Math.abs(m - v) !== 2) {
                        vertex.state = 'conflict';
                        changed = true;
                    } else if (vertex.state === 'free') {
                        vertex.state = 'forced';
                        changed = true;
                    }
                } else if (u === 1 && total >= 4) {
                    // One unassigned — can we force it?
                    // Maekawa: |M - V| = 2. With one unknown:
                    // If we set it M: |m+1 - v| = 2?
                    // If we set it V: |m - v-1| = 2?
                    const mValid = Math.abs((m + 1) - v) === 2;
                    const vValid = Math.abs(m - (v + 1)) === 2;
                    const unknownCreaseIdx = vertex.creaseIds.find(ci => creases[ci].mv === 'U');
                    if (unknownCreaseIdx !== undefined) {
                        if (mValid && !vValid) {
                            creases[unknownCreaseIdx].mv = 'M';
                            creases[unknownCreaseIdx].fixedBy = vi;
                            vertex.state = 'forced';
                            changed = true;
                        } else if (vValid && !mValid) {
                            creases[unknownCreaseIdx].mv = 'V';
                            creases[unknownCreaseIdx].fixedBy = vi;
                            vertex.state = 'forced';
                            changed = true;
                        } else if (!mValid && !vValid) {
                            vertex.state = 'conflict';
                            changed = true;
                        }
                    }
                }
            }
        }
    }
}

// ─── Rendering ───────────────────────────────────────────────────────────────

const M_COLOR = '#e74c3c';
const V_COLOR = '#3498db';
const U_COLOR = 'rgba(255,255,255,0.25)';
const FREE_C = '#95a5a6';
const FIXED_C = '#3498db';
const FORCED_C = '#2ecc71';
const CONFLICT_C = '#e74c3c';
const PAPER = '#faf3e0';
const NODE_R = 10;

function stateColor(s: Vertex['state']): string {
    switch (s) {
        case 'free': return FREE_C;
        case 'fixed': return FIXED_C;
        case 'forced': return FORCED_C;
        case 'conflict': return CONFLICT_C;
    }
}

function creaseColor(mv: Crease['mv']): string {
    switch (mv) {
        case 'M': return M_COLOR;
        case 'V': return V_COLOR;
        case 'U': return U_COLOR;
    }
}

function render(
    ctx: CanvasRenderingContext2D,
    vertices: Vertex[],
    creases: Crease[],
    w: number, h: number,
    hovered: number,
    patternName: string,
    isPreview: boolean
) {
    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = 'rgba(20, 25, 35, 1)';
    ctx.fillRect(0, 0, w, h);

    // Paper sheet background
    const pad = isPreview ? 20 : 60;
    const sheetSize = Math.min(w, h) - pad * 2;
    const sx = (w - sheetSize) / 2;
    const sy = (h - sheetSize) / 2 + (isPreview ? 0 : 15);

    ctx.fillStyle = PAPER;
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.roundRect(sx - 10, sy - 10, sheetSize + 20, sheetSize + 20, 8);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Creases
    for (const c of creases) {
        const p0 = vertices[c.v0];
        const p1 = vertices[c.v1];

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = creaseColor(c.mv);
        ctx.lineWidth = c.mv === 'U' ? 1.5 : 2.5;
        if (c.mv === 'V') ctx.setLineDash([6, 4]);
        else ctx.setLineDash([]);
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Vertices
    for (let i = 0; i < vertices.length; i++) {
        const v = vertices[i];
        if (v.boundary && isPreview) continue;

        const r = v.boundary ? NODE_R * 0.6 : NODE_R;
        const isHov = i === hovered;

        if (isHov && !isPreview) {
            ctx.beginPath();
            ctx.arc(v.x, v.y, r + 5, 0, Math.PI * 2);
            ctx.strokeStyle = stateColor(v.state);
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.4;
            ctx.stroke();
            ctx.globalAlpha = 1;
        }

        ctx.beginPath();
        ctx.arc(v.x, v.y, r, 0, Math.PI * 2);
        ctx.fillStyle = v.boundary ? 'rgba(100,100,100,0.3)' : stateColor(v.state);
        ctx.fill();
        if (!v.boundary) {
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    if (isPreview) return;

    // Panel
    const hasConflict = vertices.some(v => v.state === 'conflict');
    const interiorVerts = vertices.filter(v => !v.boundary);
    const allAssigned = interiorVerts.every(v => v.state !== 'free');
    const allOk = !hasConflict && allAssigned;

    const px = 16, py = 16, pw = 310;
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.beginPath();
    ctx.roundRect(px, py, pw, 155, 12);
    ctx.fill();

    let y = py + 16;
    const txt = (s: string, c: string, f: string) => {
        ctx.fillStyle = c; ctx.font = f; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText(s, px + 14, y); y += 20;
    };

    txt(`LFFG — ${patternName}`, '#fff', 'bold 13px Inter, system-ui, sans-serif');
    y += 2;

    const fixed = interiorVerts.filter(v => v.state === 'fixed').length;
    const forced = interiorVerts.filter(v => v.state === 'forced').length;
    const free = interiorVerts.filter(v => v.state === 'free').length;
    const conflicts = interiorVerts.filter(v => v.state === 'conflict').length;
    txt(`Fixed: ${fixed}  Forced: ${forced}  Free: ${free}  Conflict: ${conflicts}`,
        'rgba(255,255,255,0.6)', '11px "SF Mono", monospace');

    const mCount = creases.filter(c => c.mv === 'M').length;
    const vCount = creases.filter(c => c.mv === 'V').length;
    const uCount = creases.filter(c => c.mv === 'U').length;
    txt(`Creases: M=${mCount} V=${vCount} Unassigned=${uCount}`,
        'rgba(255,255,255,0.5)', '11px "SF Mono", monospace');

    if (hasConflict) {
        txt('✗ Conflict — Maekawa violated at some vertex', CONFLICT_C, 'bold 12px Inter, system-ui, sans-serif');
    } else if (allOk) {
        txt('✓ Globally consistent MV assignment!', FORCED_C, 'bold 12px Inter, system-ui, sans-serif');
    } else {
        txt('Click interior vertices to assign M/V to creases', 'rgba(255,255,255,0.4)', '11px Inter, system-ui, sans-serif');
    }

    // Legend
    y += 6;
    ctx.font = '10px "SF Mono", monospace';
    const items = [
        { c: M_COLOR, l: 'M (━)' }, { c: V_COLOR, l: 'V (╌)' },
        { c: FREE_C, l: '○ Free' }, { c: FIXED_C, l: '● Fixed' },
        { c: FORCED_C, l: '● Forced' }, { c: CONFLICT_C, l: '● Conflict' },
    ];
    let lx = px + 14;
    for (const it of items) {
        ctx.fillStyle = it.c;
        ctx.fillText(it.l, lx, y);
        lx += ctx.measureText(it.l).width + 12;
        if (lx > pw - 20) { lx = px + 14; y += 14; }
    }

    // Bottom instruction
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Click vertex to assign creases · Right-click to reset · 1/2/3 to switch pattern', w / 2, h - 14);
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function lffgPropagation(
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

    let patternIdx = 0;
    const pad = isPreview ? 20 : 60;
    const sheetSize = Math.min(width, height) - pad * 2;
    const ox = (width - sheetSize) / 2;
    const oy = (height - sheetSize) / 2 + (isPreview ? 0 : 15);

    let vertices = buildVertices(PATTERNS[patternIdx], sheetSize, ox, oy);
    let creases = buildCreases(PATTERNS[patternIdx]);
    let hovered = -1;

    const redraw = () => render(ctx, vertices, creases, width, height, hovered, PATTERNS[patternIdx].name, isPreview);
    redraw();

    if (isPreview) {
        let animId = 0;
        let t = 0;
        let step = 0;
        const interiors = vertices.map((v, i) => ({ v, i })).filter(x => !x.v.boundary);
        const animate = () => {
            animId = requestAnimationFrame(animate);
            t++;
            if (t % 60 === 0 && step < interiors.length) {
                const vi = interiors[step].i;
                // Assign creases at this vertex alternating M/V (3:1 for Maekawa)
                const cids = vertices[vi].creaseIds;
                for (let j = 0; j < cids.length; j++) {
                    if (creases[cids[j]].mv === 'U') {
                        creases[cids[j]].mv = j === 0 ? 'V' : 'M';
                    }
                }
                vertices[vi].state = step === 0 ? 'fixed' : 'forced';
                propagate(vertices, creases);
                step++;
                redraw();
            }
            if (step >= interiors.length && t % 240 === 0) {
                vertices = buildVertices(PATTERNS[patternIdx], sheetSize, ox, oy);
                creases = buildCreases(PATTERNS[patternIdx]);
                step = 0;
                redraw();
            }
        };
        animate();
        return () => { cancelAnimationFrame(animId); if (mount.contains(canvas)) mount.removeChild(canvas); };
    }

    // ─── Interaction ─────────────────────────────────────────────

    const hitVertex = (mx: number, my: number): number => {
        for (let i = 0; i < vertices.length; i++) {
            if (vertices[i].boundary) continue;
            if (Math.sqrt((mx - vertices[i].x) ** 2 + (my - vertices[i].y) ** 2) < NODE_R + 6) return i;
        }
        return -1;
    };

    const getXY = (e: MouseEvent): [number, number] => {
        const r = canvas.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    };

    const assignVertex = (vi: number) => {
        const v = vertices[vi];
        v.state = 'fixed';

        // Cycle through a simple MV assignment at this vertex's creases
        // Each click rotates the pattern of M/V on the creases
        const cids = v.creaseIds;
        // Generate next valid Maekawa pattern (3M:1V cycle through which one is V)
        let valleyPos = cids.findIndex(ci => creases[ci].mv === 'V');
        valleyPos = (valleyPos + 1) % cids.length;

        for (let j = 0; j < cids.length; j++) {
            creases[cids[j]].mv = j === valleyPos ? 'V' : 'M';
            creases[cids[j]].fixedBy = vi;
        }

        propagate(vertices, creases);
        redraw();
    };

    const resetAll = () => {
        vertices = buildVertices(PATTERNS[patternIdx], sheetSize, ox, oy);
        creases = buildCreases(PATTERNS[patternIdx]);
        redraw();
    };

    const switchPattern = (idx: number) => {
        patternIdx = idx % PATTERNS.length;
        vertices = buildVertices(PATTERNS[patternIdx], sheetSize, ox, oy);
        creases = buildCreases(PATTERNS[patternIdx]);
        redraw();
    };

    const onClick = (e: MouseEvent) => {
        const [mx, my] = getXY(e);
        const idx = hitVertex(mx, my);
        if (idx >= 0) assignVertex(idx);
    };

    const onContext = (e: MouseEvent) => {
        e.preventDefault();
        resetAll();
    };

    const onMove = (e: MouseEvent) => {
        const [mx, my] = getXY(e);
        hovered = hitVertex(mx, my);
        canvas.style.cursor = hovered >= 0 ? 'pointer' : 'default';
        redraw();
    };

    const onKey = (e: KeyboardEvent) => {
        if (e.key === '1') switchPattern(0);
        else if (e.key === '2') switchPattern(1);
        else if (e.key === '3') switchPattern(2);
    };

    const onResize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        const newSheet = Math.min(w, h) - pad * 2;
        const nox = (w - newSheet) / 2;
        const noy = (h - newSheet) / 2 + 15;
        vertices = buildVertices(PATTERNS[patternIdx], newSheet, nox, noy);
        creases = buildCreases(PATTERNS[patternIdx]);
        redraw();
    };

    canvas.addEventListener('click', onClick);
    canvas.addEventListener('contextmenu', onContext);
    canvas.addEventListener('mousemove', onMove);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    return () => {
        canvas.removeEventListener('click', onClick);
        canvas.removeEventListener('contextmenu', onContext);
        canvas.removeEventListener('mousemove', onMove);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('resize', onResize);
        if (mount.contains(canvas)) mount.removeChild(canvas);
    };
}
