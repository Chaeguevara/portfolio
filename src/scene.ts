import * as THREE from "three";
import { Works } from "./data/works";
import { AppConfig, resolveThreeBgFromCss } from "./config";

let activeCleanup: (() => void) | null = null;

export function disposeActiveScene() {
  if (activeCleanup) {
    try { activeCleanup(); } catch { /* noop */ }
    activeCleanup = null;
  }
}

const createScene = (path:number) => () => {
  // Dispose any previous scene/renderers/listeners first
  disposeActiveScene();

  const scene = new THREE.Scene();
  const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
  scene.background = new THREE.Color(bg);
  const mount = document.getElementById("work") ?? undefined;
  const run = Works[path] ? Works[path].animation : null;
  if (run){
    const cleanup = run(scene, { mount, preview: false });
    activeCleanup = typeof cleanup === 'function' ? cleanup : null;
  } else {
    activeCleanup = null;
  }
};

export { createScene };
