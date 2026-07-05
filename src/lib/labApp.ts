import * as THREE from 'three';
import { importSVG, type FoldPattern } from '../app/fold/svgImport';
import { importFOLD, exportFOLDText } from '../app/fold/foldFormat';
import { applyCuts } from '../app/fold/kirigami';
import { createSolver, DEFAULT_PARAMS, type Solver } from '../app/fold/solver';
import { MATERIALS, getMaterial, foldCapDeg, capFoldAngles } from '../app/fold/material';
import { analyzeFlatFoldability } from '../app/fold/foldability';
import { selfIntersectionCount } from '../app/fold/collision';
import { downloadSVG } from '../app/fold/svgExport';
import { buildPrintKit, assemblyPlan, auxeticCutSVG, auxeticCutLines, type PrintKitManifest } from '../app/fold/printKit';
import { buildGore } from '../app/fold/gore';
import { PATTERN_CASES } from '../app/fold/patternCatalog';
import { GENERATORS, generatePattern } from '../app/fold/patternGen';
import earcut from 'earcut';

/**
 * Simulator Lab (/lab) — rigid-origami "engine study" with two engines:
 *
 *  • BUILT-INS (Miura-ori, accordion, fan) run a fast, exact CLOSED-FORM
 *    kinematic solver — the design prototype's core (sim-engine.js), ported
 *    from React + CDN-Three to vanilla TS + npm Three.
 *  • CASES load the origamisimulator.org example crease patterns (crane, bird
 *    base, hypar, …) or an uploaded SVG/FOLD file, and fold them with the
 *    COMPLIANT spring-mass solver shared with /simulator (src/app/fold/).
 *
 * Either engine's current crease pattern exports to a printable, round-trippable
 * SVG (origamisimulator colour convention: red mountain, blue valley, black border).
 */

function clamp(x: number, a: number, b: number): number {
  return x < a ? a : x > b ? b : x;
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

const VAL: [number, number, number] = [0.23, 0.66, 0.92];
const MNT: [number, number, number] = [0.55, 0.6, 0.66];
const BRD: [number, number, number] = [0.38, 0.42, 0.47];

type Assign = 'V' | 'M' | 'B';
type PatternId = 'miura' | 'pleats' | 'fan' | 'auxetic' | 'gore';

interface Builder {
  nV: number;
  grid: Float32Array;
  faces: number[];
  pairs: number[];
  cols: [number, number, number][];
  extent: number;
  strainDen: number;
  update(fold: number, foldMax: number): void;
}

/* ---------- pattern builders (exact rigid kinematics) ---------- */

function buildMiura(n: number): Builder {
  const R = n,
    C = n,
    a = 1,
    b = 1.12,
    g = (63 * Math.PI) / 180;
  const nV = (R + 1) * (C + 1);
  const idx = (i: number, j: number) => i * (C + 1) + j;
  const grid = new Float32Array(nV * 3);
  const faces: number[] = [],
    pairs: number[] = [],
    cols: [number, number, number][] = [];
  let r: number, c: number, i: number, j: number;
  for (r = 0; r < R; r++)
    for (c = 0; c < C; c++) {
      const v00 = idx(r, c),
        v01 = v00 + 1,
        v10 = idx(r + 1, c),
        v11 = v10 + 1;
      faces.push(v00, v10, v11, v00, v11, v01);
    }
  const seg = (p: number, q: number, col: [number, number, number]) => {
    pairs.push(p, q);
    cols.push(col);
  };
  for (c = 1; c < C; c++) seg(idx(0, c), idx(R, c), c % 2 ? VAL : MNT);
  for (i = 1; i < R; i++) for (j = 0; j < C; j++) seg(idx(i, j), idx(i, j + 1), i % 2 === 0 ? VAL : MNT);
  seg(idx(0, 0), idx(R, 0), BRD);
  seg(idx(0, C), idx(R, C), BRD);
  for (j = 0; j < C; j++) {
    seg(idx(0, j), idx(0, j + 1), BRD);
    seg(idx(R, j), idx(R, j + 1), BRD);
  }
  return {
    nV,
    grid,
    faces,
    pairs,
    cols,
    extent: C * 1.05,
    strainDen: a * Math.sin(g) * 0.5,
    update(fold, foldMax) {
      const th = (fold * clamp(foldMax, 10, 88) * Math.PI) / 180;
      const st = Math.sin(th),
        ct = Math.cos(th),
        sg = Math.sin(g),
        tg = Math.tan(g);
      const dn = Math.sqrt(1 + ct * ct * tg * tg);
      const H = a * st * sg,
        S = (b * ct * tg) / dn,
        L = a * Math.sqrt(1 - st * st * sg * sg),
        V = b / dn;
      for (let ii = 0; ii <= R; ii++)
        for (let jj = 0; jj <= C; jj++) {
          const o = idx(ii, jj) * 3;
          grid[o] = (jj - C / 2) * S;
          grid[o + 1] = (ii % 2) * H - H / 2;
          grid[o + 2] = (ii - R / 2) * L + (jj % 2) * V - V / 2;
        }
    },
  };
}

function buildPleats(n: number): Builder {
  const w = 10 / n,
    Ly = 7;
  const nV = 2 * (n + 1);
  const idx = (row: number, j: number) => row * (n + 1) + j;
  const grid = new Float32Array(nV * 3);
  const faces: number[] = [],
    pairs: number[] = [],
    cols: [number, number, number][] = [];
  for (let c = 0; c < n; c++) {
    const v00 = idx(0, c),
      v01 = v00 + 1,
      v10 = idx(1, c),
      v11 = v10 + 1;
    faces.push(v00, v10, v11, v00, v11, v01);
  }
  const seg = (p: number, q: number, col: [number, number, number]) => {
    pairs.push(p, q);
    cols.push(col);
  };
  for (let j2 = 1; j2 < n; j2++) seg(idx(0, j2), idx(1, j2), j2 % 2 ? VAL : MNT);
  seg(idx(0, 0), idx(1, 0), BRD);
  seg(idx(0, n), idx(1, n), BRD);
  for (let j3 = 0; j3 < n; j3++) {
    seg(idx(0, j3), idx(0, j3 + 1), BRD);
    seg(idx(1, j3), idx(1, j3 + 1), BRD);
  }
  return {
    nV,
    grid,
    faces,
    pairs,
    cols,
    extent: 8.5,
    strainDen: w,
    update(fold, foldMax) {
      const ph = (fold * clamp(foldMax, 10, 88) * Math.PI) / 180;
      const cw = w * Math.cos(ph),
        h = w * Math.sin(ph);
      for (let row = 0; row < 2; row++)
        for (let j = 0; j <= n; j++) {
          const o = idx(row, j) * 3;
          grid[o] = (j - n / 2) * cw;
          grid[o + 1] = (j % 2) * h - h / 2;
          grid[o + 2] = row ? Ly / 2 : -Ly / 2;
        }
    },
  };
}

function buildFan(n: number): Builder {
  const R = 6,
    PHI = (150 * Math.PI) / 180,
    alpha = PHI / n;
  const nV = n + 2; /* apex + n+1 rim */
  const grid = new Float32Array(nV * 3);
  const faces: number[] = [],
    pairs: number[] = [],
    cols: [number, number, number][] = [];
  for (let k = 0; k < n; k++) faces.push(0, 1 + k, 2 + k);
  const seg = (p: number, q: number, col: [number, number, number]) => {
    pairs.push(p, q);
    cols.push(col);
  };
  for (let k2 = 1; k2 < n; k2++) seg(0, 1 + k2, k2 % 2 ? VAL : MNT);
  seg(0, 1, BRD);
  seg(0, 1 + n, BRD);
  for (let k3 = 0; k3 < n; k3++) seg(1 + k3, 2 + k3, BRD);
  return {
    nV,
    grid,
    faces,
    pairs,
    cols,
    extent: 7.5,
    strainDen: R * 0.35,
    update(fold, foldMax) {
      const thf = (fold * clamp(foldMax * 2, 20, 176) * Math.PI) / 180;
      const u = new THREE.Vector3(Math.cos(Math.PI / 2 + PHI / 2), 0, Math.sin(Math.PI / 2 + PHI / 2));
      const nrm = new THREE.Vector3(0, 1, 0);
      grid[0] = 0;
      grid[1] = 0;
      grid[2] = 0;
      grid[3] = u.x * R;
      grid[4] = u.y * R;
      grid[5] = u.z * R;
      const d = new THREE.Vector3(),
        tmp = new THREE.Vector3();
      for (let k = 1; k <= n; k++) {
        tmp.crossVectors(nrm, u);
        d.copy(u).multiplyScalar(Math.cos(alpha)).addScaledVector(tmp, Math.sin(alpha)).normalize();
        const o = (1 + k) * 3;
        grid[o] = d.x * R;
        grid[o + 1] = d.y * R;
        grid[o + 2] = d.z * R;
        if (k < n) nrm.applyAxisAngle(d, (k % 2 ? 1 : -1) * thf);
        u.copy(d);
      }
    },
  };
}

type AuxeticShape = 'square' | 'triangle';

/**
 * Rotating-units auxetic (Grima & Evans; the square/triangle families of
 * Rafsanjani's bistable auxetics — ontology bistable-auxetic-rafsanjani /
 * auxetic-perforated-cast). Rigid units counter-rotate ±θ about shared corners;
 * opening θ expands the lattice equally in both axes (ν≈−1). The slider ends are
 * the two states: closed (θ=0) ↔ open (deployed). In-plane mechanism (y=0).
 *   gap = ligament (hinge) fraction t/l — shrinks each unit so the flexure gap shows.
 */
function buildAuxetic(n: number, shape: AuxeticShape, gap: number): Builder {
  const a = 1;
  const shrink = 1 - clamp(gap, 0, 0.4);

  if (shape === 'triangle') {
    // twisted-kagome: up/down triangles counter-rotating (visualised deployment)
    const nT = n * n;
    const nV = nT * 3;
    const grid = new Float32Array(nV * 3);
    const faces: number[] = [],
      pairs: number[] = [],
      cols: [number, number, number][] = [];
    for (let s = 0; s < nT; s++) {
      const v0 = s * 3;
      faces.push(v0, v0 + 1, v0 + 2);
      pairs.push(v0, v0 + 1, v0 + 1, v0 + 2, v0 + 2, v0);
      cols.push(BRD, BRD, BRD);
    }
    const R = (a / Math.sqrt(3)) * shrink; // circumradius of the unit triangle
    return {
      nV,
      grid,
      faces,
      pairs,
      cols,
      extent: n * a * 1.3,
      strainDen: a,
      update(fold) {
        const th = (fold * 30 * Math.PI) / 180; // twist 0→30°
        const sx = a,
          sy = (a * Math.sqrt(3)) / 2;
        let idx = 0;
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++) {
            const up = (i + j) % 2 === 0;
            const sign = up ? 1 : -1;
            const cx = (i - (n - 1) / 2) * sx + (j % 2) * sx * 0.5;
            const cz = (j - (n - 1) / 2) * sy;
            const base = up ? Math.PI / 2 : -Math.PI / 2; // vertex up / down
            for (let k = 0; k < 3; k++) {
              const ang = base + (k * 2 * Math.PI) / 3 + sign * th;
              const o = (idx * 3 + k) * 3;
              grid[o] = cx + R * Math.cos(ang);
              grid[o + 1] = 0;
              grid[o + 2] = cz + R * Math.sin(ang);
            }
            idx++;
          }
      },
    };
  }

  // square (default) — rotating squares hinged at corners
  const nSq = n * n;
  const nV = nSq * 4;
  const grid = new Float32Array(nV * 3);
  const faces: number[] = [],
    pairs: number[] = [],
    cols: [number, number, number][] = [];
  for (let s = 0; s < nSq; s++) {
    const v0 = s * 4;
    faces.push(v0, v0 + 1, v0 + 2, v0, v0 + 2, v0 + 3);
    pairs.push(v0, v0 + 1, v0 + 1, v0 + 2, v0 + 2, v0 + 3, v0 + 3, v0);
    cols.push(BRD, BRD, BRD, BRD);
  }
  const h = (a / 2) * shrink;
  const corners: [number, number][] = [
    [-h, -h],
    [h, -h],
    [h, h],
    [-h, h],
  ];
  return {
    nV,
    grid,
    faces,
    pairs,
    cols,
    extent: n * a * 1.45,
    strainDen: a,
    update(fold) {
      const th = (fold * 45 * Math.PI) / 180; // deploy 0→45°
      const p = a * (Math.cos(th) + Math.sin(th)); // hinge-preserving lattice spacing
      let idx = 0;
      for (let i = 0; i < n; i++)
        for (let j = 0; j < n; j++) {
          const sign = (i + j) % 2 === 0 ? 1 : -1;
          const cx = (i - (n - 1) / 2) * p;
          const cz = (j - (n - 1) / 2) * p;
          const ct = Math.cos(sign * th),
            st = Math.sin(sign * th);
          for (let k = 0; k < 4; k++) {
            const lx = corners[k][0],
              lz = corners[k][1];
            const o = (idx * 4 + k) * 3;
            grid[o] = cx + (lx * ct - lz * st);
            grid[o + 1] = 0;
            grid[o + 2] = cz + (lx * st + lz * ct);
          }
          idx++;
        }
    },
  };
}

const BUILDERS: Record<'miura' | 'pleats' | 'fan', (n: number) => Builder> = {
  miura: buildMiura,
  pleats: buildPleats,
  fan: buildFan,
};

/* ---------- crease-pattern minimap / export (flat 2D lines with assignment) ---------- */
interface CPLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  a: Assign;
}
function cpLines(pattern: PatternId, n: number): CPLine[] {
  const L: CPLine[] = [];
  const push = (x1: number, y1: number, x2: number, y2: number, a: Assign) =>
    L.push({ x1: +x1.toFixed(1), y1: +y1.toFixed(1), x2: +x2.toFixed(1), y2: +y2.toFixed(1), a });
  let i: number, j: number, k: number;
  if (pattern === 'pleats') {
    const W = 100,
      H = 58,
      ox = 6,
      oy = 8,
      w = W / n;
    for (j = 1; j < n; j++) push(ox + j * w, oy, ox + j * w, oy + H, j % 2 ? 'V' : 'M');
    push(ox, oy, ox + W, oy, 'B');
    push(ox, oy + H, ox + W, oy + H, 'B');
    push(ox, oy, ox, oy + H, 'B');
    push(ox + W, oy, ox + W, oy + H, 'B');
  } else if (pattern === 'fan') {
    const ax = 56,
      ay = 68,
      Rr = 52;
    const pt = (k2: number): [number, number] => {
      const t = ((15 + (k2 * 150) / n) * Math.PI) / 180;
      return [ax + Rr * Math.cos(Math.PI - t), ay - Rr * Math.sin(t)];
    };
    for (k = 0; k <= n; k++) {
      const p = pt(k);
      push(ax, ay, p[0], p[1], k === 0 || k === n ? 'B' : k % 2 ? 'V' : 'M');
      if (k < n) {
        const q = pt(k + 1);
        push(p[0], p[1], q[0], q[1], 'B');
      }
    }
  } else if (pattern === 'auxetic') {
    const N = Math.min(n, 8),
      th = (25 * Math.PI) / 180,
      half = 0.5,
      p = Math.cos(th) + Math.sin(th);
    const sc = Math.min(100 / (N * p), 60 / (N * p));
    const ox = (112 - N * p * sc) / 2,
      oy = (74 - N * p * sc) / 2;
    const corn: [number, number][] = [[-half, -half], [half, -half], [half, half], [-half, half]];
    for (i = 0; i < N; i++)
      for (j = 0; j < N; j++) {
        const sign = (i + j) % 2 === 0 ? 1 : -1;
        const ct = Math.cos(sign * th),
          st = Math.sin(sign * th);
        const cx = ox + (i + 0.5) * p * sc,
          cy = oy + (j + 0.5) * p * sc;
        const pts = corn.map(([lx, lz]) => [cx + (lx * ct - lz * st) * sc, cy + (lx * st + lz * ct) * sc]);
        for (k = 0; k < 4; k++) {
          const A = pts[k],
            Bp = pts[(k + 1) % 4];
          push(A[0], A[1], Bp[0], Bp[1], 'B');
        }
      }
  } else {
    const b = 1.12,
      g = (63 * Math.PI) / 180;
    const S = b * Math.sin(g),
      Lr = 1,
      Vv = b * Math.cos(g);
    const Wm = n * S,
      Hm = n * Lr + Vv;
    const sc = Math.min(100 / Wm, 60 / Hm);
    const ox2 = (112 - Wm * sc) / 2,
      oy2 = (74 - Hm * sc) / 2;
    const X = (jj: number) => ox2 + jj * S * sc;
    const Y = (ii: number, jj: number) => oy2 + (ii * Lr + (jj % 2) * Vv) * sc;
    for (j = 1; j < n; j++) push(X(j), Y(0, j), X(j), Y(n, j), j % 2 ? 'V' : 'M');
    for (i = 1; i < n; i++) for (j = 0; j < n; j++) push(X(j), Y(i, j), X(j + 1), Y(i, j + 1), i % 2 === 0 ? 'V' : 'M');
    push(X(0), Y(0, 0), X(0), Y(n, 0), 'B');
    push(X(n), Y(0, n), X(n), Y(n, n), 'B');
    for (j = 0; j < n; j++) {
      push(X(j), Y(0, j), X(j + 1), Y(0, j + 1), 'B');
      push(X(j), Y(n, j), X(j + 1), Y(n, j + 1), 'B');
    }
  }
  return L;
}

const CP_DISPLAY: Record<Assign, string> = { V: '#3aa9e6', M: '#7c8794', B: '#4a525d' };
const CP_EXPORT: Record<Assign, string> = { V: '#0000ff', M: '#ff0000', B: '#000000' };

/** Printable, origamisimulator-compatible SVG of a built-in crease pattern. */
function builtinSVG(pattern: PatternId, n: number): string {
  const lines = cpLines(pattern, n);
  const lineStr = (l: { x1: number; y1: number; x2: number; y2: number; a: string }) => {
    const op = l.a === 'M' || l.a === 'V' ? ' opacity="1.000"' : '';
    return `    <line x1="${l.x1}" y1="${l.y1}" x2="${l.x2}" y2="${l.y2}" stroke="${CP_EXPORT[l.a]}"${op}/>`;
  };
  const isCut = (a: string) => a === 'B' || a === 'C';
  const cut = lines.filter((l) => isCut(l.a)).map(lineStr);
  const score = lines.filter((l) => !isCut(l.a)).map(lineStr);
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="112mm" height="74mm" viewBox="0 0 112 74" stroke-width="0.4" fill="none" stroke-linecap="round">',
    '  <title>Crease pattern</title>',
    '  <desc>origamisimulator convention: #ff0000=mountain, #0000ff=valley, #000000=border; line opacity = fold angle (1.0=180deg). Laser: layer "cut" = cut-through, layer "score" = fold/score. Scale: 1 unit = 1 mm.</desc>',
    '  <g id="cut" data-laser="cut">',
    ...cut,
    '  </g>',
    '  <g id="score" data-laser="score">',
    ...score,
    '  </g>',
    '</svg>',
    '',
  ].join('\n');
}

function statsFor(pattern: PatternId, n: number): { faces: number; creases: number; verts: number } {
  if (pattern === 'miura') return { faces: n * n, creases: (n - 1) * n + (n - 1), verts: (n + 1) * (n + 1) };
  if (pattern === 'pleats') return { faces: n, creases: n - 1, verts: 2 * (n + 1) };
  if (pattern === 'auxetic') return { faces: n * n, creases: 2 * n * (n - 1), verts: n * n * 4 };
  return { faces: n, creases: n - 1, verts: n + 2 };
}

interface BuiltinParams {
  pattern: PatternId;
  fold: number;
  playing: boolean;
  strain: boolean;
  edges: boolean;
  autoOrbit: boolean;
  density: number;
  foldMax: number;
  paperTone: string;
  onFold: ((f: number) => void) | null;
  auxeticShape: AuxeticShape;
  hingeGap: number; // ligament fraction t/l
  auxTilt: number; // cut tilt θ (deg) — the bistable chirality
  goreN: number; // gores (petals)
  goreM: number; // latitude rings
  goreAspect: number; // polar/equatorial (oval shape)
}

/* solver-loaded case */
const LINE_COLORS: Record<string, number> = { M: 0xd9544d, V: 0x4d7fd9, B: 0x555555 };
interface Loaded {
  pattern: FoldPattern;
  solver: Solver;
  group: THREE.Group;
  geometry: THREE.BufferGeometry;
  name: string;
  text: string;
  foldability: { flatFoldable: boolean; interior: number; violations: number; penetrates: boolean; physChecked: boolean };
}

interface App {
  setParams(next: Partial<BuiltinParams>): void;
  setBuiltin(id: PatternId): void;
  setAuxetic(cfg: { shape?: AuxeticShape; gap?: number }): void;
  setGore(cfg: { gores?: number; rings?: number; aspect?: number }): void;
  loadCase(text: string, name: string): { ok: boolean; msg: string };
  setMaterial(id: string): { ok: boolean; msg: string };
  exportSVG(): void;
  exportPrintKit(thickness: number, hingeType: 'living' | 'pin'): PrintKitManifest | { error: string };
  setAssembly(on: boolean): { parts: number; steps: number } | null;
  replayAssembly(): void;
  dispose(): void;
}

/* ---------- three.js app: one scene, two engines ---------- */
function createApp(mount: HTMLElement, P0: BuiltinParams): App {
  let P = Object.assign({}, P0);
  let mode: 'builtin' | 'solver' = 'builtin';

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.domElement.style.cssText = 'position:absolute;inset:0;display:block;cursor:grab;';
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b0c0f);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
  scene.add(new THREE.HemisphereLight(0x8f9baa, 0x14161c, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.5);
  key.position.set(6, 10, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x30a7e1, 0.5);
  rim.position.set(-8, 3, -6);
  scene.add(rim);

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.84,
    metalness: 0.02,
    flatShading: true,
    side: THREE.DoubleSide,
  });
  const lmat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.9 });

  /* built-in engine state */
  let B: Builder = buildMiura(P.density);
  let geo = new THREE.BufferGeometry();
  let lgeo = new THREE.BufferGeometry();
  let mesh: THREE.Mesh | null = null;
  let lines: THREE.LineSegments | null = null;
  let posArr: Float32Array,
    colArr: Float32Array,
    posAttr: THREE.BufferAttribute,
    colAttr: THREE.BufferAttribute,
    lineArr: Float32Array,
    lineAttr: THREE.BufferAttribute;

  /* solver engine state */
  let loaded: Loaded | null = null;
  let materialId = 'paper';
  // Oval(fold): map the N/rings/aspect sliders onto a real Yoshimura-barrel crease pattern
  const ovalPattern = () =>
    generatePattern('yoshimura', { n: P.goreN, m: P.goreM, taper: Math.max(0, Math.min(0.8, (P.goreAspect - 0.6) * 0.5)), angle: 0.7 });

  let radius = 20,
    curExtent = B.extent,
    tAz = -0.55,
    tEl = 0.5,
    az = -0.55,
    el = 0.5;

  function disposeSolver() {
    if (!loaded) return;
    scene.remove(loaded.group);
    loaded.group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mm = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mm)) mm.forEach((x) => x.dispose());
      else mm?.dispose?.();
    });
    loaded = null;
  }

  function disposeBuiltin() {
    if (mesh) {
      scene.remove(mesh);
      scene.remove(lines!);
      geo.dispose();
      lgeo.dispose();
      mesh = null;
      lines = null;
    }
  }

  function rebuildBuiltin() {
    disposeBuiltin();
    B =
      P.pattern === 'auxetic'
        ? buildAuxetic(P.density, P.auxeticShape, P.hingeGap)
        : P.pattern === 'gore'
          ? buildGore(P.goreN, P.goreM, P.goreAspect)
          : (BUILDERS[P.pattern as 'miura' | 'pleats' | 'fan'] || buildMiura)(P.density);
    curExtent = B.extent;
    const F = B.faces.length / 3,
      L = B.pairs.length / 2;
    posArr = new Float32Array(F * 9);
    colArr = new Float32Array(F * 9);
    lineArr = new Float32Array(L * 6);
    const lcolArr = new Float32Array(L * 6);
    for (let s = 0; s < L; s++)
      for (let v = 0; v < 2; v++) for (let q = 0; q < 3; q++) lcolArr[s * 6 + v * 3 + q] = B.cols[s][q];
    geo = new THREE.BufferGeometry();
    posAttr = new THREE.BufferAttribute(posArr, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    colAttr = new THREE.BufferAttribute(colArr, 3);
    colAttr.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', posAttr);
    geo.setAttribute('color', colAttr);
    lgeo = new THREE.BufferGeometry();
    lineAttr = new THREE.BufferAttribute(lineArr, 3);
    lineAttr.setUsage(THREE.DynamicDrawUsage);
    lgeo.setAttribute('position', lineAttr);
    lgeo.setAttribute('color', new THREE.BufferAttribute(lcolArr, 3));
    mesh = new THREE.Mesh(geo, mat);
    lines = new THREE.LineSegments(lgeo, lmat);
    mesh.frustumCulled = false;
    lines.frustumCulled = false;
    scene.add(mesh);
    scene.add(lines);
    radius = 2.15 * B.extent;
    scene.fog = new THREE.Fog(0x0b0c0f, radius * 1.6, radius * 3.4);
  }
  rebuildBuiltin();

  /* orbit */
  let dragging = false,
    px = 0,
    py = 0;
  const el0 = renderer.domElement;
  el0.addEventListener('pointerdown', (e) => {
    dragging = true;
    px = e.clientX;
    py = e.clientY;
    el0.setPointerCapture(e.pointerId);
    el0.style.cursor = 'grabbing';
  });
  el0.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    tAz -= (e.clientX - px) * 0.006;
    tEl = clamp(tEl + (e.clientY - py) * 0.005, 0.05, 1.45);
    px = e.clientX;
    py = e.clientY;
  });
  el0.addEventListener('pointerup', () => {
    dragging = false;
    el0.style.cursor = 'grab';
  });
  el0.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      radius = clamp(radius * (1 + e.deltaY * 0.0012), curExtent * 1.2, curExtent * 4.2);
    },
    { passive: false }
  );

  const ro = new ResizeObserver(() => {
    const w = mount.clientWidth || 1,
      h = mount.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
  ro.observe(mount);

  let foldCur = P.fold,
    ph = 0,
    wasPlaying = false,
    fc = 0,
    dead = false,
    raf = 0;
  const clock = { t: performance.now() };
  const cen = [0, 0, 0];

  function stepBuiltin(dt: number) {
    if (P.playing) {
      if (!wasPlaying) ph = Math.acos(clamp(1 - 2 * foldCur, -1, 1));
      ph += dt * 0.7;
      foldCur = 0.5 - 0.5 * Math.cos(ph);
      if (fc++ % 4 === 0 && P.onFold) P.onFold(Math.round(foldCur * 100) / 100);
    } else {
      foldCur += (P.fold - foldCur) * 0.14;
    }
    wasPlaying = P.playing;

    B.update(foldCur, P.foldMax);
    const g = B.grid,
      nV = B.nV;
    let q: number;
    cen[0] = 0;
    cen[1] = 0;
    cen[2] = 0;
    for (let v = 0; v < nV; v++) for (q = 0; q < 3; q++) cen[q] += g[v * 3 + q] / nV;
    const tone = new THREE.Color(P.strain ? '#ffffff' : P.paperTone || '#f2f3f5');
    const den = B.strainDen;
    const fa = B.faces;
    for (let f = 0; f < fa.length; f++) {
      const vi = fa[f] * 3,
        o = f * 3;
      const y = g[vi + 1] - cen[1];
      posArr[o] = g[vi] - cen[0];
      posArr[o + 1] = y;
      posArr[o + 2] = g[vi + 2] - cen[2];
      if (P.strain) {
        const t = clamp(Math.abs(y) / den, 0, 1);
        colArr[o] = lerp(0.16, 0.96, t);
        colArr[o + 1] = lerp(0.58, 0.34, t);
        colArr[o + 2] = lerp(0.95, 0.28, t);
      } else {
        colArr[o] = tone.r;
        colArr[o + 1] = tone.g;
        colArr[o + 2] = tone.b;
      }
    }
    const pr = B.pairs;
    for (let s = 0; s < pr.length; s++) {
      const vj = pr[s] * 3,
        o2 = s * 3;
      lineArr[o2] = g[vj] - cen[0];
      lineArr[o2 + 1] = g[vj + 1] - cen[1];
      lineArr[o2 + 2] = g[vj + 2] - cen[2];
    }
    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    lineAttr.needsUpdate = true;
    geo.computeVertexNormals();
    lines!.visible = !!P.edges;
  }

  function stepSolver() {
    if (!loaded) return;
    // fewer substeps on big meshes keeps the framerate up (it just converges over
    // more frames); the huge kirigami/tessellation cases would otherwise stall.
    const n = Math.max(6, Math.min(50, Math.floor(30000 / loaded.solver.vertexCount)));
    loaded.solver.step(n);
    loaded.geometry.attributes.position.needsUpdate = true;
    loaded.geometry.computeVertexNormals();
    loaded.group.traverse((o) => {
      if ((o as THREE.LineSegments).isLineSegments) o.visible = !!P.edges;
    });
  }

  /* ---------- assembly map: parts tray ↔ assembled model (colour+number), hinges shown, fold-animated ---------- */
  const asmRay = new THREE.Raycaster();
  const asmPtr = new THREE.Vector2();
  const MV_COL: Record<string, [number, number, number]> = { M: [0.9, 0.32, 0.26], V: [0.28, 0.55, 0.95] };
  interface AsmTray {
    mesh: THREE.Mesh;
    base: THREE.Color;
  }
  interface Asm {
    group: THREE.Group;
    solver: Solver;
    faces: [number, number, number][];
    facePart: Int32Array;
    positions: Float32Array;
    posAttr: THREE.BufferAttribute;
    geo: THREE.BufferGeometry;
    foldedMesh: THREE.Mesh;
    loops: number[][];
    colors: [number, number, number][];
    hingePairs: [number, number][];
    hingeArr: Float32Array;
    hingeAttr: THREE.BufferAttribute;
    tray: AsmTray[];
    neighbors: number[][];
    pickables: THREE.Object3D[];
    hoverSprite: THREE.Sprite;
    hovered: number;
    animStart: number;
    dur: number;
    target: number;
    onMove: (e: PointerEvent) => void;
  }
  let asm: Asm | null = null;

  function paintNumber(sprite: THREE.Sprite, num: number, color: [number, number, number]) {
    const cv = document.createElement('canvas');
    cv.width = cv.height = 72;
    const g = cv.getContext('2d')!;
    g.fillStyle = 'rgba(12,14,20,0.8)';
    g.beginPath();
    g.arc(36, 36, 32, 0, Math.PI * 2);
    g.fill();
    g.strokeStyle = `rgb(${(color[0] * 255) | 0},${(color[1] * 255) | 0},${(color[2] * 255) | 0})`;
    g.lineWidth = 7;
    g.stroke();
    g.fillStyle = '#f2f3f5';
    g.font = 'bold 42px Inter, system-ui, sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(String(num), 36, 40);
    const mat = sprite.material as THREE.SpriteMaterial;
    mat.map?.dispose?.();
    mat.map = new THREE.CanvasTexture(cv);
    mat.needsUpdate = true;
  }
  function numberSprite(num: number, color: [number, number, number]): THREE.Sprite {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ depthTest: false, transparent: true }));
    paintNumber(s, num, color);
    return s;
  }

  function restoreNormalVisibility() {
    if (mesh) mesh.visible = true;
    if (lines) lines.visible = !!P.edges;
    if (loaded) loaded.group.visible = true;
  }
  function clearAssembly() {
    if (!asm) return;
    renderer.domElement.removeEventListener('pointermove', asm.onMove);
    scene.remove(asm.group);
    asm.group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mm = m.material as (THREE.Material & { map?: THREE.Texture }) | undefined;
      mm?.map?.dispose?.();
      mm?.dispose?.();
    });
    asm = null;
    restoreNormalVisibility();
  }
  function currentPattern(): FoldPattern | null {
    try {
      return mode === 'solver' && loaded ? loaded.pattern : importSVG(builtinSVG(P.pattern, P.density));
    } catch {
      return null;
    }
  }

  function buildAssembly(): { parts: number; steps: number } | null {
    clearAssembly();
    const pat = currentPattern();
    if (!pat) return null;
    const plan = assemblyPlan(pat);
    if (!plan.parts.length) return null;
    const group = new THREE.Group();

    const facePart = new Int32Array(pat.faces.length).fill(0);
    plan.parts.forEach((p) => p.faces.forEach((fi) => (facePart[fi] = p.id)));
    const F = pat.faces.length;
    const positions = new Float32Array(F * 9);
    const colArr = new Float32Array(F * 9);
    pat.faces.forEach((_, fi) => {
      const c = plan.parts[facePart[fi]].color;
      for (let k = 0; k < 3; k++) {
        const o = (fi * 3 + k) * 3;
        colArr[o] = c[0];
        colArr[o + 1] = c[1];
        colArr[o + 2] = c[2];
      }
    });
    const fgeo = new THREE.BufferGeometry();
    const posAttr = new THREE.BufferAttribute(positions, 3);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    fgeo.setAttribute('position', posAttr);
    fgeo.setAttribute('color', new THREE.BufferAttribute(colArr, 3));
    const foldedMesh = new THREE.Mesh(
      fgeo,
      new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.72, metalness: 0.02, side: THREE.DoubleSide, flatShading: true })
    );
    foldedMesh.frustumCulled = false;
    group.add(foldedMesh);

    // hinge seams on the model — the connections (red = mountain, blue = valley)
    const H = plan.hinges.length;
    const hingePairs: [number, number][] = plan.hinges.map((h) => [h.v1, h.v2]);
    const hingeArr = new Float32Array(H * 6);
    const hingeCol = new Float32Array(H * 6);
    plan.hinges.forEach((h, i) => {
      const c = MV_COL[h.mv];
      for (let e = 0; e < 2; e++) for (let k = 0; k < 3; k++) hingeCol[i * 6 + e * 3 + k] = c[k];
    });
    const hgeo = new THREE.BufferGeometry();
    const hingeAttr = new THREE.BufferAttribute(hingeArr, 3);
    hingeAttr.setUsage(THREE.DynamicDrawUsage);
    hgeo.setAttribute('position', hingeAttr);
    hgeo.setAttribute('color', new THREE.BufferAttribute(hingeCol, 3));
    const hingeLines = new THREE.LineSegments(hgeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.95 }));
    hingeLines.frustumCulled = false;
    group.add(hingeLines);

    const asmSolver = createSolver({ vertices: pat.vertices, faces: pat.faces, edges: pat.edges }, { ...DEFAULT_PARAMS });

    // what connects to what
    const neighbors: number[][] = plan.parts.map(() => []);
    plan.hinges.forEach((h) => {
      if (!neighbors[h.partA].includes(h.partB)) neighbors[h.partA].push(h.partB);
      if (!neighbors[h.partB].includes(h.partA)) neighbors[h.partB].push(h.partA);
    });

    // parts tray: flat panels arrayed below, same colour + always-on number
    const cols = Math.ceil(Math.sqrt(plan.parts.length));
    const cell = 2.6 / cols;
    const tray: AsmTray[] = [];
    plan.parts.forEach((p, i) => {
      const gx = ((i % cols) - (cols - 1) / 2) * cell * 1.25;
      const gy = -2.1 - Math.floor(i / cols) * cell * 1.25;
      const flat: number[] = [];
      p.loop.forEach((v) => flat.push(pat.vertices[v][0] - p.centroid[0], pat.vertices[v][1] - p.centroid[1]));
      let mx = 0;
      for (let k = 0; k < flat.length; k += 2) mx = Math.max(mx, Math.hypot(flat[k], flat[k + 1]));
      const sc = mx > 0 ? (cell * 0.5) / mx : 1;
      const idx = earcut(flat);
      const tpos: number[] = [];
      for (const ii of idx) tpos.push(flat[ii * 2] * sc + gx, flat[ii * 2 + 1] * sc + gy, 0);
      const tgeo = new THREE.BufferGeometry();
      tgeo.setAttribute('position', new THREE.Float32BufferAttribute(tpos, 3));
      const base = new THREE.Color(p.color[0], p.color[1], p.color[2]);
      const tmesh = new THREE.Mesh(tgeo, new THREE.MeshBasicMaterial({ color: base.clone(), side: THREE.DoubleSide }));
      tmesh.userData.part = i;
      group.add(tmesh);
      tray.push({ mesh: tmesh, base });
      const ts = numberSprite(i + 1, p.color);
      ts.position.set(gx, gy, 0.1);
      ts.scale.set(cell * 0.55, cell * 0.55, 1);
      group.add(ts);
    });

    const hoverSprite = numberSprite(1, [1, 1, 1]);
    hoverSprite.scale.set(0.5, 0.5, 1);
    hoverSprite.visible = false;
    group.add(hoverSprite);

    scene.add(group);
    if (mesh) mesh.visible = false;
    if (lines) lines.visible = false;
    if (loaded) loaded.group.visible = false;

    const onMove = (e: PointerEvent) => {
      if (!asm) return;
      const r = renderer.domElement.getBoundingClientRect();
      asmPtr.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      asmPtr.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      asmRay.setFromCamera(asmPtr, camera);
      const hits = asmRay.intersectObjects(asm.pickables, false);
      let part = -1;
      for (const h of hits) {
        if (h.object === asm.foldedMesh) {
          part = h.faceIndex != null ? asm.facePart[h.faceIndex] : -1;
          break;
        }
        const u = (h.object as THREE.Object3D).userData;
        if (u && u.part !== undefined) {
          part = u.part;
          break;
        }
      }
      if (part === asm.hovered) return;
      if (asm.hovered >= 0)
        for (const q of [asm.hovered, ...asm.neighbors[asm.hovered]]) {
          const tm = asm.tray[q];
          if (tm) (tm.mesh.material as THREE.MeshBasicMaterial).color.copy(tm.base);
        }
      asm.hovered = part;
      if (part < 0) {
        asm.hoverSprite.visible = false;
        return;
      }
      paintNumber(asm.hoverSprite, part + 1, asm.colors[part]);
      asm.hoverSprite.visible = true;
      const tm = asm.tray[part];
      if (tm) (tm.mesh.material as THREE.MeshBasicMaterial).color.setRGB(1, 1, 1); // this part
      for (const q of asm.neighbors[part]) {
        const nm = asm.tray[q];
        if (nm) (nm.mesh.material as THREE.MeshBasicMaterial).color.copy(nm.base).lerp(new THREE.Color(1, 1, 1), 0.5); // its connections
      }
    };
    renderer.domElement.addEventListener('pointermove', onMove);

    asm = {
      group,
      solver: asmSolver,
      faces: pat.faces,
      facePart,
      positions,
      posAttr,
      geo: fgeo,
      foldedMesh,
      loops: plan.parts.map((p) => p.loop),
      colors: plan.parts.map((p) => p.color),
      hingePairs,
      hingeArr,
      hingeAttr,
      tray,
      neighbors,
      pickables: [foldedMesh, ...tray.map((t) => t.mesh)],
      hoverSprite,
      hovered: -1,
      animStart: performance.now(),
      dur: 3200,
      target: 0.82,
      onMove,
    };
    radius = 7;
    return { parts: plan.parts.length, steps: plan.sequence.length };
  }

  function replayAssembly() {
    if (asm) asm.animStart = performance.now();
  }
  function easeInOut(u: number): number {
    return u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;
  }

  function stepAssembly(now: number) {
    if (!asm) return;
    const frac = Math.min(1, (now - asm.animStart) / asm.dur); // flat → assembled
    asm.solver.setFoldPercent(easeInOut(frac) * asm.target);
    const n = Math.max(6, Math.min(50, Math.floor(30000 / asm.solver.vertexCount)));
    asm.solver.step(n);
    const sp = asm.solver.positions;
    for (let fi = 0; fi < asm.faces.length; fi++) {
      const f = asm.faces[fi];
      for (let k = 0; k < 3; k++) {
        const o = (fi * 3 + k) * 3,
          vi = f[k] * 3;
        asm.positions[o] = sp[vi];
        asm.positions[o + 1] = sp[vi + 1];
        asm.positions[o + 2] = sp[vi + 2];
      }
    }
    asm.posAttr.needsUpdate = true;
    asm.geo.computeVertexNormals();
    for (let i = 0; i < asm.hingePairs.length; i++) {
      const [a, b] = asm.hingePairs[i];
      asm.hingeArr[i * 6] = sp[a * 3];
      asm.hingeArr[i * 6 + 1] = sp[a * 3 + 1];
      asm.hingeArr[i * 6 + 2] = sp[a * 3 + 2];
      asm.hingeArr[i * 6 + 3] = sp[b * 3];
      asm.hingeArr[i * 6 + 4] = sp[b * 3 + 1];
      asm.hingeArr[i * 6 + 5] = sp[b * 3 + 2];
    }
    asm.hingeAttr.needsUpdate = true;
    if (asm.hovered >= 0) {
      const loop = asm.loops[asm.hovered];
      let x = 0,
        y = 0,
        z = 0;
      for (const v of loop) {
        x += sp[v * 3];
        y += sp[v * 3 + 1];
        z += sp[v * 3 + 2];
      }
      const c = loop.length || 1;
      asm.hoverSprite.position.set(x / c, y / c + 0.1, z / c);
    }
  }

  function tick() {
    if (dead) return;
    const now = performance.now(),
      dt = Math.min(0.05, (now - clock.t) / 1000);
    clock.t = now;
    if (asm) stepAssembly(now);
    else if (mode === 'builtin') stepBuiltin(dt);
    else stepSolver();
    // auto-orbit built-ins and the assembly view; solver cases sit still to settle.
    if (P.autoOrbit && !dragging && (mode === 'builtin' || asm)) tAz += dt * 0.1;
    az += (tAz - az) * 0.08;
    el += (tEl - el) * 0.08;
    const ty = asm ? -1.2 : 0; // frame model + tray below it
    camera.position.set(radius * Math.cos(el) * Math.sin(az), radius * Math.sin(el) + ty, radius * Math.cos(el) * Math.cos(az));
    camera.lookAt(0, ty, 0);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  }
  tick();

  return {
    setParams(next: Partial<BuiltinParams>) {
      const reDensity = next.density !== undefined && next.density !== P.density;
      P = Object.assign(P, next);
      if (mode === 'builtin' && reDensity) rebuildBuiltin();
      if (mode === 'solver' && loaded && next.fold !== undefined)
        loaded.solver.setFoldPercent(clamp(P.fold, 0, 1));
    },
    setBuiltin(id: PatternId) {
      if (id === 'gore') {
        // Oval(fold) is a REAL fold now: generate a Yoshimura barrel, fold it in the solver
        P.pattern = 'gore';
        this.loadCase(ovalPattern(), 'oval-fold.svg');
        return;
      }
      disposeSolver();
      mode = 'builtin';
      P.pattern = id;
      foldCur = P.fold;
      rebuildBuiltin();
      radius = 2.15 * B.extent;
      if (asm) buildAssembly();
    },
    setAuxetic(cfg: { shape?: AuxeticShape; gap?: number }) {
      if (cfg.shape !== undefined) P.auxeticShape = cfg.shape;
      if (cfg.gap !== undefined) P.hingeGap = cfg.gap;
      if (mode === 'builtin' && P.pattern === 'auxetic') {
        rebuildBuiltin();
        radius = 2.15 * B.extent;
        if (asm) buildAssembly();
      }
    },
    setGore(cfg: { gores?: number; rings?: number; aspect?: number }) {
      if (cfg.gores !== undefined) P.goreN = cfg.gores;
      if (cfg.rings !== undefined) P.goreM = cfg.rings;
      if (cfg.aspect !== undefined) P.goreAspect = cfg.aspect;
      if (P.pattern === 'gore') {
        this.loadCase(ovalPattern(), 'oval-fold.svg'); // re-fold the barrel with new params
      }
    },
    loadCase(text: string, name: string) {
      let pattern: FoldPattern;
      try {
        pattern = /\.fold$/i.test(name) ? importFOLD(text) : importSVG(text);
        pattern = applyCuts(pattern); // kirigami: tear the sheet along cut edges
      } catch (e) {
        return { ok: false, msg: `import failed: ${(e as Error).message}` };
      }
      disposeBuiltin();
      disposeSolver();
      mode = 'solver';

      // material/thickness: thick stock can't crease flat (cap) and folds stiffer
      const mtl = getMaterial(materialId);
      pattern = capFoldAngles(pattern, foldCapDeg(mtl.thickness));
      const solver = createSolver(
        { vertices: pattern.vertices, faces: pattern.faces, edges: pattern.edges },
        { ...mtl.solver }
      );
      solver.setFoldPercent(clamp(P.fold, 0, 1));

      const posAttrS = new THREE.BufferAttribute(solver.positions, 3);
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', posAttrS);
      geometry.setIndex(pattern.faces.flat());
      geometry.computeVertexNormals();
      const group = new THREE.Group();
      group.add(
        new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: new THREE.Color(mtl.color), roughness: 0.9, side: THREE.FrontSide })),
        new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: new THREE.Color(mtl.color).multiplyScalar(0.7), roughness: 0.9, side: THREE.BackSide }))
      );
      for (const [kind, color] of Object.entries(LINE_COLORS)) {
        const idx = pattern.edges.filter((e) => e.assignment === kind).flatMap((e) => [e.v1, e.v2]);
        if (!idx.length) continue;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', posAttrS);
        g.setIndex(idx);
        group.add(
          new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color, transparent: true, opacity: kind === 'B' ? 0.5 : 0.85 }))
        );
      }
      scene.add(group);
      const fold = analyzeFlatFoldability(pattern);
      // physical validity: fold to mid-fold, check panel self-penetration, reset to flat
      let penetrates = false;
      const physChecked = pattern.faces.length <= 1500; // O(faces²) — skip very large patterns
      if (physChecked) {
        solver.setFoldPercent(0.7);
        solver.step(400);
        penetrates = selfIntersectionCount(solver.positions, pattern.faces) > 0;
        solver.reset();
      }
      loaded = {
        pattern,
        solver,
        group,
        geometry,
        name,
        text,
        foldability: { flatFoldable: fold.flatFoldable, interior: fold.interior, violations: fold.vertices.filter((v) => !v.maekawaOk || !v.kawasakiOk).length, penetrates, physChecked },
      };
      // frame to fit the pattern (centered, normalized), so every case reads well
      const pos = solver.positions,
        nv = solver.vertexCount;
      let mr = 0;
      for (let i = 0; i < nv; i++) mr = Math.max(mr, Math.hypot(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]));
      curExtent = mr || 2;
      radius = (curExtent / Math.tan((38 * Math.PI) / 180 / 2)) * 1.2;
      tAz = -0.6;
      tEl = 0.6;
      scene.fog = new THREE.Fog(0x0b0c0f, radius * 1.6, radius * 4);
      const warn = pattern.warnings.length ? ` — ${pattern.warnings.join('; ')}` : '';
      if (asm) buildAssembly();
      return { ok: true, msg: `${name}: ${pattern.vertices.length} verts, ${pattern.faces.length} tris${warn}` };
    },
    setMaterial(id: string) {
      materialId = id;
      if (mode === 'solver' && loaded) return this.loadCase(loaded.text, loaded.name); // re-fold with new stock
      return { ok: true, msg: `${getMaterial(id).label} (loads on next pattern)` };
    },
    exportSVG() {
      if (mode === 'solver' && loaded) {
        downloadSVG(loaded.pattern, `${loaded.name.replace(/\.(svg|fold)$/i, '')}-print`);
      } else {
        const svg = builtinSVG(P.pattern, P.density);
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${P.pattern}-crease-pattern.svg`;
        a.click();
        URL.revokeObjectURL(url);
      }
    },
    exportPrintKit(thickness: number, hingeType: 'living' | 'pin') {
      // FoldPattern for the current pattern: solver cases carry one; built-ins
      // are routed through their generated crease-pattern SVG so the panelizer
      // sees real faces/edges.
      let pat: FoldPattern, nm: string;
      try {
        if (mode === 'solver' && loaded) {
          pat = loaded.pattern;
          nm = loaded.name.replace(/\.(svg|fold)$/i, '');
        } else {
          pat = importSVG(builtinSVG(P.pattern, P.density));
          nm = P.pattern;
        }
        const kit = buildPrintKit(pat, { thickness, hingeType });
        const blob = new Blob([kit.stl], { type: 'model/stl' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${nm}-${hingeType}hinge-t${thickness}.stl`;
        a.click();
        URL.revokeObjectURL(url);
        return kit.manifest;
      } catch (e) {
        return { error: (e as Error).message };
      }
    },
    setAssembly(on: boolean) {
      if (on) return buildAssembly();
      clearAssembly();
      radius = mode === 'builtin' ? 2.15 * B.extent : (curExtent / Math.tan((38 * Math.PI) / 180 / 2)) * 1.2;
      return null;
    },
    replayAssembly() {
      replayAssembly();
    },
    dispose() {
      dead = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      clearAssembly();
      disposeBuiltin();
      disposeSolver();
      renderer.dispose();
      mount.innerHTML = '';
    },
  };
}

/* ---------- UI ---------- */
const MONO = "'JetBrains Mono',ui-monospace,monospace";
const SANS = 'Inter,system-ui,sans-serif';

function el<K extends keyof HTMLElementTagNameMap>(tag: K, css: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  n.style.cssText = css;
  if (text !== undefined) n.textContent = text;
  return n;
}
function label(txt: string): HTMLElement {
  return el('div', `font:500 9px ${MONO};letter-spacing:.22em;color:#6b7480`, txt);
}

const PATTERNS: { id: PatternId; label: string; sub: string }[] = [
  { id: 'miura', label: 'Miura-ori', sub: 'herringbone tessellation' },
  { id: 'pleats', label: 'Accordion', sub: 'parallel pleats' },
  { id: 'fan', label: 'Fan', sub: 'single vertex · alternating' },
  { id: 'auxetic', label: 'Auxetic', sub: 'rotating squares · ν<0, deploys' },
  { id: 'gore', label: 'Oval (fold)', sub: 'one sheet · bidirectional → oval' },
];
const TOGGLES: { key: 'edges' | 'strain' | 'autoOrbit'; label: string }[] = [
  { key: 'edges', label: 'Crease lines' },
  { key: 'strain', label: 'Fold energy' },
  { key: 'autoOrbit', label: 'Auto-orbit' },
];
// origamisimulator.org example crease patterns (public/patterns/**), MIT — see
// public/patterns/ATTRIBUTION.md. Curved-crease patterns are omitted: the SVG
// importer handles straight creases only (M/L/H/V/Z).
const CASES = PATTERN_CASES;

export function initLab(): void {
  const root = document.getElementById('lab-root');
  if (!root) return;

  const DENSITY = 10,
    FOLD_MAX = 85,
    PAPER = '#f2f3f5';
  const base = import.meta.env.BASE_URL;

  const state: BuiltinParams = {
    pattern: 'miura',
    fold: 0.62,
    playing: false,
    strain: false,
    edges: true,
    autoOrbit: true,
    density: DENSITY,
    foldMax: FOLD_MAX,
    paperTone: PAPER,
    onFold: null,
    auxeticShape: 'square',
    hingeGap: 0.06,
    auxTilt: 20,
    goreN: 8,
    goreM: 6,
    goreAspect: 1.4,
  };
  let engine: 'builtin' | 'solver' = 'builtin';
  let source: 'builtin' | 'cases' | 'foundry' = 'builtin';

  const host = el('div', 'position:absolute;inset:0;overflow:hidden');
  root.appendChild(host);
  const app = createApp(host, state);

  const brand = el('a', 'position:absolute;top:24px;left:28px;display:flex;align-items:baseline;gap:12px;text-decoration:none');
  brand.setAttribute('href', base);
  brand.appendChild(el('span', `font:600 15px ${SANS};color:#f2f3f5;letter-spacing:-.01em`, 'Folded'));
  brand.appendChild(el('span', `font:500 10px ${MONO};letter-spacing:.22em;color:#6b7480`, '/ SIMULATOR — ENGINE STUDY'));
  root.appendChild(brand);

  const panel = el(
    'div',
    'position:absolute;left:24px;top:72px;bottom:24px;width:264px;display:flex;flex-direction:column;gap:18px;' +
      'padding:20px;box-sizing:border-box;border-radius:18px;background:rgba(17,19,26,.55);' +
      'border:1px solid rgba(255,255,255,.06);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);overflow-y:auto'
  );
  root.appendChild(panel);

  // Source selector — Built-in / Cases / Foundry (only one picker shows at a time)
  const sourceBar = el('div', 'display:flex;gap:4px;padding:4px;border-radius:11px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06)');
  const sourceTabs: Record<'builtin' | 'cases' | 'foundry', HTMLElement> = {} as Record<'builtin' | 'cases' | 'foundry', HTMLElement>;
  (
    [
      ['builtin', 'Built-in'],
      ['cases', 'Cases'],
      ['foundry', 'Foundry'],
    ] as [('builtin' | 'cases' | 'foundry'), string][]
  ).forEach(([id, lab]) => {
    const b = el('div', `flex:1;padding:7px 4px;border-radius:8px;text-align:center;cursor:pointer;font:600 10px ${MONO};letter-spacing:.08em`, lab);
    b.addEventListener('click', () => setSource(id));
    sourceTabs[id] = b;
    sourceBar.appendChild(b);
  });
  panel.appendChild(sourceBar);

  /* PATTERN (built-ins) */
  const patSec = el('div', 'display:flex;flex-direction:column;gap:6px');
  patSec.appendChild(label('PATTERN · CLOSED-FORM'));
  const patBtns: HTMLElement[] = [];
  PATTERNS.forEach((d) => {
    const btn = el('div', 'display:flex;flex-direction:column;gap:1px;padding:9px 12px;border-radius:10px;cursor:pointer');
    const name = el('span', `font:500 13px ${SANS}`, d.label);
    btn.appendChild(name);
    btn.appendChild(el('span', `font:400 9.5px ${MONO};color:#6b7480;letter-spacing:.04em`, d.sub));
    btn.addEventListener('click', () => {
      engine = 'builtin';
      state.pattern = d.id;
      app.setBuiltin(d.id);
      caseSelect.value = '';
      statusEl.textContent = `built-in · ${d.label}`;
      syncPatterns();
      syncAux();
      syncGore();
      drawCP();
      syncData();
      syncFold();
    });
    (btn as HTMLElement & { _name: HTMLElement })._name = name;
    patBtns.push(btn);
    patSec.appendChild(btn);
  });
  panel.appendChild(patSec);

  // Auxetic configurator — shown only when the Auxetic built-in is active
  const auxSec = el('div', 'display:none;flex-direction:column;gap:8px');
  auxSec.appendChild(label('AUXETIC CONFIG'));
  const shapeRow = el('div', 'display:flex;gap:6px');
  const shapeBtns = {} as Record<AuxeticShape, HTMLElement>;
  (['square', 'triangle'] as AuxeticShape[]).forEach((sh) => {
    const b = el(
      'div',
      `flex:1;padding:7px 8px;border-radius:9px;text-align:center;cursor:pointer;font:500 11px ${SANS}`,
      sh === 'square' ? 'Square' : 'Triangle'
    );
    b.addEventListener('click', () => {
      state.auxeticShape = sh;
      app.setAuxetic({ shape: sh });
      syncShape();
      drawCP();
      syncData();
      syncFold();
    });
    shapeBtns[sh] = b;
    shapeRow.appendChild(b);
  });
  auxSec.appendChild(shapeRow);
  function syncShape() {
    (['square', 'triangle'] as AuxeticShape[]).forEach((sh) => {
      const on = state.auxeticShape === sh;
      shapeBtns[sh].style.background = on ? 'rgba(58,169,230,.12)' : 'rgba(255,255,255,.03)';
      shapeBtns[sh].style.border = '1px solid ' + (on ? 'rgba(58,169,230,.5)' : 'rgba(255,255,255,.06)');
      shapeBtns[sh].style.color = on ? '#f2f3f5' : '#aab2bf';
    });
  }
  const gapHead = el('div', 'display:flex;justify-content:space-between;align-items:baseline');
  gapHead.appendChild(el('span', `font:400 10px ${MONO};color:#8b93a0`, 'hinge  t/l'));
  const gapVal = el('span', `font:500 10px ${MONO};color:#3aa9e6`, state.hingeGap.toFixed(2));
  gapHead.appendChild(gapVal);
  auxSec.appendChild(gapHead);
  const gapSlider = document.createElement('input');
  gapSlider.type = 'range';
  gapSlider.min = '0';
  gapSlider.max = '25';
  gapSlider.value = String(Math.round(state.hingeGap * 100));
  gapSlider.style.cssText = 'width:100%;height:4px;cursor:pointer;accent-color:#3aa9e6';
  gapSlider.addEventListener('input', () => {
    state.hingeGap = +gapSlider.value / 100;
    gapVal.textContent = state.hingeGap.toFixed(2);
    app.setAuxetic({ gap: state.hingeGap });
    drawCP();
  });
  auxSec.appendChild(gapSlider);
  auxSec.appendChild(el('div', `font:400 8.5px/1.4 ${MONO};color:#59626e`, 'deploy angle = FOLD slider · grid = density · ν≈−1'));
  // cut tilt θ (bistable chirality) + laser cut-pattern export
  const tiltHead = el('div', 'display:flex;justify-content:space-between;align-items:baseline;margin-top:2px');
  tiltHead.appendChild(el('span', `font:400 10px ${MONO};color:#8b93a0`, 'cut tilt θ'));
  const tiltVal = el('span', `font:500 10px ${MONO};color:#3aa9e6`, state.auxTilt + '°');
  tiltHead.appendChild(tiltVal);
  auxSec.appendChild(tiltHead);
  const tiltSlider = document.createElement('input');
  tiltSlider.type = 'range';
  tiltSlider.min = '0';
  tiltSlider.max = '30';
  tiltSlider.value = String(state.auxTilt);
  tiltSlider.style.cssText = 'width:100%;height:4px;cursor:pointer;accent-color:#3aa9e6';
  tiltSlider.addEventListener('input', () => {
    state.auxTilt = +tiltSlider.value;
    tiltVal.textContent = state.auxTilt + '°';
    drawCP();
  });
  auxSec.appendChild(tiltSlider);
  auxSec.appendChild(el('div', `font:400 8.5px/1.4 ${MONO};color:#59626e`, 'θ>0 → bistable chiral cut motif (Rafsanjani ~20° sq / 12° tri)'));
  const cutBtn = el(
    'div',
    'padding:8px 12px;border-radius:10px;text-align:center;cursor:pointer;background:rgba(58,169,230,.12);' +
      `border:1px solid rgba(58,169,230,.4);color:#e8eaee;font:500 11px ${SANS}`,
    'Cut pattern (SVG)'
  );
  cutBtn.addEventListener('click', () => {
    const l = 10,
      t = state.hingeGap * l;
    const svg = auxeticCutSVG(state.auxeticShape, state.density, l, t, state.auxTilt);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auxetic-${state.auxeticShape}-cut-t${state.auxTilt}deg.svg`;
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = `cut pattern: ${state.auxeticShape} · θ${state.auxTilt}° · t/l ${state.hingeGap.toFixed(2)} — laser-ready SVG`;
  });
  auxSec.appendChild(cutBtn);
  panel.appendChild(auxSec);
  function syncAux() {
    const on = source === 'builtin' && engine === 'builtin' && state.pattern === 'auxetic';
    auxSec.style.display = on ? 'flex' : 'none';
    if (on) syncShape();
  }

  // Oval (gore) configurator — shown only when the gore built-in is active
  const goreSec = el('div', 'display:none;flex-direction:column;gap:8px');
  goreSec.appendChild(label('OVAL CONFIG'));
  const goreRow = (name: string, min: number, max: number, step: number, get: () => number, set: (v: number) => void, fmt: (v: number) => string) => {
    const head = el('div', 'display:flex;justify-content:space-between;align-items:baseline');
    head.appendChild(el('span', `font:400 10px ${MONO};color:#8b93a0`, name));
    const val = el('span', `font:500 10px ${MONO};color:#3aa9e6`, fmt(get()));
    head.appendChild(val);
    goreSec.appendChild(head);
    const sl = document.createElement('input');
    sl.type = 'range';
    sl.min = String(min);
    sl.max = String(max);
    sl.step = String(step);
    sl.value = String(get());
    sl.style.cssText = 'width:100%;height:4px;cursor:pointer;accent-color:#3aa9e6';
    sl.addEventListener('input', () => {
      set(+sl.value);
      val.textContent = fmt(+sl.value);
      drawCP();
      syncData();
    });
    goreSec.appendChild(sl);
  };
  goreRow('gores N', 4, 16, 1, () => state.goreN, (v) => { state.goreN = v; app.setGore({ gores: v }); }, (v) => String(v));
  goreRow('rings M', 3, 12, 1, () => state.goreM, (v) => { state.goreM = v; app.setGore({ rings: v }); }, (v) => String(v));
  goreRow('aspect α', 0.6, 2, 0.1, () => state.goreAspect, (v) => { state.goreAspect = v; app.setGore({ aspect: v }); }, (v) => v.toFixed(1));
  goreSec.appendChild(el('div', `font:400 8.5px/1.4 ${MONO};color:#59626e`, 'deploy = FOLD slider (flat gores → oval) · α>1 = egg'));
  panel.appendChild(goreSec);
  function syncGore() {
    goreSec.style.display = source === 'builtin' && state.pattern === 'gore' ? 'flex' : 'none';
  }
  function setSource(src: 'builtin' | 'cases' | 'foundry') {
    source = src;
    patSec.style.display = src === 'builtin' ? 'flex' : 'none';
    caseSec.style.display = src === 'cases' ? 'flex' : 'none';
    foundrySec.style.display = src === 'foundry' ? 'flex' : 'none';
    (['builtin', 'cases', 'foundry'] as const).forEach((k) => {
      const on = k === src;
      sourceTabs[k].style.background = on ? 'rgba(58,169,230,.85)' : 'transparent';
      sourceTabs[k].style.color = on ? '#0b0c0f' : '#8b93a0';
    });
    syncAux();
    syncGore();
  }

  function syncPatterns() {
    PATTERNS.forEach((d, i) => {
      const on = engine === 'builtin' && state.pattern === d.id;
      const btn = patBtns[i];
      btn.style.background = on ? 'rgba(58,169,230,.12)' : 'rgba(255,255,255,.03)';
      btn.style.border = '1px solid ' + (on ? 'rgba(58,169,230,.5)' : 'rgba(255,255,255,.06)');
      (btn as HTMLElement & { _name: HTMLElement })._name.style.color = on ? '#f2f3f5' : '#aab2bf';
    });
  }

  /* CASES (origamisimulator.org, solver) */
  const caseSec = el('div', 'display:flex;flex-direction:column;gap:8px');
  caseSec.appendChild(label('CASES · ORIGAMISIMULATOR'));
  const caseSelect = document.createElement('select');
  caseSelect.style.cssText =
    `width:100%;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);color:#e8eaee;border:1px solid rgba(255,255,255,.08);font:400 12px ${SANS};cursor:pointer`;
  const ph = document.createElement('option');
  ph.value = '';
  ph.textContent = 'Load an example…';
  caseSelect.appendChild(ph);
  CASES.forEach((grp) => {
    const og = document.createElement('optgroup');
    og.label = grp.group;
    grp.items.forEach((it) => {
      const op = document.createElement('option');
      op.value = it.file;
      op.textContent = it.label;
      og.appendChild(op);
    });
    caseSelect.appendChild(og);
  });
  caseSec.appendChild(caseSelect);
  const upload = document.createElement('input');
  upload.type = 'file';
  upload.accept = '.svg,.fold';
  upload.style.cssText = `font:400 10px ${MONO};color:#8b93a0`;
  caseSec.appendChild(upload);
  panel.appendChild(caseSec);

  /* FOUNDRY — generate a parametric crease pattern, fold it, or download the SVG */
  const foundrySec = el('div', 'display:flex;flex-direction:column;gap:8px');
  foundrySec.appendChild(label('FOUNDRY · GENERATE'));
  const genSelect = document.createElement('select');
  genSelect.style.cssText = `width:100%;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);color:#e8eaee;border:1px solid rgba(255,255,255,.08);font:400 12px ${SANS};cursor:pointer`;
  GENERATORS.forEach((g) => {
    const o = document.createElement('option');
    o.value = g.id;
    o.textContent = g.label;
    genSelect.appendChild(o);
  });
  foundrySec.appendChild(genSelect);
  const paramBox = el('div', 'display:flex;flex-direction:column;gap:6px');
  foundrySec.appendChild(paramBox);
  const genState: { id: string; params: Record<string, number> } = { id: GENERATORS[0].id, params: {} };
  function rebuildParams() {
    paramBox.replaceChildren();
    const g = GENERATORS.find((x) => x.id === genState.id)!;
    genState.params = {};
    g.params.forEach((pr) => {
      genState.params[pr.key] = pr.default;
      const head = el('div', 'display:flex;justify-content:space-between;align-items:baseline');
      head.appendChild(el('span', `font:400 10px ${MONO};color:#8b93a0`, pr.label));
      const val = el('span', `font:500 10px ${MONO};color:#3aa9e6`, String(pr.default));
      head.appendChild(val);
      paramBox.appendChild(head);
      const sl = document.createElement('input');
      sl.type = 'range';
      sl.min = String(pr.min);
      sl.max = String(pr.max);
      sl.step = String(pr.step);
      sl.value = String(pr.default);
      sl.style.cssText = 'width:100%;height:4px;cursor:pointer;accent-color:#3aa9e6';
      sl.addEventListener('input', () => {
        genState.params[pr.key] = +sl.value;
        val.textContent = String(+sl.value);
      });
      paramBox.appendChild(sl);
    });
  }
  genSelect.addEventListener('change', () => {
    genState.id = genSelect.value;
    rebuildParams();
  });
  const foundryBtns = el('div', 'display:flex;gap:6px');
  const foldGenBtn = el(
    'div',
    'flex:1;padding:9px 8px;border-radius:10px;text-align:center;cursor:pointer;background:rgba(58,169,230,.14);' +
      `border:1px solid rgba(58,169,230,.45);color:#e8eaee;font:500 11px ${SANS}`,
    'Fold it'
  );
  foldGenBtn.addEventListener('click', () => {
    const svg = generatePattern(genState.id, genState.params);
    const r = app.loadCase(svg, `${genState.id}.svg`);
    if (!r.ok) {
      statusEl.textContent = 'foundry failed: ' + r.msg;
      return;
    }
    engine = 'solver';
    caseSelect.value = '';
    syncPatterns();
    syncAux();
    syncGore();
    drawCP();
    syncData();
    syncFold();
    statusEl.textContent = `foundry: ${genState.id} → ${r.msg}`;
  });
  const dlGenBtn = el(
    'div',
    'flex:1;padding:9px 8px;border-radius:10px;text-align:center;cursor:pointer;background:rgba(255,255,255,.05);' +
      `border:1px solid rgba(255,255,255,.12);color:#e8eaee;font:500 11px ${SANS}`,
    'Download SVG'
  );
  dlGenBtn.addEventListener('click', () => {
    const svg = generatePattern(genState.id, genState.params);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${genState.id}-crease-pattern.svg`;
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = `downloaded ${genState.id} crease pattern (fold it anywhere)`;
  });
  const dlFoldBtn = el(
    'div',
    'flex:1;padding:9px 8px;border-radius:10px;text-align:center;cursor:pointer;background:rgba(255,255,255,.05);' +
      `border:1px solid rgba(255,255,255,.12);color:#e8eaee;font:500 11px ${SANS}`,
    'Download FOLD'
  );
  dlFoldBtn.addEventListener('click', () => {
    try {
      const pattern = importSVG(generatePattern(genState.id, genState.params));
      const blob = new Blob([exportFOLDText(pattern)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${genState.id}.fold`;
      a.click();
      URL.revokeObjectURL(url);
      statusEl.textContent = `downloaded ${genState.id}.fold (exact fold angles, FOLD v1.0)`;
    } catch (e) {
      statusEl.textContent = 'FOLD export failed: ' + (e as Error).message;
    }
  });
  foundryBtns.appendChild(foldGenBtn);
  foundryBtns.appendChild(dlGenBtn);
  foundryBtns.appendChild(dlFoldBtn);
  foundrySec.appendChild(foundryBtns);
  foundrySec.appendChild(el('div', `font:400 8.5px/1.4 ${MONO};color:#59626e`, 'generates a real crease pattern (M/V/opacity) — folds in the solver, prints for cutting'));
  panel.appendChild(foundrySec);
  rebuildParams();

  async function loadCaseURL(file: string) {
    statusEl.textContent = `loading ${file.split('/').pop()}…`;
    try {
      const res = await fetch(`${base}patterns/${file}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      applyCase(await res.text(), file.split('/').pop()!);
    } catch (e) {
      statusEl.textContent = `load failed: ${(e as Error).message}`;
    }
  }
  function applyCase(text: string, name: string) {
    const r = app.loadCase(text, name);
    statusEl.textContent = r.msg;
    if (!r.ok) return;
    engine = 'solver';
    syncPatterns();
    syncAux();
    syncGore();
    drawCP();
    syncData();
    syncFold();
  }
  caseSelect.addEventListener('change', () => {
    if (caseSelect.value) void loadCaseURL(caseSelect.value);
  });
  upload.addEventListener('change', () => {
    const f = upload.files?.[0];
    if (!f) return;
    caseSelect.value = '';
    void f.text().then((t) => applyCase(t, f.name));
  });

  /* FOLD */
  const foldSec = el('div', 'display:flex;flex-direction:column;gap:10px');
  const foldHead = el('div', 'display:flex;justify-content:space-between;align-items:baseline');
  foldHead.appendChild(label('FOLD'));
  const thetaEl = el('span', `font:500 11px ${MONO};color:#3aa9e6`);
  foldHead.appendChild(thetaEl);
  foldSec.appendChild(foldHead);
  const foldRow = el('div', 'display:flex;align-items:center;gap:10px');
  const playBtn = el(
    'div',
    'flex:none;width:30px;height:30px;border-radius:10px;display:flex;align-items:center;justify-content:center;' +
      `cursor:pointer;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);color:#e8eaee;font:500 10px ${MONO}`
  );
  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';
  slider.style.cssText = 'flex:1;height:4px;cursor:pointer;accent-color:#3aa9e6';
  foldRow.appendChild(playBtn);
  foldRow.appendChild(slider);
  foldSec.appendChild(foldRow);
  // MATERIAL — thickness/stock: caps fold angle + stiffens + tints (shared, solver patterns)
  const matSec = el('div', 'display:flex;flex-direction:column;gap:6px');
  matSec.appendChild(label('MATERIAL · THICKNESS'));
  const matSelect = document.createElement('select');
  matSelect.style.cssText = `width:100%;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.04);color:#e8eaee;border:1px solid rgba(255,255,255,.08);font:400 12px ${SANS};cursor:pointer`;
  MATERIALS.forEach((m) => {
    const o = document.createElement('option');
    o.value = m.id;
    o.textContent = m.label;
    matSelect.appendChild(o);
  });
  const matNote = el('div', `font:400 9px ${MONO};color:#59626e`, 'paper folds flat · thick stock can’t crease flat');
  matSelect.addEventListener('change', () => {
    const r = app.setMaterial(matSelect.value);
    const m = MATERIALS.find((x) => x.id === matSelect.value)!;
    matNote.textContent = `${m.thickness} mm · max fold ${Math.round(foldCapDeg(m.thickness))}°`;
    statusEl.textContent = r.ok ? `material: ${r.msg}` : r.msg;
  });
  matSec.appendChild(matSelect);
  matSec.appendChild(matNote);
  panel.appendChild(matSec);

  panel.appendChild(foldSec);
  function syncFold() {
    thetaEl.textContent =
      engine === 'solver'
        ? Math.round(state.fold * 100) + '%'
        : state.pattern === 'gore'
          ? Math.round(state.fold * 100) + '% oval'
          : state.pattern === 'auxetic'
            ? 'deploy ' + Math.round(state.fold * 45) + '°'
            : 'θ ' + Math.round(state.fold * state.foldMax) + '°';
    slider.value = String(Math.round(state.fold * 100));
    playBtn.textContent = state.playing ? '❚❚' : '▶';
    playBtn.style.opacity = engine === 'solver' ? '0.4' : '1';
  }
  slider.addEventListener('input', () => {
    state.fold = +slider.value / 100;
    state.playing = false;
    app.setParams({ fold: state.fold, playing: false });
    syncFold();
  });
  playBtn.addEventListener('click', () => {
    if (engine === 'solver') return; // play sweeps the closed-form fold only
    state.playing = !state.playing;
    app.setParams({ playing: state.playing });
    syncFold();
  });
  app.setParams({
    onFold: (f: number) => {
      if (!state.playing) return;
      state.fold = f;
      syncFold();
    },
  });

  /* VIEW toggles */
  const viewSec = el('div', 'display:flex;flex-direction:column;gap:8px');
  viewSec.appendChild(label('VIEW'));
  const knobs: { pill: HTMLElement; knob: HTMLElement; key: 'edges' | 'strain' | 'autoOrbit' }[] = [];
  TOGGLES.forEach((t) => {
    const row = el('div', 'display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:2px 0');
    row.appendChild(el('span', `font:400 12.5px ${SANS};color:#c7ccd4`, t.label));
    const pill = el('div', 'width:30px;height:17px;border-radius:9px;position:relative;transition:background .25s;border:1px solid rgba(255,255,255,.08)');
    const knob = el('div', 'position:absolute;top:2px;width:11px;height:11px;border-radius:6px;background:#f2f3f5;transition:left .25s cubic-bezier(.16,1,.3,1)');
    pill.appendChild(knob);
    row.appendChild(pill);
    row.addEventListener('click', () => {
      state[t.key] = !state[t.key];
      app.setParams({ [t.key]: state[t.key] });
      syncToggles();
    });
    knobs.push({ pill, knob, key: t.key });
    viewSec.appendChild(row);
  });
  // Assembly map (view mode, not a render param): flat parts tray ↔ assembled model
  let asmOn = false;
  const asmRow = el('div', 'display:flex;justify-content:space-between;align-items:center;cursor:pointer;padding:2px 0');
  asmRow.appendChild(el('span', `font:400 12.5px ${SANS};color:#c7ccd4`, 'Assembly map'));
  const asmPill = el('div', 'width:30px;height:17px;border-radius:9px;position:relative;transition:background .25s;border:1px solid rgba(255,255,255,.08)');
  const asmKnob = el('div', 'position:absolute;top:2px;width:11px;height:11px;border-radius:6px;background:#f2f3f5;transition:left .25s cubic-bezier(.16,1,.3,1)');
  asmPill.appendChild(asmKnob);
  asmRow.appendChild(asmPill);
  const syncAsm = () => {
    asmPill.style.background = asmOn ? 'rgba(58,169,230,.85)' : 'rgba(255,255,255,.07)';
    asmKnob.style.left = asmOn ? '15px' : '2px';
  };
  asmRow.addEventListener('click', () => {
    asmOn = !asmOn;
    const r = app.setAssembly(asmOn);
    syncAsm();
    asmHint.style.display = asmOn ? 'flex' : 'none';
    statusEl.textContent = asmOn
      ? r
        ? `assembly: ${r.parts} parts · ${r.steps} joins · hover a leaf for its # + links · red=mountain, blue=valley seams`
        : 'assembly map unavailable for this pattern'
      : 'assembly map off';
  });
  viewSec.appendChild(asmRow);
  const asmHint = el('div', 'display:none;align-items:center;gap:8px;margin-top:2px');
  const asmReplay = el(
    'div',
    `cursor:pointer;font:500 9px ${MONO};color:#3aa9e6;padding:3px 8px;border:1px solid rgba(58,169,230,.4);border-radius:6px`,
    '⟳ replay fold'
  );
  asmReplay.addEventListener('click', () => {
    if (asmOn) app.replayAssembly();
  });
  asmHint.appendChild(asmReplay);
  asmHint.appendChild(el('div', `font:400 8.5px/1.3 ${MONO};color:#59626e`, 'flat parts (below) fold up into the model'));
  viewSec.appendChild(asmHint);
  syncAsm();
  panel.appendChild(viewSec);
  function syncToggles() {
    knobs.forEach(({ pill, knob, key }) => {
      const on = state[key];
      pill.style.background = on ? 'rgba(58,169,230,.85)' : 'rgba(255,255,255,.07)';
      knob.style.left = on ? '15px' : '2px';
    });
  }

  /* CREASE PATTERN minimap (built-ins only) */
  const cpSec = el('div', 'display:flex;flex-direction:column;gap:8px');
  cpSec.appendChild(label('CREASE PATTERN'));
  const SVGNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 112 74');
  svg.style.cssText = 'width:100%;border-radius:10px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.05)';
  cpSec.appendChild(svg);
  panel.appendChild(cpSec);
  function drawCP() {
    if (engine === 'solver') {
      cpSec.style.display = 'none';
      return;
    }
    cpSec.style.display = 'flex';
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    // Gore: show the flat gore-strip layout (the printable/cuttable pattern)
    if (state.pattern === 'gore') {
      const gb = buildGore(Math.min(state.goreN, 8), Math.min(state.goreM, 6), state.goreAspect);
      gb.update(0);
      let mnx = Infinity,
        mxx = -Infinity,
        mnz = Infinity,
        mxz = -Infinity;
      for (let v = 0; v < gb.nV; v++) {
        const x = gb.grid[v * 3],
          z = gb.grid[v * 3 + 2];
        mnx = Math.min(mnx, x);
        mxx = Math.max(mxx, x);
        mnz = Math.min(mnz, z);
        mxz = Math.max(mxz, z);
      }
      const w = mxx - mnx || 1,
        hh = mxz - mnz || 1;
      const sc = Math.min(104 / w, 66 / hh),
        ox = (112 - w * sc) / 2,
        oy = (74 - hh * sc) / 2;
      for (let p = 0; p < gb.pairs.length; p += 2) {
        const a = gb.pairs[p],
          b = gb.pairs[p + 1];
        const line = document.createElementNS(SVGNS, 'line');
        line.setAttribute('x1', String(ox + (gb.grid[a * 3] - mnx) * sc));
        line.setAttribute('y1', String(oy + (gb.grid[a * 3 + 2] - mnz) * sc));
        line.setAttribute('x2', String(ox + (gb.grid[b * 3] - mnx) * sc));
        line.setAttribute('y2', String(oy + (gb.grid[b * 3 + 2] - mnz) * sc));
        line.setAttribute('stroke', gb.cols[p / 2][2] > 0.8 ? '#3aa9e6' : '#7c8794');
        line.setAttribute('stroke-width', '0.5');
        svg.appendChild(line);
      }
      return;
    }
    // Auxetic: show the LIVE cut pattern (updates with shape / hinge / tilt θ)
    if (state.pattern === 'auxetic') {
      const N = Math.min(state.density, 6);
      const { lines, w, h } = auxeticCutLines(state.auxeticShape, N, 1, state.hingeGap, state.auxTilt);
      const sc = Math.min(104 / (w || 1), 66 / (h || 1));
      const ox = (112 - w * sc) / 2,
        oy = (74 - h * sc) / 2;
      lines.forEach((c) => {
        const line = document.createElementNS(SVGNS, 'line');
        line.setAttribute('x1', String(ox + c[0] * sc));
        line.setAttribute('y1', String(oy + c[1] * sc));
        line.setAttribute('x2', String(ox + c[2] * sc));
        line.setAttribute('y2', String(oy + c[3] * sc));
        line.setAttribute('stroke', '#3aa9e6');
        line.setAttribute('stroke-width', '0.7');
        svg.appendChild(line);
      });
      return;
    }
    const n = state.pattern === 'miura' ? Math.min(state.density, 12) : state.density;
    cpLines(state.pattern, n).forEach((l) => {
      const line = document.createElementNS(SVGNS, 'line');
      line.setAttribute('x1', String(l.x1));
      line.setAttribute('y1', String(l.y1));
      line.setAttribute('x2', String(l.x2));
      line.setAttribute('y2', String(l.y2));
      line.setAttribute('stroke', CP_DISPLAY[l.a]);
      line.setAttribute('stroke-width', '0.6');
      svg.appendChild(line);
    });
  }

  /* DATA */
  const dataSec = el('div', 'display:flex;flex-direction:column;gap:5px');
  dataSec.appendChild(label('DATA'));
  const dataEl = el('div', `font:400 10.5px ${MONO};color:#aab2bf`);
  const checkEl = el('div', `font:400 10.5px ${MONO};color:#3aa9e6`, 'kawasaki ✓ · maekawa ✓ · flat-foldable');
  dataSec.appendChild(dataEl);
  dataSec.appendChild(checkEl);
  panel.appendChild(dataSec);
  function syncData() {
    if (engine === 'solver') {
      if (loaded) {
        // REAL flat-foldability verdict (Maekawa + Kawasaki), not a placeholder
        const fb = loaded.foldability;
        checkEl.style.display = 'block';
        checkEl.style.color = fb.penetrates ? '#d9544d' : fb.flatFoldable ? '#4caf7d' : '#c9a24a';
        const base = fb.flatFoldable
          ? `flat-foldable ✓ · Maekawa + Kawasaki hold (${fb.interior} interior vertices)`
          : `3D shell · not flat-foldable (${fb.violations}/${fb.interior} vertices violate)`;
        const phys = !fb.physChecked ? '' : fb.penetrates ? ' · ⚠ self-penetrates (needs collision)' : ' · physically clean';
        checkEl.textContent = base + phys;
        dataEl.textContent = `faces ${loaded.pattern.faces.length} · creases ${loaded.pattern.edges.filter((e) => e.assignment === 'M' || e.assignment === 'V').length} · verts ${loaded.pattern.vertices.length}`;
      } else {
        checkEl.style.display = 'none';
        dataEl.textContent = 'compliant spring-mass solver';
      }
      return;
    }
    checkEl.style.display = 'block';
    checkEl.style.color = '#3aa9e6';
    checkEl.textContent =
      state.pattern === 'gore'
        ? 'one connected sheet · bidirectional fold → oval'
        : state.pattern === 'auxetic'
          ? 'rotating squares · ν≈−1 auxetic · closed↔open states'
          : 'kawasaki ✓ · maekawa ✓ · flat-foldable';
    if (state.pattern === 'gore') {
      dataEl.textContent = `${state.goreN} gores · ${state.goreM} rings · α ${state.goreAspect.toFixed(1)}`;
      return;
    }
    const s = statsFor(state.pattern, state.density);
    dataEl.textContent = `faces ${s.faces} · creases ${s.creases} · verts ${s.verts}`;
  }

  /* EXPORT */
  const expSec = el('div', 'display:flex;flex-direction:column;gap:8px');
  expSec.appendChild(label('EXPORT'));
  const expBtn = el(
    'div',
    'padding:9px 12px;border-radius:10px;text-align:center;cursor:pointer;background:rgba(58,169,230,.12);' +
      `border:1px solid rgba(58,169,230,.4);color:#e8eaee;font:500 12px ${SANS}`,
    'Crease pattern (SVG)'
  );
  expBtn.addEventListener('click', () => app.exportSVG());
  expSec.appendChild(expBtn);
  expSec.appendChild(
    el('div', `font:400 9px/1.5 ${MONO};color:#59626e`, 'red mountain · blue valley · black border — round-trips with origamisimulator.org')
  );

  // 3D print kit: thickness-accommodated flat hinged sheet (fold after printing)
  const kitRow = el('div', 'display:flex;align-items:center;gap:8px;margin-top:2px');
  kitRow.appendChild(el('span', `font:400 10px ${MONO};color:#8b93a0`, 'thickness'));
  const thickIn = document.createElement('input');
  thickIn.type = 'number';
  thickIn.min = '0.4';
  thickIn.step = '0.2';
  thickIn.value = '2';
  thickIn.style.cssText = `width:54px;padding:4px 6px;border-radius:8px;background:rgba(255,255,255,.04);color:#e8eaee;border:1px solid rgba(255,255,255,.08);font:400 11px ${MONO}`;
  kitRow.appendChild(thickIn);
  kitRow.appendChild(el('span', `font:400 10px ${MONO};color:#59626e`, 'mm'));
  expSec.appendChild(kitRow);
  const kitBtnRow = el('div', 'display:flex;gap:6px');
  const mkKit = (label: string, type: 'living' | 'pin') => {
    const btn = el(
      'div',
      'flex:1;padding:9px 8px;border-radius:10px;text-align:center;cursor:pointer;background:rgba(255,255,255,.05);' +
        `border:1px solid rgba(255,255,255,.12);color:#e8eaee;font:500 11px ${SANS}`,
      label
    );
    btn.addEventListener('click', () => {
      const r = app.exportPrintKit(parseFloat(thickIn.value) || 2, type);
      if ('error' in r) {
        statusEl.textContent = 'print kit failed: ' + r.error;
        return;
      }
      const warn = r.warnings.length ? ` · ${r.warnings.length} warn` : '';
      statusEl.textContent =
        type === 'pin'
          ? `pin kit: ${r.parts} parts · ${r.knuckles} knuckles · ${r.pins} ${r.pinStyle} pin halves · bore Ø${r.boreDiameter}mm · ${r.plates} plate(s)${warn}`
          : `living kit: ${r.panels} panels · ${r.creases} creases · gap ${r.creaseGap.max}mm · support-free${warn}`;
    });
    return btn;
  };
  kitBtnRow.appendChild(mkKit('Living-hinge STL', 'living'));
  kitBtnRow.appendChild(mkKit('Pin-hinge STL', 'pin'));
  expSec.appendChild(kitBtnRow);
  expSec.appendChild(
    el(
      'div',
      `font:400 9px/1.5 ${MONO};color:#59626e`,
      'living: one flat sheet, fold after · pin: panels + knuckles + printable mid-lock pins (lock at mid-bore), nested'
    )
  );
  panel.appendChild(expSec);

  /* ENGINE notes + status */
  const engSec = el('div', 'display:flex;flex-direction:column;gap:5px');
  engSec.appendChild(label('ENGINE'));
  const eng = el('div', `font:400 10.5px/1.6 ${MONO};color:#7e8794`);
  eng.innerHTML = 'built-ins: closed-form, 1 DOF<br>cases: compliant spring-mass<br>(after origamisimulator.org)';
  engSec.appendChild(eng);
  const statusEl = el('div', `font:400 9.5px/1.5 ${MONO};color:#59626e`, 'built-in · Miura-ori');
  engSec.appendChild(statusEl);
  panel.appendChild(engSec);

  /* credit */
  const credit = el(
    'div',
    `margin-top:auto;padding-top:14px;border-top:1px solid rgba(255,255,255,.06);font:400 9.5px/1.6 ${MONO};color:#59626e`
  );
  credit.innerHTML = 'engine study · after<br>origamisimulator.org (A. Ghassaei)';
  panel.appendChild(credit);

  root.appendChild(
    el(
      'div',
      `position:absolute;right:28px;bottom:24px;font:500 9.5px ${MONO};letter-spacing:.14em;color:#59626e;pointer-events:none`,
      'DRAG — ORBIT · SCROLL — ZOOM'
    )
  );

  setSource('builtin');
  syncPatterns();
  syncAux();
  syncGore();
  syncFold();
  syncToggles();
  drawCP();
  syncData();
}
