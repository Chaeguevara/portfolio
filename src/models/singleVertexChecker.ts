/**
 * @fileoverview Single-Vertex Flat-Foldability Checker
 * Interactive demo for Kawasaki's and Maekawa's theorems.
 *
 * - Drag crease lines around a central vertex to adjust sector angles
 * - Click crease lines to toggle Mountain/Valley assignment
 * - Real-time validation of Kawasaki (angle) and Maekawa (MV parity) conditions
 */

import * as THREE from 'three';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Crease {
    angle: number;       // radians from positive X-axis
    mv: 'M' | 'V';      // mountain or valley
}

interface UIState {
    creases: Crease[];
    dragging: number;    // index of crease being dragged, -1 if none
    hovered: number;     // index of crease being hovered
    radius: number;      // drawing radius
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MOUNTAIN_COLOR = '#e74c3c';
const VALLEY_COLOR = '#3498db';
const VALID_COLOR = '#2ecc71';
const INVALID_COLOR = '#e74c3c';
const PAPER_COLOR = '#faf3e0';
const CREASE_WIDTH = 3;
const HANDLE_RADIUS = 8;
const TAU = Math.PI * 2;

// ─── Math helpers ────────────────────────────────────────────────────────────

function normalizeAngle(a: number): number {
    return ((a % TAU) + TAU) % TAU;
}

function getSortedAngles(creases: Crease[]): number[] {
    return creases.map(c => normalizeAngle(c.angle)).sort((a, b) => a - b);
}

function getSectorAngles(creases: Crease[]): number[] {
    const sorted = getSortedAngles(creases);
    const n = sorted.length;
    if (n < 2) return [];
    const sectors: number[] = [];
    for (let i = 0; i < n; i++) {
        const next = (i + 1) % n;
        let diff = sorted[next] - sorted[i];
        if (diff <= 0) diff += TAU;
        sectors.push(diff);
    }
    return sectors;
}

/** Kawasaki's theorem: alternating sum of sector angles = 0 (equiv: odd sum = even sum = π) */
function checkKawasaki(creases: Crease[]): { valid: boolean; oddSum: number; evenSum: number } {
    const sectors = getSectorAngles(creases);
    if (sectors.length < 4 || sectors.length % 2 !== 0) {
        return { valid: false, oddSum: 0, evenSum: 0 };
    }
    let oddSum = 0, evenSum = 0;
    for (let i = 0; i < sectors.length; i++) {
        if (i % 2 === 0) evenSum += sectors[i];
        else oddSum += sectors[i];
    }
    const valid = Math.abs(oddSum - Math.PI) < 0.05 && Math.abs(evenSum - Math.PI) < 0.05;
    return { valid, oddSum, evenSum };
}

/** Maekawa's theorem: |M - V| = 2 */
function checkMaekawa(creases: Crease[]): { valid: boolean; m: number; v: number; diff: number } {
    const m = creases.filter(c => c.mv === 'M').length;
    const v = creases.filter(c => c.mv === 'V').length;
    const diff = Math.abs(m - v);
    return { valid: diff === 2, m, v, diff };
}

// ─── Rendering (2D Canvas) ──────────────────────────────────────────────────

function drawScene(
    ctx: CanvasRenderingContext2D,
    state: UIState,
    w: number, h: number,
    isPreview: boolean
) {
    const cx = w / 2;
    const cy = h / 2;
    const r = state.radius;

    ctx.clearRect(0, 0, w, h);

    // Paper circle
    ctx.beginPath();
    ctx.arc(cx, cy, r + 20, 0, TAU);
    ctx.fillStyle = PAPER_COLOR;
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Sector angle arcs
    const sortedAngles = getSortedAngles(state.creases);
    const sectors = getSectorAngles(state.creases);

    if (sectors.length >= 2) {
        for (let i = 0; i < sectors.length; i++) {
            const startA = sortedAngles[i];
            const sectorAngle = sectors[i];
            const isEven = i % 2 === 0;

            // Sector fill
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r * 0.35, -startA, -(startA + sectorAngle), true);
            ctx.closePath();
            ctx.fillStyle = isEven ? 'rgba(52, 152, 219, 0.08)' : 'rgba(231, 76, 60, 0.08)';
            ctx.fill();

            // Angle label
            if (!isPreview) {
                const midAngle = startA + sectorAngle / 2;
                const labelR = r * 0.25;
                const lx = cx + Math.cos(-midAngle) * labelR;
                const ly = cy + Math.sin(-midAngle) * labelR;
                const deg = (sectorAngle * 180 / Math.PI).toFixed(1);
                ctx.fillStyle = isEven ? '#2980b9' : '#c0392b';
                ctx.font = `bold ${Math.max(11, r * 0.08)}px Inter, system-ui, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${deg}°`, lx, ly);
            }
        }
    }

    // Crease lines
    for (let i = 0; i < state.creases.length; i++) {
        const c = state.creases[i];
        const a = normalizeAngle(c.angle);
        const x2 = cx + Math.cos(-a) * r;
        const y2 = cy + Math.sin(-a) * r;

        // Line
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = c.mv === 'M' ? MOUNTAIN_COLOR : VALLEY_COLOR;
        ctx.lineWidth = (i === state.hovered || i === state.dragging) ? CREASE_WIDTH + 2 : CREASE_WIDTH;
        if (c.mv === 'V') ctx.setLineDash([8, 6]);
        else ctx.setLineDash([]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Handle (endpoint)
        if (!isPreview) {
            ctx.beginPath();
            ctx.arc(x2, y2, HANDLE_RADIUS, 0, TAU);
            ctx.fillStyle = c.mv === 'M' ? MOUNTAIN_COLOR : VALLEY_COLOR;
            if (i === state.hovered || i === state.dragging) {
                ctx.fillStyle = '#fff';
                ctx.strokeStyle = c.mv === 'M' ? MOUNTAIN_COLOR : VALLEY_COLOR;
                ctx.lineWidth = 3;
                ctx.stroke();
            }
            ctx.fill();
        }

        // MV label
        if (!isPreview) {
            const labelDist = r + 14;
            const lx = cx + Math.cos(-a) * labelDist;
            const ly = cy + Math.sin(-a) * labelDist;
            ctx.fillStyle = c.mv === 'M' ? MOUNTAIN_COLOR : VALLEY_COLOR;
            ctx.font = `bold ${Math.max(12, r * 0.09)}px Inter, system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(c.mv, lx, ly);
        }
    }

    // Center vertex
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, TAU);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();

    // Validation panel
    if (!isPreview) {
        drawValidationPanel(ctx, state, w, h);
    }
}

function drawValidationPanel(
    ctx: CanvasRenderingContext2D,
    state: UIState,
    w: number, h: number
) {
    const kawasaki = checkKawasaki(state.creases);
    const maekawa = checkMaekawa(state.creases);

    const panelX = 16;
    const panelY = 16;
    const panelW = 280;
    const lineH = 22;
    let y = panelY + 20;

    // Background
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.beginPath();
    ctx.roundRect(panelX, panelY, panelW, 165, 12);
    ctx.fill();

    ctx.font = 'bold 14px Inter, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Title
    ctx.fillStyle = '#fff';
    ctx.fillText('Flat-Foldability Check', panelX + 14, y);
    y += lineH + 8;

    // Kawasaki
    const kIcon = kawasaki.valid ? '✓' : '✗';
    ctx.fillStyle = kawasaki.valid ? VALID_COLOR : INVALID_COLOR;
    ctx.font = 'bold 13px Inter, system-ui, sans-serif';
    ctx.fillText(`${kIcon} Kawasaki`, panelX + 14, y);
    ctx.font = '12px "SF Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    const oddDeg = (kawasaki.oddSum * 180 / Math.PI).toFixed(1);
    const evenDeg = (kawasaki.evenSum * 180 / Math.PI).toFixed(1);
    ctx.fillText(`Σodd=${oddDeg}°  Σeven=${evenDeg}°  (need 180°)`, panelX + 14, y + lineH);
    y += lineH * 2 + 4;

    // Maekawa
    const mIcon = maekawa.valid ? '✓' : '✗';
    ctx.fillStyle = maekawa.valid ? VALID_COLOR : INVALID_COLOR;
    ctx.font = 'bold 13px Inter, system-ui, sans-serif';
    ctx.fillText(`${mIcon} Maekawa`, panelX + 14, y);
    ctx.font = '12px "SF Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillText(`M=${maekawa.m}  V=${maekawa.v}  |M−V|=${maekawa.diff} (need 2)`, panelX + 14, y + lineH);
    y += lineH * 2 + 4;

    // Overall
    const allValid = kawasaki.valid && maekawa.valid;
    ctx.fillStyle = allValid ? VALID_COLOR : INVALID_COLOR;
    ctx.font = 'bold 13px Inter, system-ui, sans-serif';
    ctx.fillText(
        allValid ? '✓ Flat-foldable!' : '✗ Not flat-foldable',
        panelX + 14, y
    );

    // Instructions (bottom)
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Drag handles to adjust angles · Click lines to toggle M/V', w / 2, h - 14);
}

// ─── Main export ────────────────────────────────────────────────────────────

export function singleVertexChecker(
    _scene: THREE.Scene,
    opts?: { mount?: HTMLElement; preview?: boolean }
): () => void {
    const mount = opts?.mount ?? document.getElementById('work')!;
    const isPreview = opts?.preview ?? false;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // We use a 2D canvas overlay instead of Three.js for this demo
    const canvas = document.createElement('canvas');
    canvas.width = width * (window.devicePixelRatio || 1);
    canvas.height = height * (window.devicePixelRatio || 1);
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    mount.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const radius = Math.min(width, height) * (isPreview ? 0.32 : 0.28);

    // Default: 4-degree vertex (bird's foot) with valid Kawasaki angles
    const state: UIState = {
        creases: [
            { angle: 0, mv: 'M' },
            { angle: Math.PI * 0.4, mv: 'V' },     // 72°
            { angle: Math.PI, mv: 'M' },             // 180°
            { angle: Math.PI * 1.4, mv: 'M' },       // 252°
        ],
        dragging: -1,
        hovered: -1,
        radius,
    };

    // Initial draw
    drawScene(ctx, state, width, height, isPreview);

    if (isPreview) {
        // Animate a gentle rotation for preview
        let animId = 0;
        let t = 0;
        const baseAngles = state.creases.map(c => c.angle);
        const animate = () => {
            animId = requestAnimationFrame(animate);
            t += 0.003;
            for (let i = 0; i < state.creases.length; i++) {
                state.creases[i].angle = baseAngles[i] + t;
            }
            drawScene(ctx, state, width, height, true);
        };
        animate();
        return () => {
            cancelAnimationFrame(animId);
            if (mount.contains(canvas)) mount.removeChild(canvas);
        };
    }

    // ─── Interaction ────────────────────────────────────────────────
    const cx = width / 2;
    const cy = height / 2;

    function getCreaseAtPoint(mx: number, my: number): number {
        for (let i = 0; i < state.creases.length; i++) {
            const a = normalizeAngle(state.creases[i].angle);
            const hx = cx + Math.cos(-a) * state.radius;
            const hy = cy + Math.sin(-a) * state.radius;
            const dist = Math.sqrt((mx - hx) ** 2 + (my - hy) ** 2);
            if (dist < HANDLE_RADIUS + 8) return i;
        }
        return -1;
    }

    function isOnCreaseLine(mx: number, my: number): number {
        for (let i = 0; i < state.creases.length; i++) {
            const a = normalizeAngle(state.creases[i].angle);
            // Check distance from line segment (center to endpoint)
            const ex = cx + Math.cos(-a) * state.radius;
            const ey = cy + Math.sin(-a) * state.radius;
            const dx = ex - cx, dy = ey - cy;
            const len = Math.sqrt(dx * dx + dy * dy);
            const t = Math.max(0, Math.min(1, ((mx - cx) * dx + (my - cy) * dy) / (len * len)));
            const px = cx + t * dx, py = cy + t * dy;
            const dist = Math.sqrt((mx - px) ** 2 + (my - py) ** 2);
            if (dist < 10) return i;
        }
        return -1;
    }

    function getCanvasXY(e: MouseEvent): [number, number] {
        const rect = canvas.getBoundingClientRect();
        return [e.clientX - rect.left, e.clientY - rect.top];
    }

    const onMouseDown = (e: MouseEvent) => {
        const [mx, my] = getCanvasXY(e);
        const idx = getCreaseAtPoint(mx, my);
        if (idx >= 0) {
            state.dragging = idx;
            canvas.style.cursor = 'grabbing';
        }
    };

    const onMouseMove = (e: MouseEvent) => {
        const [mx, my] = getCanvasXY(e);
        if (state.dragging >= 0) {
            // Update angle based on mouse position relative to center
            const angle = Math.atan2(-(my - cy), mx - cx);
            state.creases[state.dragging].angle = normalizeAngle(angle);
            drawScene(ctx, state, width, height, false);
        } else {
            const idx = getCreaseAtPoint(mx, my);
            state.hovered = idx >= 0 ? idx : isOnCreaseLine(mx, my);
            canvas.style.cursor = state.hovered >= 0 ? 'pointer' : 'default';
            drawScene(ctx, state, width, height, false);
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        if (state.dragging >= 0) {
            state.dragging = -1;
            canvas.style.cursor = 'default';
            return;
        }
        // Click on line to toggle MV
        const [mx, my] = getCanvasXY(e);
        const idx = isOnCreaseLine(mx, my);
        if (idx >= 0) {
            state.creases[idx].mv = state.creases[idx].mv === 'M' ? 'V' : 'M';
            drawScene(ctx, state, width, height, false);
        }
    };

    const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        canvas.width = w * (window.devicePixelRatio || 1);
        canvas.height = h * (window.devicePixelRatio || 1);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
        state.radius = Math.min(w, h) * 0.28;
        drawScene(ctx, state, w, h, false);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    window.addEventListener('resize', onResize);

    // Cleanup
    return () => {
        canvas.removeEventListener('mousedown', onMouseDown);
        canvas.removeEventListener('mousemove', onMouseMove);
        canvas.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('resize', onResize);
        if (mount.contains(canvas)) mount.removeChild(canvas);
    };
}
