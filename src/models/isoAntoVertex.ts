/**
 * @fileoverview ISO/ANTO 4-Degree Vertex Demo
 * Interactive visualization of the ISO/ANTO rule for degree-4 flat-foldable vertices.
 *
 * Core rule: The unique biggest angle sector must be ISO (both adjacent creases
 * share the same MV assignment). This is a necessary condition for flat-foldability.
 *
 * Based on MIT 6.849 Geometric Folding Algorithms.
 */

import * as THREE from 'three';

// ─── Types ───────────────────────────────────────────────────────────────────

interface Crease {
    angle: number;
    mv: 'M' | 'V';
}

interface Sector {
    startIdx: number;
    endIdx: number;
    angle: number;
    relation: 'ISO' | 'ANTO';
}

// ─── Constants ───────────────────────────────────────────────────────────────

const M_COLOR = '#e74c3c';
const V_COLOR = '#3498db';
const ISO_COLOR = 'rgba(46, 204, 113, 0.15)';
const ANTO_COLOR = 'rgba(231, 76, 60, 0.12)';
const ISO_BORDER = '#2ecc71';
const ANTO_BORDER = '#e67e22';
const BIGGEST_COLOR = 'rgba(241, 196, 15, 0.2)';
const VALID_COLOR = '#2ecc71';
const INVALID_COLOR = '#e74c3c';
const TAU = Math.PI * 2;

function normalizeAngle(a: number): number {
    return ((a % TAU) + TAU) % TAU;
}

// ─── Geometry ────────────────────────────────────────────────────────────────

function getSortedCreases(creases: Crease[]): { crease: Crease; origIdx: number }[] {
    return creases
        .map((c, i) => ({ crease: { ...c, angle: normalizeAngle(c.angle) }, origIdx: i }))
        .sort((a, b) => a.crease.angle - b.crease.angle);
}

function computeSectors(creases: Crease[]): Sector[] {
    const sorted = getSortedCreases(creases);
    const n = sorted.length;
    if (n < 2) return [];
    const sectors: Sector[] = [];
    for (let i = 0; i < n; i++) {
        const next = (i + 1) % n;
        let diff = sorted[next].crease.angle - sorted[i].crease.angle;
        if (diff <= 0) diff += TAU;
        const sameAssignment = sorted[i].crease.mv === sorted[next].crease.mv;
        sectors.push({
            startIdx: sorted[i].origIdx,
            endIdx: sorted[next].origIdx,
            angle: diff,
            relation: sameAssignment ? 'ISO' : 'ANTO',
        });
    }
    return sectors;
}

function checkIsoAntoRule(creases: Crease[]): {
    valid: boolean;
    biggestIdx: number;
    biggestIsIso: boolean;
    isUnique: boolean;
    sectors: Sector[];
} {
    const sectors = computeSectors(creases);
    if (sectors.length < 3) return { valid: false, biggestIdx: -1, biggestIsIso: false, isUnique: false, sectors };

    let maxAngle = -1;
    let biggestIdx = 0;
    let isUnique = true;
    for (let i = 0; i < sectors.length; i++) {
        if (sectors[i].angle > maxAngle + 0.001) {
            maxAngle = sectors[i].angle;
            biggestIdx = i;
            isUnique = true;
        } else if (Math.abs(sectors[i].angle - maxAngle) < 0.001) {
            isUnique = false;
        }
    }

    const biggestIsIso = sectors[biggestIdx].relation === 'ISO';
    return { valid: isUnique && biggestIsIso, biggestIdx, biggestIsIso, isUnique, sectors };
}

function checkKawasaki4(creases: Crease[]): { valid: boolean; sum02: number; sum13: number } {
    const sectors = computeSectors(creases);
    if (sectors.length !== 4) return { valid: false, sum02: 0, sum13: 0 };
    const sum02 = sectors[0].angle + sectors[2].angle;
    const sum13 = sectors[1].angle + sectors[3].angle;
    const valid = Math.abs(sum02 - Math.PI) < 0.05 && Math.abs(sum13 - Math.PI) < 0.05;
    return { valid, sum02, sum13 };
}

function checkMaekawa4(creases: Crease[]): { valid: boolean; m: number; v: number } {
    const m = creases.filter(c => c.mv === 'M').length;
    const v = creases.filter(c => c.mv === 'V').length;
    return { valid: Math.abs(m - v) === 2, m, v };
}

// ─── Rendering ───────────────────────────────────────────────────────────────

function draw(
    ctx: CanvasRenderingContext2D,
    creases: Crease[],
    w: number, h: number,
    hovered: number,
    dragging: number,
    radius: number,
    isPreview: boolean
) {
    const cx = w / 2;
    const cy = h / 2;
    const r = radius;
    ctx.clearRect(0, 0, w, h);

    const isoAnto = checkIsoAntoRule(creases);
    const sectors = isoAnto.sectors;

    // Paper background
    ctx.beginPath();
    ctx.arc(cx, cy, r + 20, 0, TAU);
    ctx.fillStyle = '#faf3e0';
    ctx.fill();

    // Draw sectors with ISO/ANTO coloring
    for (let i = 0; i < sectors.length; i++) {
        const startAngle = normalizeAngle(creases[sectors[i].startIdx].angle);
        const sectorAngle = sectors[i].angle;
        const isBiggest = i === isoAnto.biggestIdx;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, r * 0.85, -startAngle, -(startAngle + sectorAngle), true);
        ctx.closePath();

        if (isBiggest) {
            ctx.fillStyle = BIGGEST_COLOR;
        } else {
            ctx.fillStyle = sectors[i].relation === 'ISO' ? ISO_COLOR : ANTO_COLOR;
        }
        ctx.fill();

        // Sector arc border
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.45, -startAngle, -(startAngle + sectorAngle), true);
        ctx.strokeStyle = sectors[i].relation === 'ISO' ? ISO_BORDER : ANTO_BORDER;
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Labels
        if (!isPreview) {
            const midAngle = startAngle + sectorAngle / 2;
            const deg = (sectorAngle * 180 / Math.PI).toFixed(1);

            // Angle value
            const lr1 = r * 0.25;
            ctx.fillStyle = '#2c3e50';
            ctx.font = `bold ${Math.max(11, r * 0.07)}px Inter, system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${deg}°`, cx + Math.cos(-midAngle) * lr1, cy + Math.sin(-midAngle) * lr1);

            // ISO/ANTO label
            const lr2 = r * 0.6;
            const label = sectors[i].relation;
            ctx.fillStyle = sectors[i].relation === 'ISO' ? ISO_BORDER : ANTO_BORDER;
            ctx.font = `bold ${Math.max(10, r * 0.065)}px "SF Mono", monospace`;
            ctx.fillText(label, cx + Math.cos(-midAngle) * lr2, cy + Math.sin(-midAngle) * lr2);

            // Biggest marker
            if (isBiggest) {
                const lr3 = r * 0.75;
                ctx.fillStyle = '#f39c12';
                ctx.font = `bold ${Math.max(11, r * 0.07)}px Inter, system-ui, sans-serif`;
                ctx.fillText('★ BIGGEST', cx + Math.cos(-midAngle) * lr3, cy + Math.sin(-midAngle) * lr3);
            }
        }
    }

    // Crease lines
    for (let i = 0; i < creases.length; i++) {
        const a = normalizeAngle(creases[i].angle);
        const x2 = cx + Math.cos(-a) * r;
        const y2 = cy + Math.sin(-a) * r;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = creases[i].mv === 'M' ? M_COLOR : V_COLOR;
        ctx.lineWidth = (i === hovered || i === dragging) ? 4.5 : 3;
        ctx.setLineDash(creases[i].mv === 'V' ? [8, 5] : []);
        ctx.stroke();
        ctx.setLineDash([]);

        // Handle
        if (!isPreview) {
            ctx.beginPath();
            ctx.arc(x2, y2, 8, 0, TAU);
            if (i === hovered || i === dragging) {
                ctx.fillStyle = '#fff';
                ctx.strokeStyle = creases[i].mv === 'M' ? M_COLOR : V_COLOR;
                ctx.lineWidth = 3;
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.fillStyle = creases[i].mv === 'M' ? M_COLOR : V_COLOR;
                ctx.fill();
            }

            // MV label
            const ld = r + 16;
            ctx.fillStyle = creases[i].mv === 'M' ? M_COLOR : V_COLOR;
            ctx.font = `bold ${Math.max(13, r * 0.08)}px Inter, system-ui, sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(creases[i].mv, cx + Math.cos(-a) * ld, cy + Math.sin(-a) * ld);
        }
    }

    // Center vertex
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, TAU);
    ctx.fillStyle = '#2c3e50';
    ctx.fill();

    // Validation panel
    if (!isPreview) {
        drawPanel(ctx, creases, isoAnto, w, h);
    }
}

function drawPanel(
    ctx: CanvasRenderingContext2D,
    creases: Crease[],
    isoAnto: ReturnType<typeof checkIsoAntoRule>,
    w: number, _h: number
) {
    const kawasaki = checkKawasaki4(creases);
    const maekawa = checkMaekawa4(creases);

    const px = 16, py = 16, pw = 300;
    let y = py + 18;
    ctx.fillStyle = 'rgba(0,0,0,0.78)';
    ctx.beginPath();
    ctx.roundRect(px, py, pw, 210, 12);
    ctx.fill();

    const f = (s: string, x: number, yy: number, color: string, font: string) => {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(s, x, yy);
    };

    f('ISO/ANTO Rule (4-Degree Vertex)', px + 14, y, '#fff', 'bold 13px Inter, system-ui, sans-serif');
    y += 28;

    // ISO/ANTO rule
    const isoIcon = isoAnto.valid ? '✓' : '✗';
    f(`${isoIcon} Biggest sector is ${isoAnto.biggestIsIso ? 'ISO' : 'ANTO'}`,
        px + 14, y, isoAnto.valid ? VALID_COLOR : INVALID_COLOR, 'bold 12px Inter, system-ui, sans-serif');
    y += 18;
    f(isoAnto.isUnique
        ? 'Unique biggest → must be ISO'
        : 'Not unique biggest (rule relaxed)',
        px + 14, y, 'rgba(255,255,255,0.5)', '11px Inter, system-ui, sans-serif');
    y += 24;

    // Kawasaki
    const kIcon = kawasaki.valid ? '✓' : '✗';
    f(`${kIcon} Kawasaki: α₁+α₃=${(kawasaki.sum02 * 180 / Math.PI).toFixed(1)}° α₂+α₄=${(kawasaki.sum13 * 180 / Math.PI).toFixed(1)}°`,
        px + 14, y, kawasaki.valid ? VALID_COLOR : INVALID_COLOR, '12px "SF Mono", monospace');
    y += 22;

    // Maekawa
    const mIcon = maekawa.valid ? '✓' : '✗';
    f(`${mIcon} Maekawa: M=${maekawa.m} V=${maekawa.v} |M−V|=${Math.abs(maekawa.m - maekawa.v)}`,
        px + 14, y, maekawa.valid ? VALID_COLOR : INVALID_COLOR, '12px "SF Mono", monospace');
    y += 28;

    // Overall
    const allValid = isoAnto.valid && kawasaki.valid && maekawa.valid;
    f(allValid ? '✓ Valid flat-foldable vertex!' : '✗ Not flat-foldable',
        px + 14, y, allValid ? VALID_COLOR : INVALID_COLOR, 'bold 13px Inter, system-ui, sans-serif');

    // Instructions
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.font = '11px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Drag handles · Click lines to toggle M/V', w / 2, _h - 14);
}

// ─── Main ────────────────────────────────────────────────────────────────────

export function isoAntoVertex(
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

    const radius = Math.min(width, height) * (isPreview ? 0.32 : 0.28);

    // Default: valid Kawasaki bird's foot with ISO biggest sector
    const creases: Crease[] = [
        { angle: 0, mv: 'M' },
        { angle: Math.PI * 0.35, mv: 'M' },       // 63°
        { angle: Math.PI, mv: 'V' },               // 180°
        { angle: Math.PI * 1.35, mv: 'M' },        // 243°
    ];

    let hovered = -1;
    let dragging = -1;

    const redraw = () => draw(ctx, creases, width, height, hovered, dragging, radius, isPreview);
    redraw();

    if (isPreview) {
        let animId = 0;
        let t = 0;
        const base = creases.map(c => c.angle);
        const animate = () => {
            animId = requestAnimationFrame(animate);
            t += 0.003;
            for (let i = 0; i < creases.length; i++) creases[i].angle = base[i] + t;
            redraw();
        };
        animate();
        return () => { cancelAnimationFrame(animId); if (mount.contains(canvas)) mount.removeChild(canvas); };
    }

    // Interaction
    const cx = width / 2, cy = height / 2;
    const getXY = (e: MouseEvent): [number, number] => {
        const r = canvas.getBoundingClientRect();
        return [e.clientX - r.left, e.clientY - r.top];
    };
    const hitHandle = (mx: number, my: number): number => {
        for (let i = 0; i < creases.length; i++) {
            const a = normalizeAngle(creases[i].angle);
            const hx = cx + Math.cos(-a) * radius;
            const hy = cy + Math.sin(-a) * radius;
            if (Math.sqrt((mx - hx) ** 2 + (my - hy) ** 2) < 14) return i;
        }
        return -1;
    };
    const hitLine = (mx: number, my: number): number => {
        for (let i = 0; i < creases.length; i++) {
            const a = normalizeAngle(creases[i].angle);
            const ex = cx + Math.cos(-a) * radius, ey = cy + Math.sin(-a) * radius;
            const dx = ex - cx, dy = ey - cy, len = Math.sqrt(dx * dx + dy * dy);
            const t = Math.max(0, Math.min(1, ((mx - cx) * dx + (my - cy) * dy) / (len * len)));
            const px = cx + t * dx, py = cy + t * dy;
            if (Math.sqrt((mx - px) ** 2 + (my - py) ** 2) < 10) return i;
        }
        return -1;
    };

    const onDown = (e: MouseEvent) => {
        const [mx, my] = getXY(e);
        const idx = hitHandle(mx, my);
        if (idx >= 0) { dragging = idx; canvas.style.cursor = 'grabbing'; }
    };
    const onMove = (e: MouseEvent) => {
        const [mx, my] = getXY(e);
        if (dragging >= 0) {
            creases[dragging].angle = normalizeAngle(Math.atan2(-(my - cy), mx - cx));
            redraw();
        } else {
            const idx = hitHandle(mx, my);
            hovered = idx >= 0 ? idx : hitLine(mx, my);
            canvas.style.cursor = hovered >= 0 ? 'pointer' : 'default';
            redraw();
        }
    };
    const onUp = (e: MouseEvent) => {
        if (dragging >= 0) { dragging = -1; canvas.style.cursor = 'default'; return; }
        const [mx, my] = getXY(e);
        const idx = hitLine(mx, my);
        if (idx >= 0) { creases[idx].mv = creases[idx].mv === 'M' ? 'V' : 'M'; redraw(); }
    };
    const onResize = () => {
        const w = mount.clientWidth, h = mount.clientHeight;
        canvas.width = w * dpr; canvas.height = h * dpr;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        draw(ctx, creases, w, h, hovered, dragging, Math.min(w, h) * 0.28, false);
    };

    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    window.addEventListener('resize', onResize);

    return () => {
        canvas.removeEventListener('mousedown', onDown);
        canvas.removeEventListener('mousemove', onMove);
        canvas.removeEventListener('mouseup', onUp);
        window.removeEventListener('resize', onResize);
        if (mount.contains(canvas)) mount.removeChild(canvas);
    };
}
