import * as THREE from 'three';
import { Works } from './data/works';
import { AppConfig, resolveThreeBgFromCss } from './config';

const previewCleanups: Array<() => void> = [];

export function initCardPreviews() {
  Object.entries(Works).forEach(([id, work]) => {
    const el = document.getElementById(`preview-${id}`);
    if (!el) return;
    // Avoid double mount
    if (el.dataset.mounted) return;
    el.dataset.mounted = '1';

    const scene = new THREE.Scene();
    const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
    scene.background = new THREE.Color(bg);
    try {
      const dispose = work.animation(scene, { mount: el, preview: true });
      if (typeof dispose === 'function') previewCleanups.push(dispose);
    } catch (e) {
      // fail gracefully per card
      // eslint-disable-next-line no-console
      console.warn('Preview init failed for', id, e);
    }
  });
}

export function disposeCardPreviews() {
  while (previewCleanups.length) {
    const fn = previewCleanups.pop();
    try { fn && fn(); } catch { /* noop */ }
  }
}
