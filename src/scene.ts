/**
 * @fileoverview Scene lifecycle management for Three.js work pages.
 * Handles creation, cleanup, and prevents race conditions during navigation.
 */

import * as THREE from "three";
import { Works } from "./data/works";
import { AppConfig, resolveThreeBgFromCss } from "./config";

/** Current cleanup function for the active scene. */
let activeCleanup: (() => void) | null = null;

/** Token to track the current scene instance (prevents race conditions). */
let currentSceneToken = 0;

/**
 * Disposes the currently active scene and its cleanup function.
 */
export function disposeActiveScene() {
  console.log("[Scene] Disposing active scene");
  if (activeCleanup) {
    try {
      activeCleanup();
      console.log("[Scene] Cleanup successful");
    } catch (e) {
      console.error("[Scene] Cleanup failed", e);
    }
    activeCleanup = null;
  }
}

/**
 * Sets the active cleanup function, disposing any previous one first.
 * @param cleanup - Cleanup function to call on scene disposal.
 */
export function setActiveCleanup(cleanup: () => void) {
  disposeActiveScene();
  activeCleanup = cleanup;
}

/**
 * Factory that creates a scene initializer for a given work path.
 * Uses a token mechanism to prevent stale async cleanups from being set.
 * @param path - Work ID to create scene for.
 */
const createScene = (path: number) => () => {
  console.log(`[Scene] Creating scene for work #${path}`);
  // Dispose any previous scene/renderers/listeners first
  disposeActiveScene();

  // Generate a new token for this scene instance
  const sceneToken = ++currentSceneToken;

  const scene = new THREE.Scene();
  const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
  scene.background = new THREE.Color(bg);
  const mount = document.getElementById("work") ?? undefined;
  const run = Works[path] ? Works[path].animation : null;

  if (run) {
    const result = run(scene, { mount, preview: false });
    if (result instanceof Promise) {
      result.then(cleanup => {
        // Only set cleanup if this scene is still the current one
        if (sceneToken === currentSceneToken) {
          activeCleanup = cleanup;
        } else {
          // Scene changed during async load, dispose immediately
          try { cleanup(); } catch { /* noop */ }
        }
      });
    } else {
      activeCleanup = typeof result === 'function' ? result : null;
    }
  } else {
    activeCleanup = null;
  }
  console.log(`[Scene] Creation complete for work #${path} (Token: ${sceneToken})`);
};

export { createScene };

