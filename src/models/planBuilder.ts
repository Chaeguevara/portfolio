import * as THREE from 'three';
import { AppConfig, resolveThreeBgFromCss } from '../config';

/**
 * Public options for the Plan Builder work.
 */
type Options = { mount?: HTMLElement; preview?: boolean };

/**
 * Directed edge describing desired adjacency: `from => to`.
 */
type Edge = { from: string; to: string };

/**
 * Node state used by the layout/simulation loop.
 */
type Node = { name: string; pos: THREE.Vector2; vel: THREE.Vector2; w: number; h: number };

type SharedResources = {
  roomGeometry: THREE.PlaneGeometry;
  roomMaterial: THREE.MeshBasicMaterial;
  roomBorderMaterial: THREE.LineBasicMaterial;
  lineMaterial: THREE.LineBasicMaterial;
};

type UiElements = {
  wrap: HTMLDivElement;
  left: HTMLDivElement;
  right: HTMLDivElement | null;
  roomsList: HTMLDivElement;
  sizesList: HTMLDivElement;
  edgesArea: HTMLTextAreaElement | null;
  showArrows: HTMLInputElement | null;
  fromInput: HTMLInputElement | null;
  toInput: HTMLInputElement | null;
  addBtn: HTMLButtonElement | null;
};

type UiRefs = Omit<UiElements, 'wrap' | 'left' | 'right'>;
type PointerHandlers = { onPointerDown: (ev: PointerEvent) => void; onPointerMove: (ev: PointerEvent) => void; onPointerUp: (ev: PointerEvent) => void };
type CleanupHandles = {
  refresh: () => void;
  resize: (() => void) | null;
  addEdge: (() => void) | null;
  pointer: PointerHandlers | null;
};

type DragState = { isDragging: boolean; dragNode: Node | null; dragOffset: THREE.Vector2 };

type SimulationParams = {
  centerK: number;
  attractK: number;
  repelK: number;
  damping: number;
  maxSpeed: number;
  targetGap: number;
  minGap: number;
  stopVel: number;
};

type PlanBuilderState = {
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.OrthographicCamera;
  nodes: Map<string, Node>;
  edges: Edge[];
  liveObjects: THREE.Object3D[];
  toDispose: Array<() => void>;
  baseRoomW: number;
  baseRoomH: number;
  shared: SharedResources;
  ui: UiElements;
  lastNamesKey: string;
  drag: DragState;
  params: SimulationParams;
  opts: Options;
  startSimulation: () => void;
};

type SimulationController = {
  start: () => void;
  stop: () => void;
  isRunning: () => boolean;
};

type ObjectWithGeometry = THREE.Object3D & { geometry?: THREE.BufferGeometry };
type ObjectWithMaterial = THREE.Object3D & { material?: THREE.Material | THREE.Material[] };

function safely(fn: () => void) {
  try {
    fn();
  } catch {
    /* noop */
  }
}

const DEFAULT_PREVIEW_RELATIONS = 'A => B\nB => C';
const DEFAULT_EDIT_RELATIONS = 'living room => room1\nroom1 => room2';
const BASE_ROOM_W = 80;
const BASE_ROOM_H = 50;
const ARROW_COLOR = 0xff7043;

// ---------------------------------------------------------------------------
// Pure utilities (parsing, set/array helpers, initial layout)
// ---------------------------------------------------------------------------

/**
 * Parse text lines into edges. Accepts lines in the form "A => B".
 */
function parseEdges(input: string): Edge[] {
  return input
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(.+?)\s*=>\s*(.+)$/);
      if (!m) return null;
      const from = m[1].trim();
      const to = m[2].trim();
      if (!from || !to) return null;
      return { from, to } as Edge;
    })
    .filter((e): e is Edge => !!e);
}

/**
 * Return a unique, deterministic list of room names given edges.
 */
function uniqueRooms(edges: Edge[]): string[] {
  const set = new Set<string>();
  for (const e of edges) { set.add(e.from); set.add(e.to); }
  return Array.from(set);
}

/**
 * Generate a simple circular layout for initial node positions.
 */
function layoutCircle(labels: string[], w: number, h: number) {
  const cx = 0;
  const cy = 0;
  const r = Math.max(60, Math.min(w, h) * 0.35);
  const angleStep = (Math.PI * 2) / Math.max(1, labels.length);
  const map = new Map<string, THREE.Vector3>();
  labels.forEach((name, i) => {
    const a = i * angleStep - Math.PI / 2; // start top
    map.set(name, new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0));
  });
  return map;
}

/**
 * Build a sprite containing a rounded label for a node.
 */
function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function buildLabelCanvas(text: string, color = '#111', bg = 'rgba(255,255,255,0.9)') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const pad = 8;
  ctx.font = '14px system-ui, sans-serif';
  const metrics = ctx.measureText(text);
  const w = Math.ceil(metrics.width + pad * 2);
  const h = 22 + pad * 2;
  canvas.width = w * 2;
  canvas.height = h * 2;
  ctx.scale(2, 2);
  ctx.fillStyle = bg;
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  roundedRectPath(ctx, 0.5, 0.5, w - 1, h - 1, 6);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pad, h / 2);
  return { canvas, w, h };
}

function makeTextSprite(text: string, color = '#111', bg = 'rgba(255,255,255,0.9)') {
  const { canvas, w, h } = buildLabelCanvas(text, color, bg);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 2;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(w, h, 1);
  return {
    sprite,
    dispose: () => {
      safely(() => tex.dispose());
      safely(() => mat.dispose());
    },
  };
}

// ---------------------------------------------------------------------------
// Extracted helpers used by the Plan Builder entry point
// ---------------------------------------------------------------------------

function createSharedResources(): SharedResources {
  return {
    roomGeometry: new THREE.PlaneGeometry(BASE_ROOM_W, BASE_ROOM_H),
    roomMaterial: new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }),
    roomBorderMaterial: new THREE.LineBasicMaterial({ color: 0x111111 }),
    lineMaterial: new THREE.LineBasicMaterial({ color: 0x2979ff }),
  };
}

function configurePreviewCanvas(left: HTMLDivElement, mount: HTMLElement) {
  left.style.position = 'absolute';
  left.style.inset = '0';
  left.style.width = '100%';
  left.style.height = '100%';
  mount.appendChild(left);
}

function injectControlsMarkup(right: HTMLDivElement) {
  right.innerHTML = `
    <div class="plan-controls-inner">
      <h3 class="h5">Room Relations</h3>
      <div class="form-row">
        <input type="text" id="from" placeholder="from (e.g. living)" />
        <span>⇒</span>
        <input type="text" id="to" placeholder="to (e.g. room1)" />
        <button id="addEdge" aria-label="Add relation">Add</button>
      </div>
      <label class="toggle"><input type="checkbox" id="showArrows" checked/> Show arrows</label>
      <textarea id="edges" spellcheck="false" placeholder="Enter relations, one per line: room1 => room2"></textarea>
      <small class="hint">Format: name => name. Updates live.</small>
      <div id="roomsList" class="rooms-list" aria-live="polite"></div>
      <div id="sizes" class="rooms-sizes">
        <h4 class="h6">Room Sizes</h4>
        <div id="sizesList"></div>
      </div>
    </div>
  `;
}

function createControlsContainer(wrap: HTMLDivElement, left: HTMLDivElement, mount: HTMLElement) {
  const right = document.createElement('div');
  right.className = 'plan-controls';
  wrap.appendChild(left);
  wrap.appendChild(right);
  mount.appendChild(wrap);
  injectControlsMarkup(right);
  return right;
}

function collectUiRefs(right: HTMLDivElement | null): UiRefs {
  const edgesArea = right?.querySelector<HTMLTextAreaElement>('#edges') ?? null;
  const showArrows = right?.querySelector<HTMLInputElement>('#showArrows') ?? null;
  const fromInput = right?.querySelector<HTMLInputElement>('#from') ?? null;
  const toInput = right?.querySelector<HTMLInputElement>('#to') ?? null;
  const addBtn = right?.querySelector<HTMLButtonElement>('#addEdge') ?? null;
  const roomsList = (right?.querySelector<HTMLDivElement>('#roomsList') ?? document.createElement('div')) as HTMLDivElement;
  const sizesList = (right?.querySelector<HTMLDivElement>('#sizesList') ?? document.createElement('div')) as HTMLDivElement;
  return { roomsList, sizesList, edgesArea, showArrows, fromInput, toInput, addBtn };
}

function createUi(mount: HTMLElement, opts: Options): UiElements {
  const wrap = document.createElement('div');
  wrap.className = 'plan-wrap';
  const left = document.createElement('div');
  left.className = 'plan-canvas';
  const right = opts.preview ? (configurePreviewCanvas(left, mount), null) : createControlsContainer(wrap, left, mount);
  const refs = collectUiRefs(right);
  if (!opts.preview && refs.edgesArea) refs.edgesArea.value = DEFAULT_EDIT_RELATIONS;
  return { wrap, left, right, ...refs };
}

function createRenderer(container: HTMLElement) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(resolveThreeBgFromCss());
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  container.appendChild(renderer.domElement);
  return renderer;
}

function createCamera() {
  const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);
  return camera;
}

function disposeObjectTree(obj: THREE.Object3D, shared: SharedResources) {
  for (const child of [...obj.children]) disposeObjectTree(child, shared);
  const geo = (obj as ObjectWithGeometry).geometry;
  if (geo && typeof geo.dispose === 'function' && geo !== shared.roomGeometry) {
    safely(() => geo.dispose());
  }
  const material = (obj as ObjectWithMaterial).material;
  if (!material) return;
  if (Array.isArray(material)) {
    material.forEach((m) => {
      if (m !== shared.roomMaterial && m !== shared.roomBorderMaterial && m !== shared.lineMaterial) {
        safely(() => m.dispose());
      }
    });
  } else if (material !== shared.roomMaterial && material !== shared.roomBorderMaterial && material !== shared.lineMaterial) {
    safely(() => material.dispose());
  }
}

function clearLiveObjects(scene: THREE.Scene, liveObjects: THREE.Object3D[], toDispose: Array<() => void>, shared: SharedResources) {
  for (const obj of liveObjects) {
    safely(() => scene.remove(obj));
    disposeObjectTree(obj, shared);
  }
  liveObjects.length = 0;
  while (toDispose.length) {
    const d = toDispose.pop();
    if (d) safely(d);
  }
}

function updateRoomsList(names: string[], roomsList: HTMLDivElement, canShow: boolean) {
  if (!canShow) return;
  roomsList.innerHTML = names.map((n) => `<span class="pill">${n}</span>`).join(' ');
}

function createSizeRow(name: string, nodes: Map<string, Node>, baseRoomW: number, baseRoomH: number) {
  const node = nodes.get(name);
  const w = node?.w ?? baseRoomW;
  const h = node?.h ?? baseRoomH;
  const row = document.createElement('div');
  row.className = 'size-row';
  row.innerHTML = `
      <label>${name}</label>
      <input type="number" min="20" step="1" value="${Math.round(w)}" data-room="${name}" data-k="w" aria-label="${name} width" />
      ×
      <input type="number" min="20" step="1" value="${Math.round(h)}" data-room="${name}" data-k="h" aria-label="${name} height" />
      <span class="unit">px</span>`;
  return row;
}

function attachSizeHandlers(container: HTMLElement, nodes: Map<string, Node>, baseRoomW: number, baseRoomH: number, startSimulation: () => void) {
  container.querySelectorAll('input[type="number"]').forEach((inp) => {
    inp.addEventListener('input', () => {
      const el = inp as HTMLInputElement;
      const room = el.getAttribute('data-room');
      const k = el.getAttribute('data-k') as 'w' | 'h' | null;
      if (!room || !k) return;
      const fallback = k === 'w' ? baseRoomW : baseRoomH;
      const v = Math.max(20, Number(el.value) || fallback);
      const node = nodes.get(room);
      if (node) {
        if (k === 'w') node.w = v;
        else node.h = v;
      }
      startSimulation();
    });
  });
}

function updateSizesUi(names: string[], ui: UiElements, nodes: Map<string, Node>, baseRoomW: number, baseRoomH: number, startSimulation: () => void) {
  if (!ui.right) return;
  const frag = document.createDocumentFragment();
  names.forEach((name) => frag.appendChild(createSizeRow(name, nodes, baseRoomW, baseRoomH)));
  ui.sizesList.innerHTML = '';
  ui.sizesList.appendChild(frag);
  attachSizeHandlers(ui.sizesList, nodes, baseRoomW, baseRoomH, startSimulation);
}

function resizeRendererToPane(left: HTMLElement, renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera) {
  const { clientWidth: wIn, clientHeight: hIn } = left;
  const w = wIn || left.getBoundingClientRect().width || 640;
  const h = hIn || left.getBoundingClientRect().height || 360;
  renderer.setSize(w, h);
  camera.left = -w / 2;
  camera.right = w / 2;
  camera.top = h / 2;
  camera.bottom = -h / 2;
  camera.updateProjectionMatrix();
  return { w, h };
}

function ensureNodes(names: string[], nodes: Map<string, Node>, w: number, h: number, baseRoomW: number, baseRoomH: number) {
  const pos = layoutCircle(names, w, h);
  names.forEach((name) => {
    const existing = nodes.get(name);
    const p = pos.get(name);
    if (!p) return;
    if (!existing) {
      nodes.set(name, {
        name,
        pos: new THREE.Vector2(p.x, p.y),
        vel: new THREE.Vector2(),
        w: baseRoomW,
        h: baseRoomH,
      });
    }
  });
  for (const k of Array.from(nodes.keys())) {
    if (!names.includes(k)) nodes.delete(k);
  }
}

function drawRoom(name: string, state: PlanBuilderState) {
  const node = state.nodes.get(name);
  if (!node) return;
  const p = new THREE.Vector3(node.pos.x, node.pos.y, 0);
  const mesh = new THREE.Mesh(state.shared.roomGeometry, state.shared.roomMaterial);
  mesh.position.copy(p);
  mesh.scale.set(node.w / state.baseRoomW, node.h / state.baseRoomH, 1);
  state.scene.add(mesh);
  state.liveObjects.push(mesh);

  const borderGeo = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-state.baseRoomW / 2, -state.baseRoomH / 2, 0),
    new THREE.Vector3(state.baseRoomW / 2, -state.baseRoomH / 2, 0),
    new THREE.Vector3(state.baseRoomW / 2, state.baseRoomH / 2, 0),
    new THREE.Vector3(-state.baseRoomW / 2, state.baseRoomH / 2, 0),
    new THREE.Vector3(-state.baseRoomW / 2, -state.baseRoomH / 2, 0),
  ]);
  const border = new THREE.Line(borderGeo, state.shared.roomBorderMaterial);
  border.position.copy(p);
  border.scale.set(node.w / state.baseRoomW, node.h / state.baseRoomH, 1);
  state.scene.add(border);
  state.liveObjects.push(border);

  const { sprite, dispose } = makeTextSprite(name);
  sprite.position.set(p.x, p.y, 1);
  state.scene.add(sprite);
  state.liveObjects.push(sprite);
  state.toDispose.push(dispose);
}

function drawEdge(edge: Edge, state: PlanBuilderState, arrows: boolean) {
  const aN = state.nodes.get(edge.from);
  const bN = state.nodes.get(edge.to);
  if (!aN || !bN) return;
  const a = new THREE.Vector3(aN.pos.x, aN.pos.y, 0);
  const b = new THREE.Vector3(bN.pos.x, bN.pos.y, 0);
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  if (len < 1) return;
  dir.normalize();
  const radA = 0.5 * Math.hypot(aN.w, aN.h);
  const radB = 0.5 * Math.hypot(bN.w, bN.h);
  const startEdge = new THREE.Vector3(a.x, a.y, a.z).addScaledVector(dir, Math.max(0, radA));
  const endEdge = new THREE.Vector3(b.x, b.y, b.z).addScaledVector(dir, -Math.max(0, radB));

  if (arrows) {
    const origin = startEdge;
    const headLen = 16;
    const headWidth = 10;
    const shaftLen = Math.max(0, startEdge.distanceTo(endEdge) - 10);
    const arrow = new THREE.ArrowHelper(dir, origin, shaftLen, ARROW_COLOR, headLen, headWidth);
    state.scene.add(arrow);
    state.liveObjects.push(arrow);
  } else {
    const geo = new THREE.BufferGeometry().setFromPoints([startEdge, endEdge]);
    const line = new THREE.Line(geo, state.shared.lineMaterial);
    state.scene.add(line);
    state.liveObjects.push(line);
  }
}

function drawConnections(edges: Edge[], state: PlanBuilderState, arrows: boolean) {
  for (const e of edges) drawEdge(e, state, arrows);
}

function drawGraph(state: PlanBuilderState, edgesIn: Edge[], arrows: boolean) {
  clearLiveObjects(state.scene, state.liveObjects, state.toDispose, state.shared);
  const { w, h } = resizeRendererToPane(state.ui.left, state.renderer, state.camera);

  const names = uniqueRooms(edgesIn);
  updateRoomsList(names, state.ui.roomsList, Boolean(state.ui.right));
  const key = names.join('|');
  if (key !== state.lastNamesKey) {
    updateSizesUi(names, state.ui, state.nodes, state.baseRoomW, state.baseRoomH, state.startSimulation);
    state.lastNamesKey = key;
  }

  if (names.length === 0) {
    state.renderer.render(state.scene, state.camera);
    return;
  }

  ensureNodes(names, state.nodes, w, h, state.baseRoomW, state.baseRoomH);
  for (const name of names) drawRoom(name, state);
  drawConnections(edgesIn, state, arrows);

  state.renderer.render(state.scene, state.camera);
}

function getPointerWorld(ev: PointerEvent, renderer: THREE.WebGLRenderer) {
  const rect = renderer.domElement.getBoundingClientRect();
  const px = ev.clientX - rect.left;
  const py = ev.clientY - rect.top;
  const x = px - rect.width / 2;
  const y = rect.height / 2 - py;
  return new THREE.Vector2(x, y);
}

function pickNodeAt(pt: THREE.Vector2, nodes: Map<string, Node>) {
  let best: Node | null = null;
  let bestArea = Infinity;
  for (const n of nodes.values()) {
    const halfW = n.w / 2;
    const halfH = n.h / 2;
    const within = pt.x >= n.pos.x - halfW && pt.x <= n.pos.x + halfW && pt.y >= n.pos.y - halfH && pt.y <= n.pos.y + halfH;
    if (!within) continue;
    const area = n.w * n.h;
    if (area < bestArea) {
      best = n;
      bestArea = area;
    }
  }
  return best;
}

function createIsConnected(getEdges: () => Edge[]) {
  return (a: string, b: string) => getEdges().some((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));
}

function resolveAabbOverlap(a: Node, b: Node) {
  const halfAx = a.w / 2;
  const halfAy = a.h / 2;
  const halfBx = b.w / 2;
  const halfBy = b.h / 2;
  const dx = b.pos.x - a.pos.x;
  const dy = b.pos.y - a.pos.y;
  const overlapX = halfAx + halfBx - Math.abs(dx);
  const overlapY = halfAy + halfBy - Math.abs(dy);
  if (overlapX > 0 && overlapY > 0) {
    if (overlapX < overlapY) {
      const sx = Math.sign(dx) || 1;
      const push = overlapX / 2;
      a.pos.x -= sx * push;
      b.pos.x += sx * push;
      a.vel.x *= 0.5;
      b.vel.x *= 0.5;
    } else {
      const sy = Math.sign(dy) || 1;
      const push = overlapY / 2;
      a.pos.y -= sy * push;
      b.pos.y += sy * push;
      a.vel.y *= 0.5;
      b.vel.y *= 0.5;
    }
    return true;
  }
  return false;
}

function applyConnectedForce(a: Node, b: Node, ux: number, uy: number, dist: number, dt: number, params: SimulationParams) {
  const ra = 0.5 * Math.hypot(a.w, a.h);
  const rb = 0.5 * Math.hypot(b.w, b.h);
  const target = ra + rb + params.targetGap;
  const diff = dist - target;
  const f = params.attractK * diff;
  a.vel.x += f * ux * dt;
  a.vel.y += f * uy * dt;
  b.vel.x -= f * ux * dt;
  b.vel.y -= f * uy * dt;
}

function applyRepelForce(a: Node, b: Node, ux: number, uy: number, dist: number, dt: number, params: SimulationParams) {
  const f = params.repelK / (dist * dist);
  a.vel.x -= f * ux * dt;
  a.vel.y -= f * uy * dt;
  b.vel.x += f * ux * dt;
  b.vel.y += f * uy * dt;
}

function pairwiseForces(arr: Node[], dt: number, params: SimulationParams, isConnected: (a: string, b: string) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    const a = arr[i];
    for (let j = i + 1; j < arr.length; j++) {
      const b = arr[j];
      const dx = b.pos.x - a.pos.x;
      const dy = b.pos.y - a.pos.y;
      const dist = Math.hypot(dx, dy) || 0.0001;
      const ux = dx / dist;
      const uy = dy / dist;
      if (isConnected(a.name, b.name)) applyConnectedForce(a, b, ux, uy, dist, dt, params);
      else applyRepelForce(a, b, ux, uy, dist, dt, params);
      for (let k = 0; k < 2; k++) {
        if (!resolveAabbOverlap(a, b)) break;
      }
    }
  }
}

function integrateAndCenter(arr: Node[], dt: number, params: SimulationParams) {
  for (const n of arr) {
    n.vel.x += -n.pos.x * params.centerK * dt;
    n.vel.y += -n.pos.y * params.centerK * dt;
    n.vel.x *= params.damping;
    n.vel.y *= params.damping;
    const speed = Math.hypot(n.vel.x, n.vel.y);
    if (speed > params.maxSpeed) {
      const s = params.maxSpeed / Math.max(1e-6, speed);
      n.vel.x *= s;
      n.vel.y *= s;
    }
    n.pos.x += n.vel.x * dt * 60;
    n.pos.y += n.vel.y * dt * 60;
  }
}

function nonOverlappingAndDistancesOk(arr: Node[], params: SimulationParams, isConnected: (a: string, b: string) => boolean) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      const a = arr[i];
      const b = arr[j];
      const halfAx = a.w / 2;
      const halfAy = a.h / 2;
      const halfBx = b.w / 2;
      const halfBy = b.h / 2;
      const dx = Math.abs(b.pos.x - a.pos.x);
      const dy = Math.abs(b.pos.y - a.pos.y);
      if ((halfAx + halfBx - dx) > 0 && (halfAy + halfBy - dy) > 0) return false;
      const dist = Math.hypot(b.pos.x - a.pos.x, b.pos.y - a.pos.y);
      const ra = 0.5 * Math.hypot(a.w, a.h);
      const rb = 0.5 * Math.hypot(b.w, b.h);
      if (isConnected(a.name, b.name)) {
        if (dist > ra + rb + params.targetGap + 4) return false;
      } else if (dist < ra + rb + params.minGap - 4) return false;
    }
  }
  return true;
}

function velocitiesAreSlow(arr: Node[], params: SimulationParams) {
  return arr.every((n) => Math.hypot(n.vel.x, n.vel.y) < params.stopVel);
}

function createSimulationController(state: PlanBuilderState, showArrows: HTMLInputElement | null, drawGraphFn: (edges: Edge[], arrows: boolean) => void) {
  let simRunning = false;
  const getEdges = () => state.edges;
  const isConnected = createIsConnected(getEdges);

  const step = () => {
    const dt = 1 / 60;
    const arr = Array.from(state.nodes.values());
    if (arr.length === 0) {
      stop();
      return;
    }
    pairwiseForces(arr, dt, state.params, isConnected);
    integrateAndCenter(arr, dt, state.params);
    drawGraphFn(state.edges, showArrows ? showArrows.checked : false);
    if (nonOverlappingAndDistancesOk(arr, state.params, isConnected) && velocitiesAreSlow(arr, state.params)) stop();
  };

  const start = () => {
    if (state.opts.preview || simRunning) return;
    simRunning = true;
    state.renderer.setAnimationLoop(step as unknown as XRFrameRequestCallback);
  };

  const stop = () => {
    if (!simRunning) return;
    simRunning = false;
    safely(() => state.renderer.setAnimationLoop(null as unknown as XRFrameRequestCallback));
  };

  const controller: SimulationController = { start, stop, isRunning: () => simRunning };
  return controller;
}

function createPointerDownHandler(state: PlanBuilderState, simulation: SimulationController) {
  return (ev: PointerEvent) => {
    ev.preventDefault();
    const pt = getPointerWorld(ev, state.renderer);
    const target = pickNodeAt(pt, state.nodes);
    if (!target) return;
    state.drag.isDragging = true;
    state.drag.dragNode = target;
    state.drag.dragOffset.set(target.pos.x - pt.x, target.pos.y - pt.y);
    simulation.stop();
    safely(() => (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId));
    state.renderer.domElement.style.cursor = 'grabbing';
  };
}

function createPointerMoveHandler(state: PlanBuilderState, renderCurrent: () => void) {
  return (ev: PointerEvent) => {
    if (state.drag.isDragging && state.drag.dragNode) {
      const pt = getPointerWorld(ev, state.renderer);
      state.drag.dragNode.pos.x = pt.x + state.drag.dragOffset.x;
      state.drag.dragNode.pos.y = pt.y + state.drag.dragOffset.y;
      state.drag.dragNode.vel.set(0, 0);
      renderCurrent();
      return;
    }
    const pt = getPointerWorld(ev, state.renderer);
    const hit = pickNodeAt(pt, state.nodes);
    state.renderer.domElement.style.cursor = hit ? 'grab' : '';
  };
}

function createPointerUpHandler(state: PlanBuilderState, simulation: SimulationController) {
  return (ev: PointerEvent) => {
    if (!state.drag.isDragging) return;
    state.drag.isDragging = false;
    state.drag.dragNode = null;
    safely(() => (ev.currentTarget as HTMLElement).releasePointerCapture(ev.pointerId));
    state.renderer.domElement.style.cursor = '';
    simulation.start();
  };
}

function createPointerHandlers(state: PlanBuilderState, showArrows: HTMLInputElement | null, drawGraphFn: (edges: Edge[], arrows: boolean) => void, simulation: SimulationController) {
  const getArrows = () => showArrows ? showArrows.checked : false;
  const renderCurrent = () => drawGraphFn(state.edges, getArrows());
  const onPointerDown = createPointerDownHandler(state, simulation);
  const onPointerMove = createPointerMoveHandler(state, renderCurrent);
  const onPointerUp = createPointerUpHandler(state, simulation);
  return { onPointerDown, onPointerMove, onPointerUp };
}

function createRefreshHandler(state: PlanBuilderState, drawGraphFn: (edges: Edge[], arrows: boolean) => void) {
  return () => {
    const text = state.ui.edgesArea ? state.ui.edgesArea.value : (state.opts.preview ? DEFAULT_PREVIEW_RELATIONS : '');
    state.edges = parseEdges(text);
    const arrows = state.ui.showArrows ? state.ui.showArrows.checked : false;
    drawGraphFn(state.edges, arrows);
    state.startSimulation();
  };
}

function createResizeHandler(refresh: () => void) {
  return () => refresh();
}

function createAddEdgeHandler(ui: UiElements, refresh: () => void) {
  return () => {
    if (!ui.fromInput || !ui.toInput || !ui.edgesArea) return;
    const f = ui.fromInput.value.trim();
    const t = ui.toInput.value.trim();
    if (!f || !t) return;
    const line = `${f} => ${t}`;
    ui.edgesArea.value = ui.edgesArea.value ? `${ui.edgesArea.value}\n${line}` : line;
    ui.fromInput.value = '';
    ui.toInput.value = '';
    refresh();
  };
}

function createCleanup(state: PlanBuilderState, simulation: SimulationController, handlers: CleanupHandles) {
  return () => {
    if (!state.opts.preview && handlers.resize) window.removeEventListener('resize', handlers.resize);
    state.ui.edgesArea?.removeEventListener('input', handlers.refresh);
    state.ui.showArrows?.removeEventListener('change', handlers.refresh);
    if (handlers.addEdge && state.ui.addBtn) state.ui.addBtn.removeEventListener('click', handlers.addEdge);

    clearLiveObjects(state.scene, state.liveObjects, state.toDispose, state.shared);
    simulation.stop();

    safely(() => state.renderer.dispose());
    safely(() => state.renderer.domElement.remove());
    safely(() => state.shared.roomGeometry.dispose());
    safely(() => state.shared.roomMaterial.dispose());
    safely(() => state.shared.roomBorderMaterial.dispose());
    safely(() => state.shared.lineMaterial.dispose());

    safely(() => state.ui.wrap.remove());
    if (state.opts.preview) safely(() => state.ui.left.remove());
    state.renderer.domElement.style.cursor = '';
    state.renderer.domElement.style.touchAction = '';

    if (!state.opts.preview && handlers.pointer) {
      const { onPointerDown, onPointerMove, onPointerUp } = handlers.pointer;
      state.renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      state.renderer.domElement.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    }
  };
}

function enableFullControls(state: PlanBuilderState, simulation: SimulationController, refresh: () => void, drawGraphFn: (edges: Edge[], arrows: boolean) => void): CleanupHandles {
  const resizeHandler = createResizeHandler(refresh);
  window.addEventListener('resize', resizeHandler);
  state.ui.edgesArea?.addEventListener('input', refresh);
  state.ui.showArrows?.addEventListener('change', refresh);

  let addEdgeHandler: (() => void) | null = null;
  if (state.ui.addBtn) {
    addEdgeHandler = createAddEdgeHandler(state.ui, refresh);
    state.ui.addBtn.addEventListener('click', addEdgeHandler);
  }

  const pointerHandlers = createPointerHandlers(state, state.ui.showArrows, drawGraphFn, simulation);
  state.renderer.domElement.addEventListener('pointerdown', pointerHandlers.onPointerDown);
  state.renderer.domElement.addEventListener('pointermove', pointerHandlers.onPointerMove);
  window.addEventListener('pointerup', pointerHandlers.onPointerUp);
  state.renderer.domElement.style.touchAction = 'none';

  return {
    refresh,
    resize: resizeHandler,
    addEdge: addEdgeHandler,
    pointer: pointerHandlers,
  };
}

function createInitialState(scene: THREE.Scene, renderer: THREE.WebGLRenderer, camera: THREE.OrthographicCamera, shared: SharedResources, ui: UiElements, opts: Options): PlanBuilderState {
  return {
    scene,
    renderer,
    camera,
    nodes: new Map<string, Node>(),
    edges: [],
    liveObjects: [],
    toDispose: [],
    baseRoomW: BASE_ROOM_W,
    baseRoomH: BASE_ROOM_H,
    shared,
    ui,
    lastNamesKey: '',
    drag: { isDragging: false, dragNode: null, dragOffset: new THREE.Vector2() },
    params: {
      centerK: 0.02,
      attractK: 0.02,
      repelK: 2000,
      damping: 0.9,
      maxSpeed: 400,
      targetGap: 40,
      minGap: 20,
      stopVel: 2,
    },
    opts,
    startSimulation: () => { },
  };
}

function runInteractiveMode(state: PlanBuilderState, simulation: SimulationController, refresh: () => void, drawGraphFn: (edges: Edge[], arrows: boolean) => void) {
  const handles = enableFullControls(state, simulation, refresh, drawGraphFn);
  refresh();
  return createCleanup(state, simulation, handles);
}

function runPreviewMode(state: PlanBuilderState, simulation: SimulationController, refresh: () => void) {
  refresh();
  return createCleanup(state, simulation, {
    refresh,
    resize: null,
    addEdge: null,
    pointer: null,
  });
}

// ---------------------------------------------------------------------------
// Main entry: sets up UI, renderer, layout, simulation, and cleanup
// ---------------------------------------------------------------------------

/**
 * Plan Builder – interactive 2D layout of rooms based on simple relations.
 */
export function planBuilder(scene: THREE.Scene, opts: Options = {}) {
  const mount = opts.mount ?? document.getElementById('work') ?? document.body;
  const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
  scene.background = new THREE.Color(bg);

  const ui = createUi(mount, opts);
  const renderer = createRenderer(ui.left);
  const camera = createCamera();
  const shared = createSharedResources();
  const state = createInitialState(scene, renderer, camera, shared, ui, opts);

  const drawGraphFn = (edgesIn: Edge[], arrows: boolean) => drawGraph(state, edgesIn, arrows);
  const simulation = createSimulationController(state, ui.showArrows, drawGraphFn);
  state.startSimulation = () => simulation.start();
  const refresh = createRefreshHandler(state, drawGraphFn);

  if (!opts.preview) return runInteractiveMode(state, simulation, refresh, drawGraphFn);
  return runPreviewMode(state, simulation, refresh);
}

export default planBuilder;
