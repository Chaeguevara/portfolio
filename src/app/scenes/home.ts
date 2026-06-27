import { homePattern } from '../fold/creasePattern';
import { buildFoldMesh } from '../fold/foldEngine';
import { makeText, disposeText } from '../ui/text';
import type { Text } from 'troika-three-text';
import type { Ctx } from '../types';

const LABELS = ['WORKS', 'STUDY', 'ABOUT', 'DESIGNER'] as const;
// Approx center of each quadrant face in flat-state local coords
const CENTERS: [number, number][] = [
  [0.5, 0.5],
  [-0.5, 0.5],
  [-0.5, -0.5],
  [0.5, -0.5],
];

export function enter(ctx: Ctx): () => void {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#ffffff' : '#111111';
  const dimColor = isDark ? '#aaaaaa' : '#555555';

  const pattern = homePattern();
  const foldMesh = buildFoldMesh(pattern, isDark);
  ctx.scene.add(foldMesh.group);

  // Title + tagline above the paper
  const title = makeText({ text: 'Heejin Chae', size: 0.18, color: textColor, anchorX: 'center', anchorY: 'middle' });
  title.position.set(0, 1.45, 0);
  ctx.scene.add(title);

  const tagline = makeText({
    text: 'geometry · folding · code',
    size: 0.08,
    color: dimColor,
    anchorX: 'center',
    anchorY: 'middle',
  });
  tagline.position.set(0, 1.25, 0);
  ctx.scene.add(tagline);

  // Panel labels — children of the fold group so they fold with the paper
  const panelTexts: Text[] = [];
  CENTERS.forEach(([cx, cy], i) => {
    const t = makeText({ text: LABELS[i], size: 0.1, color: textColor, anchorX: 'center', anchorY: 'middle' });
    t.position.set(cx, cy, 0.05);
    foldMesh.group.add(t);
    panelTexts.push(t);
  });

  // Nav: register each panel mesh
  const base = import.meta.env.BASE_URL;
  const handlers: (() => void)[] = [
    () => ctx.go('works'),
    () => { window.location.href = `${base}study`; },
    () => ctx.go('about'),
    () => { window.location.href = `${base}designer`; },
  ];
  foldMesh.panels.forEach((panel, i) => ctx.nav.register(panel, handlers[i]));

  // Animation: fold in over 1.6s, then idle rotation
  const FOLD_DURATION = 1.6;
  const enterTime = performance.now();
  let folded = false;
  let idleStart = 0;

  ctx.frame.fn = (_dt, now) => {
    const elapsed = (now - enterTime) / 1000;
    if (!folded) {
      const t = Math.min(elapsed / FOLD_DURATION, 1);
      foldMesh.setFold(t);
      if (t >= 1) {
        folded = true;
        idleStart = now;
      }
    } else {
      const idle = (now - idleStart) / 1000;
      foldMesh.group.rotation.y = Math.sin(idle * 0.3) * 0.15;
      foldMesh.group.rotation.x = Math.sin(idle * 0.2 + 1) * 0.05;
    }
  };

  return () => {
    ctx.frame.fn = null;
    ctx.scene.remove(foldMesh.group);
    ctx.scene.remove(title);
    ctx.scene.remove(tagline);
    disposeText(title);
    disposeText(tagline);
    panelTexts.forEach(disposeText);
    foldMesh.dispose();
  };
}
