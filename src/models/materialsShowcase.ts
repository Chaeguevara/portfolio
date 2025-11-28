import * as THREE from 'three';
import { resolveThreeBgFromCss } from '../config';
/**
 * Materials Showcase
 *
 * A compact scene that demonstrates several common Three.js material types
 * by rendering a small grid of spheres with different materials applied.
 *
 * Design goals
 * - Self-contained: mounts a renderer to a provided container and returns
 *   a cleanup function that disposes all resources and listeners.
 * - Responsive: sizes using the mount element's client size and updates on resize.
 * - Lightweight previews: in preview mode it renders a single frame (no loop)
 *   and attaches no global listeners.
 *
 * References
 * - Three.js manual (Materials): https://threejs.org/manual/#en/materials
 */

/** Options for materialsShowcase */
type Options = {
  /** Optional container to mount the renderer; defaults to `#work` or document.body */
  mount?: HTMLElement;
  /** If true, render a single static frame with no listeners/animation */
  preview?: boolean;
};

/**
 * Create the materials showcase within the given Scene.
 *
 * @param scene - An existing THREE.Scene to which objects are added.
 * @param opts - Options controlling mount target and preview behavior.
 * @returns A disposer function that tears down listeners, renderer and materials.
 */
export function materialsShowcase(scene: THREE.Scene, opts: Options = {}) {
  const container = resolveContainer(opts);
  const camera = createCamera(container);
  addLights(scene);
  const group = createGroup(scene);
  const geometry = createSphereGeometry();
  const entries = createMaterialEntries();
  const labels = layoutMaterialsGrid(group, geometry, entries);
  const materials = entries.map(e => e.material);

  if (!opts.preview) {
    const renderer = createRenderer(container);
    const removeResize = bindResize(container, camera, renderer);
    const stopLoop = startRotationLoop(renderer, scene, camera, group);
    return () => disposeAll({ renderer, geometry, materials, labels, removeResize, stopLoop });
  }

  const previewRenderer = createRenderer(container);
  singleRender(previewRenderer, scene, camera);
  return () => disposeAll({ renderer: previewRenderer, geometry, materials, labels });
}

function resolveContainer(opts: Options): HTMLElement {
  return opts.mount ?? document.getElementById('work') ?? document.body;
}

function createCamera(container: HTMLElement): THREE.PerspectiveCamera {
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
  camera.position.set(0, 1.5, 6);
  camera.lookAt(0, 0, 0);
  return camera;
}

function addLights(scene: THREE.Scene): void {
  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  const dir = new THREE.DirectionalLight(0xffffff, 1.2);
  dir.position.set(5, 10, 7);
  scene.add(ambient, dir);
}

function createGroup(scene: THREE.Scene): THREE.Group {
  const group = new THREE.Group();
  scene.add(group);
  return group;
}

function createSphereGeometry(): THREE.SphereGeometry {
  return new THREE.SphereGeometry(0.6, 32, 16);
}

type MaterialEntry = { name: string; material: THREE.Material };
function createMaterialEntries(): MaterialEntry[] {
  return [
    { name: 'MeshBasic', material: new THREE.MeshBasicMaterial({ color: 0xff5555 }) },
    { name: 'MeshLambert', material: new THREE.MeshLambertMaterial({ color: 0xff5555 }) },
    { name: 'MeshPhong', material: new THREE.MeshPhongMaterial({ color: 0xff5555, shininess: 0, }) },
    { name: 'MeshPhong-shine 0', material: new THREE.MeshPhongMaterial({ color: 0x5555ff, shininess: 0, }) },
    { name: 'MeshPhong-shine 30', material: new THREE.MeshPhongMaterial({ color: 0x5555ff, shininess: 30, }) },
    { name: 'MeshPhong-shine 150', material: new THREE.MeshPhongMaterial({ color: 0x5555ff, shininess: 150, }) },
    { name: 'MeshStandard', material: new THREE.MeshStandardMaterial({ color: 0xffcc66, roughness: 0.5, metalness: 0.3 }) },
    { name: 'MeshPhysical', material: new THREE.MeshPhysicalMaterial({ color: 0x66ccff, roughness: 0.2, metalness: 0.7, clearcoat: 0.6 }) },
    { name: 'MeshToon', material: new THREE.MeshToonMaterial({ color: 0xcc66ff }) },
  ];
}

type LabelRes = { sprite: THREE.Sprite; texture: THREE.Texture; material: THREE.SpriteMaterial };
function layoutMaterialsGrid(group: THREE.Group, geometry: THREE.SphereGeometry, entries: MaterialEntry[]): LabelRes[] {
  const labels: LabelRes[] = [];
  const spacing = 2.2;
  const cols = 3;
  entries.forEach((entry, i) => {
    const mesh = new THREE.Mesh(geometry, entry.material);
    const r = Math.floor(i / cols);
    const c = i % cols;
    mesh.position.set((c - (cols - 1) / 2) * spacing, (1 - r) * spacing * 0.6, 0);
    group.add(mesh);

    const label = createTextSprite(entry.name);
    label.sprite.position.set(mesh.position.x, mesh.position.y - 0.5, mesh.position.z);
    label.sprite.renderOrder = 10;
    group.add(label.sprite);
    labels.push(label);
  });
  return labels;
}

function createTextSprite(text: string): LabelRes {
  const pad = 6;
  const font = '12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const w = Math.ceil(metrics.width) + pad * 2;
  const h = 20 + pad * 2;
  canvas.width = w; canvas.height = h;
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, w, h);
  ctx.font = font;
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pad, h / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.01 * w, 0.01 * h, 1);
  return { sprite, texture, material };
}

function createRenderer(container: HTMLElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(resolveThreeBgFromCss());
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const w = container.clientWidth || window.innerWidth;
  const h = container.clientHeight || window.innerHeight;
  renderer.setSize(w, h);
  container.appendChild(renderer.domElement);
  return renderer;
}

function bindResize(container: HTMLElement, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer): () => void {
  const onResize = () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', onResize);
  return () => window.removeEventListener('resize', onResize);
}

function startRotationLoop(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, group: THREE.Group): () => void {
  let running = true;
  const animate = () => {
    if (!running) return;
    group.rotation.y += 0.01;
    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(animate as unknown as XRFrameRequestCallback);
  return () => {
    running = false;
    try { renderer.setAnimationLoop(null as unknown as XRFrameRequestCallback); } catch { /* noop */ }
  };
}

function singleRender(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera): void {
  renderer.render(scene, camera);
}

function disposeAll(args: {
  renderer: THREE.WebGLRenderer;
  geometry: THREE.BufferGeometry;
  materials: THREE.Material[];
  labels?: LabelRes[];
  removeResize?: () => void;
  stopLoop?: () => void;
}): void {
  const { renderer, geometry, materials, labels } = args;
  // try { stopLoop && stopLoop(); } catch { /* noop */ }
  // try { removeResize && removeResize(); } catch { /* noop */ }
  try { renderer.dispose(); } catch { /* noop */ }
  try { renderer.domElement.remove(); } catch { /* noop */ }
  try { geometry.dispose(); } catch { /* noop */ }
  for (const m of materials) { try { m.dispose(); } catch { /* noop */ } }
  if (labels) {
    for (const l of labels) {
      try { l.texture.dispose(); } catch { /* noop */ }
      try { l.material.dispose(); } catch { /* noop */ }
      try { l.sprite.removeFromParent(); } catch { /* noop */ }
    }
  }
}
