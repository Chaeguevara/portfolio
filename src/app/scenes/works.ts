import * as THREE from 'three';
import { makeText, disposeText } from '../ui/text';
import type { Text } from 'troika-three-text';
import type { Ctx } from '../types';

export function enter(ctx: Ctx): () => void {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#ffffff' : '#111111';
  const dimColor = isDark ? '#888888' : '#666666';
  const accentColor = isDark ? '#60b4ff' : '#0070d9';

  const group = new THREE.Group();
  const texts: Text[] = [];

  // Heading
  const heading = makeText({ text: 'Works', size: 0.2, color: textColor, anchorX: 'center', anchorY: 'middle' });
  heading.position.set(0, 1.6, 0);
  group.add(heading);
  texts.push(heading);

  // Back label
  const back = makeText({ text: '← Back', size: 0.1, color: accentColor, anchorX: 'left', anchorY: 'middle' });
  back.position.set(-2.2, 1.6, 0);
  group.add(back);
  texts.push(back);
  ctx.nav.register(back, () => ctx.go('home'));

  // Work cards
  const works = ctx.content.works;
  const STEP = 0.55;
  const startY = 1.0;

  works.forEach((work, i) => {
    const y = startY - i * STEP;

    const titleT = makeText({ text: work.title, size: 0.13, color: accentColor, anchorX: 'center', anchorY: 'middle', maxWidth: 3.5 });
    titleT.position.set(0, y, 0);
    group.add(titleT);
    texts.push(titleT);

    const bodyT = makeText({ text: work.body, size: 0.07, color: dimColor, anchorX: 'center', anchorY: 'middle', maxWidth: 3.5 });
    bodyT.position.set(0, y - 0.17, 0);
    group.add(bodyT);
    texts.push(bodyT);

    // Invisible hit plane for raycasting
    const hitGeo = new THREE.PlaneGeometry(3.6, 0.42);
    const hitMat = new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide });
    const hitPlane = new THREE.Mesh(hitGeo, hitMat);
    hitPlane.position.set(0, y - 0.085, -0.01);
    group.add(hitPlane);
    ctx.nav.register(hitPlane, () => { window.location.href = work.href; });
  });

  ctx.scene.add(group);

  // Animate in: slide + fade via group position
  const enterTime = performance.now();
  const ANIM_DUR = 0.5;
  group.position.y = -0.3;

  ctx.frame.fn = (_dt, now) => {
    const t = Math.min((now - enterTime) / 1000 / ANIM_DUR, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    group.position.y = -0.3 + 0.3 * ease;
  };

  return () => {
    ctx.frame.fn = null;
    ctx.scene.remove(group);
    texts.forEach(disposeText);
    group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      (m.material as THREE.Material | undefined)?.dispose?.();
    });
  };
}
