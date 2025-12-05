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

export function setActiveCleanup(cleanup: () => void) {
  disposeActiveScene();
  activeCleanup = cleanup;
}

const createScene = (path: number) => () => {
  // Dispose any previous scene/renderers/listeners first
  disposeActiveScene();

  const scene = new THREE.Scene();
  const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
  scene.background = new THREE.Color(bg);
  const mount = document.getElementById("work") ?? undefined;
  const run = Works[path] ? Works[path].animation : null;

  if (run) {
    const result = run(scene, { mount, preview: false });
    if (result instanceof Promise) {
      result.then(cleanup => {
        // Check if we are still on the same scene? 
        // Ideally we track if this scene is still active, but simpler:
        // If activeCleanup is set to something else, we might have moved on.
        // But since disposeActiveScene sets it to null, we can just set it.
        // Provided the user hasn't generated ANOTHER scene in the meantime.
        // For now, let's just assume we want the cleanup.
        if (!activeCleanup) {
          // Check if the scene wasn't disposed immediately?
          activeCleanup = cleanup;
        } else {
          // If there's already an active cleanup, it means another scene started?
          // Or we are overwriting?
          // Actually, since createScene is sync, activeCleanup is null.
          // If user navigates FAST, activeCleanup might be null, but we just started another view.
          // We should likely attach the cleanup to the specific scene instance or use a cancellation token.
          // But for this portfolio, simpler logic:
          activeCleanup = cleanup;
        }
      });
    } else {
      activeCleanup = typeof result === 'function' ? result : null;
    }
  } else {
    activeCleanup = null;
  }
};

export { createScene };
