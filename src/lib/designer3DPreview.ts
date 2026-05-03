/**
 * @fileoverview Three.js 3D preview for the designer page.
 *
 * Shows the actual face decomposition + parametric panel/hinge geometry that
 * STL export will use. Updates whenever the 2D crease pattern changes.
 *
 * Layers:
 *   - Panels: each face = colored extruded slab (color per face for visual ID)
 *   - Hinges: knuckle cylinders (gray) along each crease, tabs (light) showing
 *             which panel each knuckle attaches to
 *   - Bores: not rendered separately (hole is in the knuckle geometry itself)
 *   - Crease overlays: thin lines on the floor at z=0 showing original creases
 *                     (so the user sees crease ↔ panel-edge correspondence)
 *
 * Toggles:
 *   - Show panels / hinges / wireframe
 *   - Fold animation slider (0 → 90°) — animates valley creases up, mountain
 *     creases down (purely visual, doesn't drive STL geometry)
 */

import type { PGPoint, PGFace } from './planarGraph';

export interface Preview3DState {
    /** Inset distance from crease to panel edge (matches STL constants). */
    panelInset: number;
    /** Panel thickness. */
    panelT: number;
    /** Knuckle outer radius. */
    knuckleR: number;
    /** Bore radius. */
    boreR: number;
    /** Knuckle axial length. */
    knuckleLen: number;
    /** Knuckle axial gap. */
    knuckleGap: number;
}

export interface Preview3DInputs {
    verts: PGPoint[];
    faces: PGFace[];
    /** Original creases (with M/V) for overlay rendering. */
    creases: { p0: PGPoint; p1: PGPoint; mv: 'M' | 'V' | 'U' }[];
    paperW: number;
    paperH: number;
}

export interface Preview3DController {
    update: (inputs: Preview3DInputs) => void;
    setShowPanels: (v: boolean) => void;
    setShowHinges: (v: boolean) => void;
    setWireframe: (v: boolean) => void;
    dispose: () => void;
}

/**
 * Initialize a Three.js preview viewport mounted into the given container.
 * Returns controller for updates / cleanup.
 */
export async function initPreview3D(
    container: HTMLElement,
    params: Preview3DState
): Promise<Preview3DController> {
    const THREE = await import('three');
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js');

    const w = container.clientWidth || 400;
    const h = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141923);

    const camera = new THREE.PerspectiveCamera(45, w / h, 1, 2000);
    camera.position.set(150, 180, 200);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(100, 0, 100);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(150, 250, 150);
    scene.add(dir);

    // Reference grid floor
    const grid = new THREE.GridHelper(400, 20, 0x444444, 0x222222);
    grid.position.y = -0.5;
    scene.add(grid);

    // Mutable groups so we can swap geometry on each update
    const panelsGroup = new THREE.Group();
    const hingesGroup = new THREE.Group();
    const overlayGroup = new THREE.Group();
    scene.add(panelsGroup, hingesGroup, overlayGroup);

    let showPanels = true, showHinges = true, wireframe = false;

    function clearGroup(g: import('three').Group) {
        while (g.children.length) {
            const child = g.children[0];
            g.remove(child);
            if ((child as import('three').Mesh).geometry) (child as import('three').Mesh).geometry.dispose();
            const mat = (child as import('three').Mesh).material;
            if (Array.isArray(mat)) mat.forEach(m => m.dispose());
            else if (mat) mat.dispose();
        }
    }

    /** Color per face — distinct, perceptually separated. */
    function faceColor(i: number): import('three').Color {
        const hue = (i * 0.618033988749895) % 1; // golden-ratio hue stepping
        const c = new THREE.Color();
        c.setHSL(hue, 0.55, 0.55);
        return c;
    }

    function buildPanelGeom(face: PGFace, verts: PGPoint[],
                            paperOriginX: number, paperOriginY: number): import('three').BufferGeometry | null {
        const inset = params.panelInset;
        // Build polygon (CCW) and inset
        const loop = face.loop.map(i => verts[i]);
        const insetted = insetPolygon(loop, inset);
        if (insetted.length < 3) return null;

        // Convert to Three.js Shape (in XZ plane after extrusion → translate to Y up)
        // We extrude shape (XY) along +Z then later transform so Y becomes up.
        // Simpler: build shape in XY representing paper coords, extrude depth=T,
        // then place at world origin (paper sits flat on XY, extruded up Z).
        const shape = new THREE.Shape();
        shape.moveTo(insetted[0].x - paperOriginX, insetted[0].y - paperOriginY);
        for (let i = 1; i < insetted.length; i++) {
            shape.lineTo(insetted[i].x - paperOriginX, insetted[i].y - paperOriginY);
        }
        const geom = new THREE.ExtrudeGeometry(shape, {
            depth: params.panelT,
            bevelEnabled: false,
            curveSegments: 1,
            steps: 1,
        });
        // Currently extruded along +Z, shape on XY → matches paper-flat orientation.
        // We want paper on world XZ (Y up). Rotate -90° around X axis.
        geom.rotateX(-Math.PI / 2);
        return geom;
    }

    function buildKnuckleGeom(side: 'A' | 'B'): import('three').BufferGeometry {
        const T = params.panelT;
        const R = params.knuckleR;
        const RIN = params.boreR;
        const D = params.panelInset;
        const shape = new THREE.Shape();
        if (side === 'A') {
            shape.moveTo(-D, 0);
            shape.lineTo(0, 0);
            shape.absarc(0, T / 2, R, -Math.PI / 2, Math.PI / 2, false);
            shape.lineTo(-D, T);
            shape.lineTo(-D, 0);
        } else {
            shape.moveTo(D, 0);
            shape.lineTo(D, T);
            shape.lineTo(0, T);
            shape.absarc(0, T / 2, R, Math.PI / 2, 3 * Math.PI / 2, false);
            shape.lineTo(D, 0);
        }
        const hole = new THREE.Path();
        hole.absarc(0, T / 2, RIN, 0, Math.PI * 2, true);
        shape.holes.push(hole);
        return new THREE.ExtrudeGeometry(shape, {
            depth: params.knuckleLen,
            bevelEnabled: false,
            curveSegments: 16,
            steps: 1,
        });
    }

    function placeKnuckle(geom: import('three').BufferGeometry,
                          sx: number, sy: number, ux: number, uy: number,
                          paperOriginX: number, paperOriginY: number): import('three').BufferGeometry {
        // Local frame: X=perp(in paper), Y=vertical, Z=along crease
        // World frame: X=paperX-relative, Y=up, Z=paperY-relative
        // Same matrix as designerEngine.knuckleMatrix but with Y/Z swapped per world convention.
        const m = new (geom.constructor as typeof import('three').BufferGeometry === geom.constructor
            ? Object.getPrototypeOf(geom).constructor.prototype.constructor : Function)(); // placeholder
        void m;
        const THREE_M = (geom as unknown as { applyMatrix4: (m: import('three').Matrix4) => void });
        // Build matrix manually
        const Matrix4 = (geom as unknown as { constructor: { name: string } });
        void Matrix4;

        // Use a helper Matrix4 — import THREE's Matrix4 statically would cycle; use local
        // Actually we have THREE in closure already
        const m4 = new THREE.Matrix4();
        // Columns: localX, localY, localZ, origin
        // localX (perp) = (-uy, 0, ux) in world (X, Y, Z) — note Y axis is up
        // localY (vertical) = (0, 1, 0)
        // localZ (along crease) = (ux, 0, uy)
        // origin = (sx - paperOriginX, 0, sy - paperOriginY)
        m4.set(
            -uy, 0, ux, sx - paperOriginX,
              0, 1,  0, 0,
             ux, 0, uy, sy - paperOriginY,
              0, 0,  0, 1
        );
        THREE_M.applyMatrix4(m4);
        return geom;
    }

    function buildOverlayLines(creases: Preview3DInputs['creases'],
                                paperOriginX: number, paperOriginY: number): import('three').LineSegments {
        const positions: number[] = [];
        const colors: number[] = [];
        for (const c of creases) {
            positions.push(c.p0.x - paperOriginX, 0.05, c.p0.y - paperOriginY);
            positions.push(c.p1.x - paperOriginX, 0.05, c.p1.y - paperOriginY);
            const col = c.mv === 'M' ? [0.9, 0.3, 0.2]
                      : c.mv === 'V' ? [0.2, 0.5, 0.9]
                      : [0.5, 0.5, 0.5];
            colors.push(...col, ...col);
        }
        const geom = new THREE.BufferGeometry();
        geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        const mat = new THREE.LineBasicMaterial({ vertexColors: true });
        return new THREE.LineSegments(geom, mat);
    }

    function update(inputs: Preview3DInputs) {
        clearGroup(panelsGroup);
        clearGroup(hingesGroup);
        clearGroup(overlayGroup);

        // Use paper bottom-left as world origin (so paper centered roughly at origin
        // is easier to view). Actually keep paper origin at (0,0) and just shift to
        // center paper on world origin for nicer view.
        const cx = inputs.paperW / 2;
        const cy = inputs.paperH / 2;

        // Panels — each face as colored extruded slab
        inputs.faces.forEach((face, fi) => {
            const geom = buildPanelGeom(face, inputs.verts, cx, cy);
            if (!geom) return;
            const mat = new THREE.MeshStandardMaterial({
                color: faceColor(fi),
                wireframe,
                roughness: 0.85,
                metalness: 0.0,
                side: THREE.DoubleSide,
            });
            const mesh = new THREE.Mesh(geom, mat);
            panelsGroup.add(mesh);
        });

        // Hinges — for each crease (assigned only), lay knuckles
        const stride = params.knuckleLen + params.knuckleGap;
        for (const c of inputs.creases) {
            if (c.mv === 'U') continue;
            const dx = c.p1.x - c.p0.x, dy = c.p1.y - c.p0.y;
            const len = Math.hypot(dx, dy);
            if (len < params.knuckleLen * 2 + params.knuckleGap) continue;
            const ux = dx / len, uy = dy / len;
            const n = Math.floor((len + params.knuckleGap) / stride);
            if (n < 2) continue;
            const totalLen = n * params.knuckleLen + (n - 1) * params.knuckleGap;
            const startOff = (len - totalLen) / 2;

            for (let i = 0; i < n; i++) {
                const side: 'A' | 'B' = i % 2 === 0 ? 'A' : 'B';
                const s0 = startOff + i * stride;
                const sx = c.p0.x + ux * s0, sy = c.p0.y + uy * s0;
                const geom = buildKnuckleGeom(side);
                placeKnuckle(geom, sx, sy, ux, uy, cx, cy);
                const mat = new THREE.MeshStandardMaterial({
                    color: side === 'A' ? 0x999999 : 0xbbbbbb,
                    wireframe,
                    roughness: 0.6,
                    metalness: 0.2,
                    side: THREE.DoubleSide,
                });
                hingesGroup.add(new THREE.Mesh(geom, mat));
            }
        }

        // Crease overlay lines on floor
        if (inputs.creases.length > 0) {
            overlayGroup.add(buildOverlayLines(inputs.creases, cx, cy));
        }

        panelsGroup.visible = showPanels;
        hingesGroup.visible = showHinges;
    }

    let raf = 0;
    function animate() {
        raf = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();

    function onResize() {
        const W = container.clientWidth, H = container.clientHeight;
        if (W < 1 || H < 1) return;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
    }
    window.addEventListener('resize', onResize);

    return {
        update,
        setShowPanels: v => { showPanels = v; panelsGroup.visible = v; },
        setShowHinges: v => { showHinges = v; hingesGroup.visible = v; },
        setWireframe: v => {
            wireframe = v;
            panelsGroup.children.forEach(m => {
                const mat = (m as import('three').Mesh).material as import('three').MeshStandardMaterial;
                if (mat) mat.wireframe = v;
            });
            hingesGroup.children.forEach(m => {
                const mat = (m as import('three').Mesh).material as import('three').MeshStandardMaterial;
                if (mat) mat.wireframe = v;
            });
        },
        dispose: () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', onResize);
            clearGroup(panelsGroup);
            clearGroup(hingesGroup);
            clearGroup(overlayGroup);
            controls.dispose();
            renderer.dispose();
            container.removeChild(renderer.domElement);
        },
    };
}

// ─── Local helper: inset polygon (duplicated from planarGraph to avoid extra import in 3d code) ───

function insetPolygon(loop: PGPoint[], d: number): PGPoint[] {
    const n = loop.length;
    const result: PGPoint[] = [];
    for (let i = 0; i < n; i++) {
        const prev = loop[(i - 1 + n) % n];
        const cur = loop[i];
        const next = loop[(i + 1) % n];
        const e1x = cur.x - prev.x, e1y = cur.y - prev.y;
        const e1L = Math.hypot(e1x, e1y);
        const u1x = e1x / e1L, u1y = e1y / e1L;
        const n1x = u1y, n1y = -u1x;
        const e2x = next.x - cur.x, e2y = next.y - cur.y;
        const e2L = Math.hypot(e2x, e2y);
        const u2x = e2x / e2L, u2y = e2y / e2L;
        const n2x = u2y, n2y = -u2x;
        const p1x = prev.x + n1x * d, p1y = prev.y + n1y * d;
        const p2x = cur.x + n2x * d, p2y = cur.y + n2y * d;
        const det = u1x * (-u2y) - u1y * (-u2x);
        if (Math.abs(det) < 1e-9) {
            result.push({ x: cur.x + (n1x + n2x) / 2 * d, y: cur.y + (n1y + n2y) / 2 * d });
            continue;
        }
        const dx = p2x - p1x, dy = p2y - p1y;
        const t = (dx * (-u2y) - dy * (-u2x)) / det;
        result.push({ x: p1x + u1x * t, y: p1y + u1y * t });
    }
    return result;
}
