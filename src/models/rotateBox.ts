import * as THREE from "three";
import { createGame } from "../lib/game";

type Options = { mount?: HTMLElement; preview?: boolean };

const rotateBox = (scene:THREE.Scene, opts: Options = {}) =>{
  const container = opts.mount ?? document.getElementById("work") ?? document.body;
  const { clientWidth, clientHeight } = container;
  const camera = new THREE.PerspectiveCamera(
    50,
    (clientWidth || window.innerWidth) / (clientHeight || window.innerHeight),
    0.1,
    1000,
  );

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = opts.preview ? 3 : 5;

  if (!opts.preview) {
    // Use the reusable game loop for non-preview mode
    const game = createGame({ mount: container, scene, camera });
    const spinner = {
      update(dt: number) {
        // rotate at 1 rad/s and 0.8 rad/s respectively
        cube.rotation.x += 1.0 * dt;
        cube.rotation.y += 0.8 * dt;
      },
    };
    game.add(spinner);
    game.start();
    return () => {
      game.remove(spinner);
      game.stop();
      game.dispose();
      try { geometry.dispose(); } catch { /* noop */ }
      try { (material as THREE.Material).dispose(); } catch { /* noop */ }
    };
  }

  // Preview mode: single render, no listeners/loop
  const previewRenderer = new THREE.WebGLRenderer({ antialias: true });
  previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  previewRenderer.setSize(clientWidth || window.innerWidth, clientHeight || window.innerHeight);
  container.appendChild(previewRenderer.domElement);
  previewRenderer.render(scene, camera);
  return () => {
    try { previewRenderer.dispose(); } catch { /* noop */ }
    try { previewRenderer.domElement.remove(); } catch { /* noop */ }
    try { geometry.dispose(); } catch { /* noop */ }
    try { (material as THREE.Material).dispose(); } catch { /* noop */ }
  };
};

export {
  rotateBox
};
