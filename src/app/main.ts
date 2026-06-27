import * as THREE from 'three';
import { initRouter } from './router';
import type { Route } from './router';
import { createNav } from './ui/raycastNav';
import { readContent } from './content';
import { THEME_EVENT } from '../lib/theme';
import { enter as homeEnter } from './scenes/home';
import { enter as worksEnter } from './scenes/works';
import { enter as aboutEnter } from './scenes/about';
import type { Ctx, FrameRef } from './types';

export function boot(): void {
  const canvas = document.getElementById('stage') as HTMLCanvasElement | null;
  if (!canvas) return;

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Camera
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 100);
  camera.position.set(0, 0, 4);

  // Scene
  const scene = new THREE.Scene();
  function updateBackground() {
    const raw = getComputedStyle(document.documentElement).getPropertyValue('--three-bg').trim();
    scene.background = new THREE.Color(raw || '#111111');
  }
  updateBackground();

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(2, 3, 5);
  scene.add(dirLight);

  // Pointer + nav
  const pointer = new THREE.Vector2(9999, 9999); // offscreen initially
  const nav = createNav(camera, canvas);

  canvas.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Frame callback shared with scenes
  const frame: FrameRef = { fn: null };

  // Content from DOM
  const content = readContent();

  // Current scene cleanup
  let cleanup: (() => void) | null = null;
  let currentRoute: Route = 'home';

  // Router stub (replaced after initRouter call, before any go() is invoked)
  let router = { go: (_r: Route) => {} };

  const ctx: Ctx = {
    scene,
    camera,
    nav,
    go: (r) => router.go(r),
    content,
    frame,
  };

  function switchScene(route: Route, _viaHistory: boolean) {
    currentRoute = route;

    // Tear down previous scene
    if (cleanup) {
      cleanup();
      cleanup = null;
    }
    nav.clear();

    // Enter new scene
    switch (route) {
      case 'home':   cleanup = homeEnter(ctx);  break;
      case 'works':  cleanup = worksEnter(ctx); break;
      case 'about':  cleanup = aboutEnter(ctx); break;
    }
  }

  router = initRouter(switchScene);

  // RAF loop
  let last = 0;
  function loop(now: number) {
    requestAnimationFrame(loop);
    const dt = (now - last) / 1000;
    last = now;
    nav.update(pointer);
    if (frame.fn) frame.fn(dt, now);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(loop);

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Theme changes: update background + re-enter current scene
  window.addEventListener(THEME_EVENT, () => {
    updateBackground();
    switchScene(currentRoute, true);
  });
}
