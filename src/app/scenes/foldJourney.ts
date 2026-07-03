import * as THREE from 'three';
import { makeText, disposeText } from '../ui/text';
import type { Text } from 'troika-three-text';
import type { FoldMesh } from '../fold/foldEngine';
import type { CreasePattern } from '../fold/creasePattern';

/**
 * Landing "fold journey" — the site's thesis in ~7s (SPEC design doc, part 2):
 *   0. Rationalize: a doubly-curved surface becomes flat panels (façade work),
 *   1. the panels settle into one flat sheet,
 *   2. crease lines draw in, theory captions prove flat-foldability,
 *   3. (handed back to home.ts) the sheet folds into the nav rooms.
 */
export interface Journey {
  /** Advance to `elapsed` seconds since start; true once the sequence is over. */
  update(elapsed: number): boolean;
  dispose(): void;
}

const SADDLE_K = 0.35; // z = k(x² − y²)
const GRID = 6; // panelization coarseness

// Phase timings (s)
const T_SURFACE = 0.9; // smooth saddle fades in
const T_PANELS = 1.0; // smooth → faceted panels
const T_FLATTEN = 1.5; // panels unroll into the flat sheet
const R_END = T_SURFACE + T_PANELS + T_FLATTEN;
const T_CREASES = 2.6; // crease draw-in + theory captions
export const JOURNEY_END = R_END + T_CREASES;

const saddleZ = (x: number, y: number) => SADDLE_K * (x * x - y * y);

/** 1 inside [t0+ramp, t1−ramp], easing to 0 at the window edges. */
function fade(t: number, t0: number, t1: number, ramp = 0.35): number {
  const a = THREE.MathUtils.smoothstep(t, t0, t0 + ramp);
  const b = 1 - THREE.MathUtils.smoothstep(t, t1 - ramp, t1);
  return Math.min(a, b);
}

export function createJourney(
  scene: THREE.Scene,
  foldMesh: FoldMesh,
  pattern: CreasePattern,
  dark: boolean,
): Journey {
  const group = new THREE.Group();
  group.rotation.x = -0.55; // tilt so the double curvature reads
  scene.add(group);

  const glass = dark ? 0x44576a : 0xaac4d4; // façade-glass tint

  // --- Smooth doubly-curved surface (the "freeform" starting point) ---
  const smoothGeo = new THREE.PlaneGeometry(2, 2, 40, 40);
  {
    const pos = smoothGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setZ(i, saddleZ(pos.getX(i), pos.getY(i)));
    smoothGeo.computeVertexNormals();
  }
  const smoothMat = new THREE.MeshStandardMaterial({
    color: glass,
    roughness: 0.45,
    metalness: 0.25,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    depthWrite: false, // faded-out ghost must not occlude the panels
  });
  const smooth = new THREE.Mesh(smoothGeo, smoothMat);
  smooth.renderOrder = 1;
  group.add(smooth);

  // --- Faceted panels: coarse triangulation, shrunk so seams show ---
  const step = 2 / GRID;
  const startPos: number[] = []; // on the saddle
  const flatPos: number[] = []; // unrolled to z=0
  const centroids: [number, number][] = [];
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const x0 = -1 + i * step;
      const y0 = -1 + j * step;
      const cellTris: [number, number][][] = [
        [
          [x0, y0],
          [x0 + step, y0],
          [x0 + step, y0 + step],
        ],
        [
          [x0, y0],
          [x0 + step, y0 + step],
          [x0, y0 + step],
        ],
      ];
      for (const tri of cellTris) {
        const cx = (tri[0][0] + tri[1][0] + tri[2][0]) / 3;
        const cy = (tri[0][1] + tri[1][1] + tri[2][1]) / 3;
        centroids.push([cx, cy]);
        for (const [x, y] of tri) {
          // shrink toward the centroid → visible panel joints
          const sx = cx + (x - cx) * 0.92;
          const sy = cy + (y - cy) * 0.92;
          startPos.push(sx, sy, saddleZ(sx, sy));
          flatPos.push(sx, sy, 0);
        }
      }
    }
  }
  const triCount = centroids.length;
  const positions = new Float32Array(startPos);
  const startArr = new Float32Array(startPos);
  const flatArr = new Float32Array(flatPos);
  // Flatten wave spreads from the center outward
  const delays = centroids.map(([cx, cy]) => (Math.hypot(cx, cy) / Math.SQRT2) * T_FLATTEN * 0.45);
  const FLATTEN_LOCAL = T_FLATTEN * 0.55;

  const panelGeo = new THREE.BufferGeometry();
  panelGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  panelGeo.computeVertexNormals();
  const panelMat = new THREE.MeshStandardMaterial({
    color: glass,
    roughness: 0.4,
    metalness: 0.3,
    flatShading: true,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0,
    depthWrite: false, // faded-out ghost must not occlude sheet/crease lines
  });
  const panels = new THREE.Mesh(panelGeo, panelMat);
  panels.renderOrder = 2; // over the smooth surface, over the revealed sheet
  panels.position.z = 0.006; // float above the sheet during the reveal crossfade
  group.add(panels);

  // --- Captions ---
  const capColor = dark ? '#9aa7b5' : '#5a6672';
  function cap(text: string): Text {
    const t = makeText({ text, size: 0.075, color: capColor, anchorX: 'center', anchorY: 'middle' });
    t.position.set(0, -1.4, 0.1);
    t.fillOpacity = 0;
    scene.add(t);
    return t;
  }
  const captions: { t: Text; t0: number; t1: number }[] = [
    { t: cap('freeform → buildable panels'), t0: T_SURFACE + 0.3, t1: R_END + 0.2 },
    {
      t: cap('Kawasaki  90°+90° = 180° ✓     Maekawa  |M−V| = |3−1| = 2 ✓'),
      t0: R_END + 0.4,
      t1: JOURNEY_END - 1.0,
    },
    { t: cap('→ provably flat-foldable'), t0: JOURNEY_END - 1.1, t1: JOURNEY_END + 0.3 },
  ];

  // --- Crease draw-in bookkeeping ---
  // Fold creases reveal one by one; border lines fade in together.
  const foldIdx = pattern.creases.map((c, i) => (c.assignment !== 'B' ? i : -1)).filter((i) => i >= 0);
  const borderIdx = pattern.creases.map((c, i) => (c.assignment === 'B' ? i : -1)).filter((i) => i >= 0);
  const lineMat = (i: number) => foldMesh.creaseLines[i].material as THREE.LineBasicMaterial;

  // Journey owns the fold mesh's initial visibility
  foldMesh.group.visible = false;
  foldMesh.creaseLines.forEach((l) => ((l.material as THREE.LineBasicMaterial).opacity = 0));

  let done = false;
  let flattenDone = false;

  function update(elapsed: number): boolean {
    if (done) return true;

    // Smooth surface: in at 0, out as panels take over
    smoothMat.opacity = fade(elapsed, 0, T_SURFACE + T_PANELS * 0.7, 0.5) * 0.95;
    smooth.visible = smoothMat.opacity > 0.005;
    // Panels: in during T_PANELS, out once the sheet is revealed
    panelMat.opacity = Math.min(
      THREE.MathUtils.smoothstep(elapsed, T_SURFACE, T_SURFACE + 0.5),
      1 - THREE.MathUtils.smoothstep(elapsed, R_END, R_END + 0.4),
    );
    panels.visible = panelMat.opacity > 0.005;

    // Unroll: per-panel lerp saddle → flat, wave from center, tilt eases out
    const flattenStart = T_SURFACE + T_PANELS;
    if (elapsed > flattenStart && !flattenDone) {
      for (let k = 0; k < triCount; k++) {
        const lt = THREE.MathUtils.clamp((elapsed - flattenStart - delays[k]) / FLATTEN_LOCAL, 0, 1);
        const e = THREE.MathUtils.smoothstep(lt, 0, 1);
        for (let v = 0; v < 9; v++) {
          const idx = k * 9 + v;
          positions[idx] = startArr[idx] + (flatArr[idx] - startArr[idx]) * e;
        }
      }
      panelGeo.attributes.position.needsUpdate = true;
      panelGeo.computeVertexNormals();
      if (elapsed > R_END) flattenDone = true;
    }
    group.rotation.x = -0.55 * (1 - THREE.MathUtils.smoothstep(elapsed, flattenStart, R_END));

    // Reveal the real sheet under the fading panels
    if (elapsed > R_END && !foldMesh.group.visible) foldMesh.group.visible = true;

    // Crease draw-in
    const creaseStart = R_END + 0.3;
    foldIdx.forEach((li, k) => {
      lineMat(li).opacity = 0.9 * THREE.MathUtils.smoothstep(elapsed, creaseStart + k * 0.3, creaseStart + k * 0.3 + 0.4);
    });
    for (const li of borderIdx) {
      lineMat(li).opacity = 0.3 * THREE.MathUtils.smoothstep(elapsed, creaseStart, creaseStart + 0.6);
    }

    // Captions
    for (const c of captions) c.t.fillOpacity = fade(elapsed, c.t0, c.t1);

    if (elapsed >= JOURNEY_END) {
      done = true;
      foldMesh.group.visible = true;
      foldIdx.forEach((li) => (lineMat(li).opacity = 0.9));
      borderIdx.forEach((li) => (lineMat(li).opacity = 0.3));
    }
    return done;
  }

  function dispose() {
    scene.remove(group);
    smoothGeo.dispose();
    smoothMat.dispose();
    panelGeo.dispose();
    panelMat.dispose();
    for (const c of captions) {
      scene.remove(c.t);
      disposeText(c.t);
    }
    // Leave the fold mesh in its revealed state for whoever runs next
    foldMesh.group.visible = true;
  }

  return { update, dispose };
}
