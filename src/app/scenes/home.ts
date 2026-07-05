import * as THREE from 'three';
import { createJourney } from './foldJourney';
import { makeText, disposeText } from '../ui/text';
import type { Text } from 'troika-three-text';
import type { Ctx } from '../types';

/**
 * Home = one continuous scroll axis (wireframe 2a). The SAME folded-Miura sheet
 * from the intro carries the whole page — there is no separate "nav" object:
 *
 *   0.00–0.26  INTRO   façade → rationalize → develop → fold   (folded-intro)
 *   0.26–0.44  HOME    the folded Miura holds; name + tagline
 *   0.44–0.72  WORKS   the Miura turns; selected works, each a link
 *   0.72–1.00  ABOUT   the Miura turns further; bio + colophon
 *
 * After the fold completes, scrolling keeps rotating that same sheet (same
 * material, lighting, camera language) while room content rides in front of the
 * camera. A crease-pattern minimap (bottom-right) gives wayfinding + the links
 * that aren't works (Study, Designer, Lab).
 */

const INTRO_END = 0.26;
const ROOMS = {
  home: [0.26, 0.44],
  works: [0.44, 0.72],
  about: [0.72, 1.0],
} as const;
const JUMP = { home: 0.35, works: 0.58, about: 0.86 };
const CONTENT_D = 4; // content plane distance in front of the camera

function clamp(x: number, a: number, b: number): number {
  return x < a ? a : x > b ? b : x;
}
function smooth(u: number): number {
  return u * u * u * (u * (u * 6 - 15) + 10);
}
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
/** soft 0→1→0 ramp across [s,e]. */
function bandAlpha(p: number, s: number, e: number, fade = 0.05): number {
  if (p <= s - fade || p >= e + fade) return 0;
  if (p < s) return smooth((p - (s - fade)) / fade);
  if (p > e) return smooth(1 - (p - e) / fade);
  return 1;
}

export function enter(ctx: Ctx): () => void {
  // The folded scene is dark by design (dark fog + bluish rim light), so it reads
  // dark in either theme — content stays light on a forced dark backdrop.
  const textColor = '#f2f3f5';
  const dimColor = '#aab2bf';
  const accent = '#3aa9e6';
  const base = import.meta.env.BASE_URL;
  const persp = ctx.camera as THREE.PerspectiveCamera;
  const content = ctx.content;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- the sheet: one journey for the whole scroll ---------- */
  const journey = createJourney(ctx.scene, ctx.camera);
  const R0 = journey.baseSize;
  const prevBg = ctx.scene.background;
  ctx.scene.background = new THREE.Color(0x0b0c0f);

  /* ---------- room content, on a plane held in front of the camera ---------- */
  const anchor = new THREE.Group();
  anchor.visible = false;
  ctx.scene.add(anchor);
  const homeGroup = new THREE.Group();
  const worksGroup = new THREE.Group();
  const aboutGroup = new THREE.Group();
  anchor.add(homeGroup, worksGroup, aboutGroup);

  const allTexts: Text[] = [];
  function add(group: THREE.Group, t: Text, x: number, y: number): Text {
    t.position.set(x, y, 0);
    group.add(t);
    allTexts.push(t);
    return t;
  }

  // HOME
  add(homeGroup, makeText({ text: 'Heejin Chae', size: 0.3, color: textColor, anchorX: 'center', anchorY: 'middle' }), 0, 0.4);
  add(homeGroup, makeText({ text: 'geometry · folding · code', size: 0.11, color: dimColor, anchorX: 'center', anchorY: 'middle' }), 0, 0.08);
  add(homeGroup, makeText({ text: 'scroll to unfold ↓', size: 0.06, color: accent, anchorX: 'center', anchorY: 'middle' }), 0, -0.26);

  // WORKS
  add(worksGroup, makeText({ text: 'Selected Works', size: 0.18, color: textColor, anchorX: 'center', anchorY: 'middle' }), 0, 1.0);
  const works = content.works.slice(0, 5);
  const workTexts: Text[] = [];
  works.forEach((w, i) => {
    workTexts.push(add(worksGroup, makeText({ text: w.title, size: 0.13, color: dimColor, anchorX: 'center', anchorY: 'middle' }), 0, 0.55 - i * 0.32));
  });

  // ABOUT
  add(aboutGroup, makeText({ text: 'About', size: 0.18, color: textColor, anchorX: 'center', anchorY: 'middle' }), 0, 1.15);
  content.about.slice(0, 2).forEach((para, i) => {
    add(aboutGroup, makeText({ text: para, size: 0.07, color: dimColor, maxWidth: 3.2, anchorX: 'center', anchorY: 'top' }), 0, 0.7 - i * 0.72);
  });
  add(aboutGroup, makeText({ text: 'geometry, rationalized — three.js, no server', size: 0.05, color: accent, anchorX: 'center', anchorY: 'middle' }), 0, -0.95);

  /* ---------- minimap + link chrome (DOM HUD) ---------- */
  const hud = document.createElement('div');
  hud.style.cssText =
    'position:fixed;right:24px;bottom:24px;z-index:3;display:none;flex-direction:column;gap:10px;align-items:flex-end;font-family:Inter,system-ui,sans-serif;';
  const map = document.createElement('div');
  map.style.cssText =
    'display:flex;gap:2px;padding:8px 10px;border-radius:12px;background:rgba(17,19,26,.55);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);';
  const regionEls: Record<string, HTMLElement> = {};
  (['home', 'works', 'about'] as const).forEach((r) => {
    const b = document.createElement('div');
    b.textContent = r.toUpperCase();
    b.style.cssText = 'padding:5px 10px;border-radius:8px;cursor:pointer;font:600 9px "JetBrains Mono",monospace;letter-spacing:.14em;color:#8b93a0;transition:all .25s;';
    b.addEventListener('click', () => goTo(JUMP[r]));
    regionEls[r] = b;
    map.appendChild(b);
  });
  hud.appendChild(map);
  const links = document.createElement('div');
  links.style.cssText = 'display:flex;gap:6px;';
  [
    { label: 'Study', href: `${base}study/` },
    { label: 'Designer', href: `${base}designer/` },
    { label: 'Lab', href: `${base}lab/` },
  ].forEach((l) => {
    const a = document.createElement('a');
    a.href = l.href;
    a.textContent = l.label;
    a.style.cssText =
      'padding:5px 10px;border-radius:8px;background:rgba(17,19,26,.55);border:1px solid rgba(255,255,255,.08);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);color:#c7ccd4;text-decoration:none;font:500 10px "JetBrains Mono",monospace;letter-spacing:.06em;';
    links.appendChild(a);
  });
  hud.appendChild(links);
  document.body.appendChild(hud);
  function setActiveRegion(r: 'home' | 'works' | 'about') {
    (['home', 'works', 'about'] as const).forEach((k) => {
      const on = k === r;
      regionEls[k].style.background = on ? 'rgba(58,169,230,.85)' : 'transparent';
      regionEls[k].style.color = on ? '#0b0c0f' : '#8b93a0';
    });
  }

  /* ---------- scroll driver ---------- */
  let spacer: HTMLDivElement | null = null;
  let manualP = reducedMotion ? JUMP.home : 0;
  const usingScroll = !reducedMotion;
  if (usingScroll) {
    spacer = document.createElement('div');
    spacer.style.cssText = 'width:1px;height:640vh;pointer-events:none;';
    document.body.appendChild(spacer);
    document.body.style.overflow = 'visible';
    window.scrollTo(0, 0);
  }
  function maxScroll() {
    return document.documentElement.scrollHeight - window.innerHeight;
  }
  function currentP(): number {
    if (!usingScroll) return manualP;
    const m = maxScroll();
    return m > 0 ? clamp(window.scrollY / m, 0, 1) : 0;
  }
  function goTo(p: number) {
    if (usingScroll) window.scrollTo({ top: p * maxScroll(), behavior: 'smooth' });
    else manualP = p;
  }

  /* ---------- room helpers ---------- */
  let worksRegistered = false;
  function setWorksNav(on: boolean) {
    if (on === worksRegistered) return;
    if (on) workTexts.forEach((t, i) => ctx.nav.register(t, () => { window.location.href = works[i].href; }));
    else ctx.nav.clear();
    worksRegistered = on;
  }
  function fadeGroup(group: THREE.Group, alpha: number) {
    group.visible = alpha > 0.01;
    group.children.forEach((c) => {
      const t = c as Text;
      if (t.fillOpacity !== undefined) t.fillOpacity = alpha;
    });
  }
  const fwd = new THREE.Vector3();
  function placeContentInFront() {
    persp.getWorldDirection(fwd);
    anchor.position.copy(persp.position).addScaledVector(fwd, CONTENT_D);
    anchor.quaternion.copy(persp.quaternion);
  }

  ctx.frame.fn = () => {
    const p = currentP();
    const inIntro = usingScroll && p < INTRO_END;

    if (inIntro) {
      journey.setChrome(true);
      journey.update(clamp(p / INTRO_END, 0, 1));
      anchor.visible = false;
      setWorksNav(false);
      hud.style.display = 'none';
      return;
    }

    // rooms: hold the folded Miura, take over the camera, layer content in front
    journey.setChrome(false);
    journey.hold();
    hud.style.display = 'flex';
    anchor.visible = true;

    const q = clamp((p - INTRO_END) / (1 - INTRO_END), 0, 1);
    // camera continues from the intro's final key (r .85·base, az 42°, el 17°),
    // then keeps turning the sheet as you scroll — same language, no cut.
    persp.fov = 42;
    const R = R0 * lerp(0.85, 1.02, q);
    const az = ((42 - q * 74) * Math.PI) / 180;
    const el = ((17 + q * 20) * Math.PI) / 180;
    persp.position.set(R * Math.cos(el) * Math.sin(az), R * Math.sin(el), R * Math.cos(el) * Math.cos(az));
    persp.lookAt(0, 0, 0);
    persp.updateProjectionMatrix();

    placeContentInFront();
    const aHome = bandAlpha(p, ROOMS.home[0], ROOMS.home[1]);
    const aWorks = bandAlpha(p, ROOMS.works[0], ROOMS.works[1]);
    const aAbout = bandAlpha(p, ROOMS.about[0], ROOMS.about[1]);
    fadeGroup(homeGroup, aHome);
    fadeGroup(worksGroup, aWorks);
    fadeGroup(aboutGroup, aAbout);
    setWorksNav(aWorks > 0.5);
    setActiveRegion(aAbout > 0.4 ? 'about' : aWorks > 0.4 ? 'works' : 'home');
  };

  return () => {
    ctx.frame.fn = null;
    setWorksNav(false);
    journey.dispose();
    spacer?.remove();
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    hud.remove();
    ctx.scene.remove(anchor);
    allTexts.forEach(disposeText);
    ctx.scene.background = prevBg;
    persp.position.set(0, 0, 4);
    persp.lookAt(0, 0, 0);
  };
}
