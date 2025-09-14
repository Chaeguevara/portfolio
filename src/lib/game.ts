import * as THREE from 'three';

export interface Updatable {
  update(dt: number, elapsed: number): void;
}

export interface GameOptions {
  mount: HTMLElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  maxDelta?: number; // seconds cap to avoid huge frame jumps
  dprMax?: number;   // clamp device pixel ratio
}

export function createGame(opts: GameOptions) {
  const { mount, scene, camera } = opts;
  const maxDelta = opts.maxDelta ?? 1 / 20; // cap to 50ms
  const dprMax = opts.dprMax ?? 2;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprMax));
  const { clientWidth, clientHeight } = mount;
  renderer.setSize(clientWidth || window.innerWidth, clientHeight || window.innerHeight);
  mount.appendChild(renderer.domElement);

  const updatables = new Set<Updatable>();

  const input = {
    keys: new Set<string>(),
    pointer: { x: 0, y: 0, dx: 0, dy: 0 },
  };

  function onKeyDown(e: KeyboardEvent) { input.keys.add(e.key); }
  function onKeyUp(e: KeyboardEvent) { input.keys.delete(e.key); }
  function onMouseMove(e: MouseEvent) {
    const { x, y } = input.pointer;
    input.pointer.x = e.clientX;
    input.pointer.y = e.clientY;
    input.pointer.dx = input.pointer.x - x;
    input.pointer.dy = input.pointer.y - y;
  }
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('mousemove', onMouseMove);

  function onResize() {
    const w = mount.clientWidth || window.innerWidth;
    const h = mount.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', onResize);

  let running = false;
  let last = performance.now();
  let elapsed = 0;

  function frame(now: number) {
    if (!running) return;
    const dt = Math.min((now - last) / 1000, maxDelta);
    last = now;
    elapsed += dt;
    for (const u of updatables) u.update(dt, elapsed);
    renderer.render(scene, camera);
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    renderer.setAnimationLoop(frame as unknown as XRFrameRequestCallback);
  }

  function stop() {
    if (!running) return;
    running = false;
    try { renderer.setAnimationLoop(null as unknown as XRFrameRequestCallback); } catch { /* noop */ }
  }

  function add(u: Updatable) { updatables.add(u); }
  function remove(u: Updatable) { updatables.delete(u); }

  function dispose() {
    stop();
    window.removeEventListener('resize', onResize);
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('mousemove', onMouseMove);
    try { renderer.dispose(); } catch { /* noop */ }
    try { renderer.domElement.remove(); } catch { /* noop */ }
  }

  return { scene, camera, renderer, input, add, remove, start, stop, dispose };
}

