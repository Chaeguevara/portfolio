import * as THREE from 'three';
import { makeText, disposeText } from '../ui/text';
import type { Text } from 'troika-three-text';
import type { Ctx } from '../types';

export function enter(ctx: Ctx): () => void {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#ffffff' : '#111111';
  const dimColor = isDark ? '#aaaaaa' : '#555555';
  const accentColor = isDark ? '#60b4ff' : '#0070d9';

  const group = new THREE.Group();
  const texts: Text[] = [];

  // Back label
  const back = makeText({ text: '← Back', size: 0.1, color: accentColor, anchorX: 'left', anchorY: 'middle' });
  back.position.set(-2.2, 1.6, 0);
  group.add(back);
  texts.push(back);
  ctx.nav.register(back, () => ctx.go('home'));

  // Heading
  const heading = makeText({ text: 'About', size: 0.2, color: textColor, anchorX: 'center', anchorY: 'middle' });
  heading.position.set(0, 1.6, 0);
  group.add(heading);
  texts.push(heading);

  // Paragraphs
  const paras = ctx.content.about;
  let y = 1.15;
  paras.forEach((para) => {
    const t = makeText({ text: para, size: 0.07, color: dimColor, anchorX: 'center', anchorY: 'top', maxWidth: 4.0 });
    t.position.set(0, y, 0);
    group.add(t);
    texts.push(t);
    // Estimate height: ~0.09 per line at 4 chars/unit
    const lines = Math.ceil(para.length / 60);
    y -= 0.12 * lines + 0.1;
  });

  ctx.scene.add(group);

  // Animate in
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
  };
}
