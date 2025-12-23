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
/** Current active scene instance. */
let activeScene: THREE.Scene | null = null;

// Listen for theme changes to update active scene background
window.addEventListener('theme-changed', () => {
  if (activeScene) {
    const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
    activeScene.background = new THREE.Color(bg);
  }
});


/**
 * Disposes the currently active scene and its cleanup function.
 */
export function disposeActiveScene() {
  activeScene = null; // Clear reference
  if (activeCleanup) {
    try {
      activeCleanup();
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
  // Note: we can't easily capture the scene here if it wasn't captured in createScene
  // But setActiveCleanup is mostly used by About page which manages its own scene.
}

/**
 * Factory that creates a scene initializer for a given work path.
 * Uses a token mechanism to prevent stale async cleanups from being set.
 * @param path - Work ID to create scene for.
 */
const createScene = (path: number) => () => {
  // Dispose any previous scene/renderers/listeners first
  disposeActiveScene();

  // Generate a new token for this scene instance
  const sceneToken = ++currentSceneToken;

  const scene = new THREE.Scene();
  activeScene = scene; // Track active scene

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
};

export { createScene };

