import * as THREE from 'three';

/**
 * Landing "fold journey" — the site's thesis, scroll-scrubbed.
 *
 * Ported from the Claude Design "Folded Intro" prototype (folded-intro.js):
 * one continuous scroll axis drives four beats —
 *   01 SURFACE     a freeform doubly-curved skin (unbuildable as-is),
 *   02 RATIONALIZE the façade consultant's move: discrete planar panels,
 *   03 DEVELOP     panels laid flat as one crease pattern (valleys/mountains),
 *   04 FOLD        1 DOF — every crease rotates together into the rigid Miura.
 * A captioned HUD and the "Folded" title reveal ride along.
 *
 * The prototype owned its own renderer + page scroll; here the sequence renders
 * into the shared scene/camera and is advanced by a scroll fraction p∈[0,1]
 * supplied by home.ts. home.ts hands off to the nav fold-in once p reaches 1.
 */
export interface Journey {
  /** Advance to scroll fraction p (0 = start, 1 = fully folded). */
  update(p: number): void;
  /** Hold the fully-folded Miura without touching camera/title/HUD (rooms backdrop). */
  hold(): void;
  /** Show/hide the intro chrome (caption card + wordmark + title sprite). */
  setChrome(visible: boolean): void;
  /** Flat sheet width in world units — for framing the rooms camera. */
  baseSize: number;
  dispose(): void;
}

// Crease-pattern params (prototype defaults: sweep choreography, γ 63°, 14 cols, foldMax 72°).
const COLS = 14;
const GAMMA = 63;
const FOLD_MAX = 72;

const BEATS: [string, string][] = [
  ['01 · SURFACE', 'A freeform skin — doubly curved, continuous. Beautiful, and unbuildable as-is.'],
  ['02 · RATIONALIZE', 'The consultant’s move: reduce the surface to discrete planar panels. Buildable geometry, hairline joints.'],
  ['03 · DEVELOP', 'Panels laid out flat: one sheet, one crease pattern. Cyan valleys, grey mountains — flat-foldable by construction.'],
  ['04 · FOLD', 'One degree of freedom. Every crease rotates together — rigid faces, no bending — and the sheet becomes the site.'],
];

function clamp(x: number, a: number, b: number): number {
  return x < a ? a : x > b ? b : x;
}
function phase(p: number, s: number, e: number): number {
  return clamp((p - s) / (e - s), 0, 1);
}
function smooth(u: number): number {
  return u * u * u * (u * (u * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function createJourney(scene: THREE.Scene, camera: THREE.Camera): Journey {
  const persp = camera as THREE.PerspectiveCamera;
  const prevFov = persp.fov;
  persp.fov = 38;
  persp.updateProjectionMatrix();

  /* ---------- HUD (DOM overlay) ---------- */
  const hud = document.createElement('div');
  hud.style.cssText =
    'position:fixed;inset:0;z-index:2;pointer-events:none;font-family:Inter,system-ui,sans-serif;';
  const mark = document.createElement('div');
  mark.textContent = 'FOLDED · INTRO';
  mark.style.cssText =
    'position:fixed;top:24px;left:28px;font:500 10px "JetBrains Mono",ui-monospace,monospace;letter-spacing:.22em;color:#6b7480;';
  const card = document.createElement('div');
  card.style.cssText =
    'position:fixed;left:28px;bottom:28px;max-width:380px;padding:16px 20px;border-radius:18px;background:rgba(17,19,26,.55);border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:opacity .45s cubic-bezier(.16,1,.3,1);opacity:1;';
  const idxEl = document.createElement('div');
  idxEl.style.cssText =
    'font:500 11px "JetBrains Mono",ui-monospace,monospace;letter-spacing:.14em;color:#3aa9e6;margin-bottom:6px;';
  const txtEl = document.createElement('div');
  txtEl.style.cssText = 'font:400 13px/1.55 Inter,system-ui,sans-serif;color:#aab2bf;';
  idxEl.textContent = BEATS[0][0];
  txtEl.textContent = BEATS[0][1];
  card.appendChild(idxEl);
  card.appendChild(txtEl);
  const hint = document.createElement('div');
  hint.textContent = 'SCROLL';
  hint.style.cssText =
    'position:fixed;left:50%;transform:translateX(-50%);bottom:26px;font:500 10px "JetBrains Mono",ui-monospace,monospace;letter-spacing:.34em;color:#6b7480;transition:opacity .6s;';
  hud.appendChild(mark);
  hud.appendChild(card);
  hud.appendChild(hint);
  document.body.appendChild(hud);

  /* ---------- lights (bluish rim to match the prototype paper look) ---------- */
  const hemi = new THREE.HemisphereLight(0x8f9baa, 0x14161c, 0.55);
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(6, 10, 4);
  const rim = new THREE.DirectionalLight(0x30a7e1, 0.55);
  rim.position.set(-8, 3, -6);
  scene.add(hemi, key, rim);

  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xf2f3f5,
    roughness: 0.82,
    metalness: 0.02,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0 });

  /* ---------- title sprite ---------- */
  const titleCv = document.createElement('canvas');
  titleCv.width = 1024;
  titleCv.height = 300;
  function drawTitle() {
    const ctx2 = titleCv.getContext('2d');
    if (!ctx2) return;
    ctx2.clearRect(0, 0, 1024, 300);
    ctx2.textAlign = 'center';
    ctx2.fillStyle = '#f2f3f5';
    ctx2.font = '600 118px Inter, system-ui, sans-serif';
    ctx2.fillText('Folded', 512, 150);
    try {
      ctx2.letterSpacing = '10px';
    } catch {
      /* letterSpacing unsupported */
    }
    ctx2.fillStyle = '#7e8794';
    ctx2.font = '400 26px "JetBrains Mono", ui-monospace, monospace';
    ctx2.fillText('GEOMETRY, RATIONALIZED', 512, 226);
  }
  drawTitle();
  const titleTex = new THREE.CanvasTexture(titleCv);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      drawTitle();
      titleTex.needsUpdate = true;
    });
  }
  const titleMat = new THREE.SpriteMaterial({ map: titleTex, transparent: true, opacity: 0, depthTest: false });
  const title = new THREE.Sprite(titleMat);
  title.renderOrder = 10;
  scene.add(title);

  /* ---------- geometry ---------- */
  const C = COLS;
  const R = Math.max(5, Math.round(C * 0.62));
  const a = 1;
  const b = 1.12;
  const g = (GAMMA * Math.PI) / 180;
  const F = R * C;

  function mkm(theta: number) {
    const st = Math.sin(theta),
      ct = Math.cos(theta),
      sg = Math.sin(g),
      tg = Math.tan(g);
    const dn = Math.sqrt(1 + ct * ct * tg * tg);
    return { H: a * st * sg, S: (b * ct * tg) / dn, L: a * Math.sqrt(1 - st * st * sg * sg), V: b / dn };
  }
  const m0 = mkm(0);
  const sheetW = C * m0.S,
    sheetH = R * m0.L + m0.V;
  const baseSize = sheetW;
  title.scale.set(sheetW * 0.5, ((sheetW * 0.5) * 300) / 1024, 1);
  title.position.set(0, sheetW * 0.2, 0);

  // exact rigid Miura vertex: world = (x, y-up, z-depth)
  function foldPos(i: number, j: number, m: ReturnType<typeof mkm>, out: number[]) {
    out[0] = j * m.S - (C * m.S) / 2;
    out[2] = i * m.L + (j % 2) * m.V - (R * m.L + m.V) / 2;
    out[1] = (i % 2) * m.H - m.H / 2;
  }

  // curved "façade" state: a shared smooth surface over the sheet
  const amp = sheetW * 0.13;
  const t0 = [0, 0, 0];
  const cuGrid = new Float32Array((R + 1) * (C + 1) * 3);
  for (let i = 0; i <= R; i++)
    for (let j = 0; j <= C; j++) {
      foldPos(i, j, m0, t0);
      const x = t0[0],
        y = t0[2];
      const h =
        amp * Math.sin((x / sheetW) * 3.4 + 0.6) * Math.cos((y / sheetH) * 2.6) +
        amp * 0.55 * Math.sin(((x + y * 1.3) / sheetW) * 2.1);
      const o = (i * (C + 1) + j) * 3;
      cuGrid[o] = x + amp * 0.18 * Math.sin((y / sheetH) * 3.0);
      cuGrid[o + 1] = h;
      cuGrid[o + 2] = y + amp * 0.14 * Math.cos((x / sheetW) * 2.4);
    }

  // per-face data
  const ijArr = new Int16Array(F * 8);
  const cuArr = new Float32Array(F * 12);
  const plArr = new Float32Array(F * 12);
  const dArr = new Float32Array(F);

  // "sweep" choreography: diagonal stagger front (row+col)
  function stagOf(r: number, c: number): number {
    return ((R > 1 ? r / (R - 1) : 0) + (C > 1 ? c / (C - 1) : 0)) / 2;
  }

  const CI = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ]; // corner (di,dj), CCW
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      const f = r * C + c;
      dArr[f] = stagOf(r, c);
      const cen = [0, 0, 0];
      let k: number, q: number;
      for (k = 0; k < 4; k++) {
        const ci = r + CI[k][0],
          cj = c + CI[k][1];
        ijArr[f * 8 + k * 2] = ci;
        ijArr[f * 8 + k * 2 + 1] = cj;
        const go = (ci * (C + 1) + cj) * 3,
          fo = f * 12 + k * 3;
        for (q = 0; q < 3; q++) {
          cuArr[fo + q] = cuGrid[go + q];
          cen[q] += cuGrid[go + q] / 4;
        }
      }
      // best-fit plane: normal = cross(diag02, diag13)
      const d1: number[] = [],
        d2: number[] = [];
      for (q = 0; q < 3; q++) {
        d1[q] = cuArr[f * 12 + 6 + q] - cuArr[f * 12 + q];
        d2[q] = cuArr[f * 12 + 9 + q] - cuArr[f * 12 + 3 + q];
      }
      let n = [d1[1] * d2[2] - d1[2] * d2[1], d1[2] * d2[0] - d1[0] * d2[2], d1[0] * d2[1] - d1[1] * d2[0]];
      const nl = Math.hypot(n[0], n[1], n[2]) || 1;
      n = [n[0] / nl, n[1] / nl, n[2] / nl];
      for (k = 0; k < 4; k++) {
        const off = f * 12 + k * 3;
        let dp = 0;
        for (q = 0; q < 3; q++) dp += (cuArr[off + q] - cen[q]) * n[q];
        for (q = 0; q < 3; q++) {
          const proj = cuArr[off + q] - n[q] * dp; // flatten to plane
          plArr[off + q] = cen[q] + (proj - cen[q]) * 0.9; // shrink → hairline gaps
        }
      }
    }

  // buffers
  const posArr = new Float32Array(F * 18);
  const lineArr = new Float32Array(F * 24);
  const colArr = new Float32Array(F * 24);
  const VALLEY = [0.22, 0.72, 1.0],
    MOUNT = [0.6, 0.64, 0.7],
    BORDER = [0.4, 0.43, 0.48];
  for (let r = 0; r < R; r++)
    for (let c = 0; c < C; c++) {
      const f = r * C + c;
      // edges: 0: col c | 1: row r+1 | 2: col c+1 | 3: row r
      const types = [
        c > 0 ? (c % 2 === 1 ? VALLEY : MOUNT) : BORDER,
        r + 1 < R ? ((r + 1) % 2 === 0 ? VALLEY : MOUNT) : BORDER,
        c + 1 < C ? ((c + 1) % 2 === 1 ? VALLEY : MOUNT) : BORDER,
        r > 0 ? (r % 2 === 0 ? VALLEY : MOUNT) : BORDER,
      ];
      for (let e = 0; e < 4; e++) for (let v = 0; v < 2; v++) for (let q = 0; q < 3; q++) colArr[f * 24 + e * 6 + v * 3 + q] = types[e][q];
    }

  const geo = new THREE.BufferGeometry();
  const posAttr = new THREE.BufferAttribute(posArr, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  geo.setAttribute('position', posAttr);
  const lgeo = new THREE.BufferGeometry();
  const lineAttr = new THREE.BufferAttribute(lineArr, 3);
  lineAttr.setUsage(THREE.DynamicDrawUsage);
  lgeo.setAttribute('position', lineAttr);
  lgeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
  const mesh = new THREE.Mesh(geo, paperMat);
  const lines = new THREE.LineSegments(lgeo, lineMat);
  mesh.frustumCulled = false;
  lines.frustumCulled = false;
  scene.add(mesh, lines);

  const corn = new Float32Array(12);
  const STAG = 0.55,
    INV = 1 / (1 - STAG);
  const tmpPos = [0, 0, 0];
  function wTri(o: number, ca: number, cb: number, cc: number) {
    for (let q = 0; q < 3; q++) {
      posArr[o + q] = corn[ca * 3 + q];
      posArr[o + 3 + q] = corn[cb * 3 + q];
      posArr[o + 6 + q] = corn[cc * 3 + q];
    }
  }
  function updateGeom(p: number) {
    const pB = phase(p, 0.18, 0.46),
      pC = phase(p, 0.46, 0.74),
      pD = phase(p, 0.74, 1.0);
    const theta = ((FOLD_MAX * Math.PI) / 180) * smooth(pD);
    const m = mkm(theta);
    let pi = 0,
      li = 0;
    for (let f = 0; f < F; f++) {
      const d = dArr[f];
      const tb = smooth(clamp((pB - d * STAG) * INV, 0, 1));
      const tc = smooth(clamp((pC - d * STAG) * INV, 0, 1));
      for (let k = 0; k < 4; k++) {
        foldPos(ijArr[f * 8 + k * 2], ijArr[f * 8 + k * 2 + 1], m, tmpPos);
        const o = f * 12 + k * 3;
        for (let q = 0; q < 3; q++) {
          const base = cuArr[o + q] + (plArr[o + q] - cuArr[o + q]) * tb;
          corn[k * 3 + q] = base + (tmpPos[q] - base) * tc;
        }
      }
      wTri(pi, 0, 1, 2);
      pi += 9;
      wTri(pi, 0, 2, 3);
      pi += 9;
      for (let e = 0; e < 4; e++) {
        const a1 = e * 3,
          b1 = ((e + 1) % 4) * 3;
        for (let q = 0; q < 3; q++) {
          lineArr[li + q] = corn[a1 + q];
          lineArr[li + 3 + q] = corn[b1 + q];
        }
        li += 6;
      }
    }
    posAttr.needsUpdate = true;
    geo.computeVertexNormals();
    lineAttr.needsUpdate = true;
    lineMat.opacity = (0.4 * phase(p, 0.03, 0.18) + 0.5 * smooth(pC)) * (1 - 0.6 * smooth(pD));
  }

  /* ---------- camera choreography ---------- */
  const KEYS = [
    [0.0, 1.5, -38, 13],
    [0.18, 1.6, -24, 30],
    [0.46, 1.66, -10, 56],
    [0.74, 1.52, 2, 80],
    [1.0, 0.85, 42, 17],
  ];
  function updateCam(p: number) {
    let s = 0;
    while (s < KEYS.length - 2 && p > KEYS[s + 1][0]) s++;
    const A = KEYS[s],
      B = KEYS[s + 1];
    const u = smooth(phase(p, A[0], B[0]));
    const r = lerp(A[1], B[1], u) * baseSize;
    const az = (lerp(A[2], B[2], u) * Math.PI) / 180;
    const el = (lerp(A[3], B[3], u) * Math.PI) / 180;
    camera.position.set(r * Math.cos(el) * Math.sin(az), r * Math.sin(el), r * Math.cos(el) * Math.cos(az));
    camera.lookAt(0, 0, 0);
  }

  /* ---------- HUD beat swap ---------- */
  let curBeat = -1,
    swapT = 0;
  function updateHud(p: number) {
    const bi = p < 0.18 ? 0 : p < 0.46 ? 1 : p < 0.74 ? 2 : 3;
    if (bi !== curBeat) {
      const first = curBeat === -1;
      curBeat = bi;
      if (first) {
        idxEl.textContent = BEATS[bi][0];
        txtEl.textContent = BEATS[bi][1];
      } else {
        card.style.opacity = '0';
        clearTimeout(swapT);
        swapT = window.setTimeout(() => {
          idxEl.textContent = BEATS[bi][0];
          txtEl.textContent = BEATS[bi][1];
          card.style.opacity = '1';
        }, 240);
      }
    }
    hint.style.opacity = p > 0.015 ? '0' : '1';
  }

  updateGeom(0);
  updateCam(0);
  updateHud(0);

  return {
    baseSize,
    update(p: number) {
      const cp = clamp(p, 0, 1);
      updateGeom(cp);
      updateCam(cp);
      updateHud(cp);
      titleMat.opacity = smooth(phase(cp, 0.88, 0.99));
    },
    hold() {
      updateGeom(1);
    },
    setChrome(visible: boolean) {
      hud.style.display = visible ? '' : 'none';
      title.visible = visible;
    },
    dispose() {
      clearTimeout(swapT);
      hud.remove();
      scene.remove(mesh, lines, title, hemi, key, rim);
      geo.dispose();
      lgeo.dispose();
      paperMat.dispose();
      lineMat.dispose();
      titleTex.dispose();
      titleMat.dispose();
      persp.fov = prevFov;
      persp.updateProjectionMatrix();
    },
  };
}
