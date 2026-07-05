import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { importSVG, type FoldPattern } from '../app/fold/svgImport';
import { createSolver, DEFAULT_PARAMS, type Solver } from '../app/fold/solver';
import { downloadSVG } from '../app/fold/svgExport';
import { importFOLD, exportFOLDText } from '../app/fold/foldFormat';
import { analyzeFlatFoldability } from '../app/fold/foldability';
import { getMaterial, foldCapDeg, capFoldAngles } from '../app/fold/material';
import { selfIntersectionCount } from '../app/fold/collision';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';

/**
 * Origami simulator lab (SPEC B4) — frontend port of origamisimulator.org:
 * SVG/FOLD crease pattern in, compliant fold simulation in 3D; printable SVG
 * or folded FOLD/STL/OBJ out.
 */

const LINE_COLORS: Record<string, number> = { M: 0xd9544d, V: 0x4d7fd9, B: 0x555555 };

interface Loaded {
  pattern: FoldPattern;
  solver: Solver;
  group: THREE.Group;
  geometry: THREE.BufferGeometry;
  name: string;
}

export function initSimulator(): void {
  const mount = document.getElementById('sim-3d');
  if (!mount) return;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  mount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const bg = () =>
    getComputedStyle(document.documentElement).getPropertyValue('--three-bg').trim() || '#111';
  scene.background = new THREE.Color(bg());
  window.addEventListener('theme-changed', () => (scene.background = new THREE.Color(bg())));

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(1.6, 1.6, 2.4);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const d1 = new THREE.DirectionalLight(0xffffff, 1.2);
  d1.position.set(2, 3, 4);
  scene.add(d1);
  const d2 = new THREE.DirectionalLight(0xffffff, 0.5);
  d2.position.set(-3, -2, -4);
  scene.add(d2);

  function resize() {
    const w = mount!.clientWidth || 1;
    const h = mount!.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(mount);
  resize();

  // ---- UI elements ----
  const $ = (id: string) => document.getElementById(id)!;
  const foldSlider = $('fold-slider') as HTMLInputElement;
  const foldVal = $('fold-val');
  const status = $('sim-status');
  const select = $('sim-select') as HTMLSelectElement;
  const upload = $('sim-upload') as HTMLInputElement;
  const substepsInput = $('sim-substeps') as HTMLInputElement;
  const paramInputs = ['axialStiffness', 'creaseStiffness', 'panelStiffness', 'damping'].map(
    (k) => [k, $(`sim-${k}`) as HTMLInputElement] as const,
  );

  let loaded: Loaded | null = null;

  function dispose() {
    if (!loaded) return;
    scene.remove(loaded.group);
    loaded.group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
    loaded = null;
  }

  let materialId = 'paper';
  let lastText = '';
  let lastName = '';

  function loadText(text: string, name: string) {
    lastText = text;
    lastName = name;
    let pattern: FoldPattern;
    try {
      pattern = /\.fold$/i.test(name) ? importFOLD(text) : importSVG(text);
    } catch (e) {
      status.textContent = `import failed: ${(e as Error).message}`;
      return;
    }
    dispose();

    // material/thickness: thick stock can't crease flat → cap fold angles
    const mtl = getMaterial(materialId);
    pattern = capFoldAngles(pattern, foldCapDeg(mtl.thickness));

    const params = { ...DEFAULT_PARAMS };
    for (const [k, input] of paramInputs) params[k as keyof typeof params] = parseFloat(input.value);
    const solver = createSolver(
      { vertices: pattern.vertices, faces: pattern.faces, edges: pattern.edges },
      params,
    );
    // physical validity: mid-fold self-penetration check on the fresh solver, then reset
    let penetrates = false;
    const physChecked = pattern.faces.length <= 1500; // O(faces²) — skip very large patterns
    if (physChecked) {
      solver.setFoldPercent(0.7);
      solver.step(400);
      penetrates = selfIntersectionCount(solver.positions, pattern.faces) > 0;
      solver.reset();
    }
    solver.setFoldPercent(parseFloat(foldSlider.value) / 100);

    // paper mesh: ONE position attribute shared by mesh + line overlays, so a
    // single needsUpdate re-uploads the solver buffer for everything
    const posAttr = new THREE.BufferAttribute(solver.positions, 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', posAttr);
    geometry.setIndex(pattern.faces.flat());
    geometry.computeVertexNormals();
    const group = new THREE.Group();
    group.add(
      new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: new THREE.Color(mtl.color), roughness: 0.9, side: THREE.FrontSide }),
      ),
      new THREE.Mesh(
        geometry,
        new THREE.MeshStandardMaterial({ color: new THREE.Color(mtl.color).multiplyScalar(0.7), roughness: 0.9, side: THREE.BackSide }),
      ),
    );

    // crease overlay per class, sharing the same position buffer
    for (const [kind, color] of Object.entries(LINE_COLORS)) {
      const idx = pattern.edges
        .filter((e) => e.assignment === kind)
        .flatMap((e) => [e.v1, e.v2]);
      if (!idx.length) continue;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', posAttr);
      g.setIndex(idx);
      group.add(
        new THREE.LineSegments(
          g,
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: kind === 'B' ? 0.5 : 0.85 }),
        ),
      );
    }

    scene.add(group);
    loaded = { pattern, solver, group, geometry, name };
    const nV = pattern.vertices.length;
    const nF = pattern.faces.length;
    const warn = pattern.warnings.length ? ` — ${pattern.warnings.join('; ')}` : '';
    // real-world verdict: does this crease pattern fold flat, or form a 3D shell?
    const verdict = analyzeFlatFoldability(pattern).flatFoldable ? ' · flat-foldable ✓' : ' · 3D shell';
    const phys = !physChecked ? '' : penetrates ? ' · ⚠ self-penetrates (needs collision)' : ' · physically clean';
    status.textContent = `${name}: ${nV} vertices, ${nF} triangles${verdict}${phys}${warn}`;
  }

  async function loadURL(url: string, name: string) {
    status.textContent = `loading ${name}…`;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      loadText(await res.text(), name);
    } catch (e) {
      status.textContent = `load failed: ${(e as Error).message}`;
    }
  }

  // ---- wiring ----
  const base = import.meta.env.BASE_URL;
  select.addEventListener('change', () => {
    if (select.value) void loadURL(`${base}patterns/${select.value}`, select.value.split('/').pop()!);
  });
  upload.addEventListener('change', () => {
    const f = upload.files?.[0];
    if (!f) return;
    void f.text().then((t) => loadText(t, f.name));
  });
  foldSlider.addEventListener('input', () => {
    foldVal.textContent = `${foldSlider.value}%`;
    loaded?.solver.setFoldPercent(parseFloat(foldSlider.value) / 100);
  });
  for (const [k, input] of paramInputs) {
    input.addEventListener('change', () => {
      if (!loaded) return;
      loaded.solver.params[k as keyof typeof DEFAULT_PARAMS] = parseFloat(input.value);
      loaded.solver.refresh();
    });
  }
  // Material presets: set stiffness inputs to the stock's values + re-fold with its thickness cap
  const matSelect = document.getElementById('sim-material') as HTMLSelectElement | null;
  matSelect?.addEventListener('change', () => {
    materialId = matSelect.value;
    const mtl = getMaterial(materialId);
    for (const [k, input] of paramInputs) {
      const v = (mtl.solver as Record<string, number>)[k];
      if (v !== undefined) input.value = String(v);
    }
    if (lastText) loadText(lastText, lastName);
  });
  $('sim-reset').addEventListener('click', () => loaded?.solver.reset());
  const saveFile = (data: BlobPart, type: string, filename: string) => {
    const url = URL.createObjectURL(new Blob([data], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  const baseName = () => loaded!.name.replace(/\.(svg|fold)$/i, '');
  $('sim-export').addEventListener('click', () => {
    if (loaded) downloadSVG(loaded.pattern, `${baseName()}-print`);
  });
  $('sim-export-fold').addEventListener('click', () => {
    if (!loaded) return;
    saveFile(
      exportFOLDText(loaded.pattern, loaded.solver.positions),
      'application/json',
      `${baseName()}.fold`,
    );
  });
  $('sim-export-stl').addEventListener('click', () => {
    if (!loaded) return;
    const stl = new STLExporter().parse(new THREE.Mesh(loaded.geometry), { binary: true });
    saveFile(stl, 'model/stl', `${baseName()}.stl`);
  });
  $('sim-export-obj').addEventListener('click', () => {
    if (!loaded) return;
    saveFile(new OBJExporter().parse(new THREE.Mesh(loaded.geometry)), 'text/plain', `${baseName()}.obj`);
  });

  // ---- loop ----
  let frames = 0;
  function loop() {
    requestAnimationFrame(loop);
    if (loaded) {
      const n = Math.max(1, Math.min(200, parseInt(substepsInput.value, 10) || 50));
      loaded.solver.step(n);
      loaded.geometry.attributes.position.needsUpdate = true;
      loaded.geometry.computeVertexNormals();
      if (++frames % 30 === 0) {
        const strainEl = document.getElementById('sim-strain');
        if (strainEl) strainEl.textContent = `${(loaded.solver.strain() * 100).toFixed(2)}%`;
      }
    }
    controls.update();
    renderer.render(scene, camera);
  }
  loop();

  // initial pattern
  void loadURL(`${base}patterns/bases/birdBase.svg`, 'birdBase.svg');
}
