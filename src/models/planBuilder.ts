import * as THREE from 'three';
import { AppConfig, resolveThreeBgFromCss } from '../config';

type Options = { mount?: HTMLElement; preview?: boolean };

type Edge = { from: string; to: string };

function parseEdges(input: string): Edge[] {
  return input
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^(.+?)\s*=>\s*(.+)$/);
      if (!m) return null;
      const from = m[1].trim();
      const to = m[2].trim();
      if (!from || !to) return null;
      return { from, to } as Edge;
    })
    .filter((e): e is Edge => !!e);
}

function uniqueRooms(edges: Edge[]): string[] {
  const set = new Set<string>();
  for (const e of edges) {
    set.add(e.from);
    set.add(e.to);
  }
  return Array.from(set);
}

function layoutCircle(labels: string[], w: number, h: number) {
  const cx = 0;
  const cy = 0;
  const r = Math.max(60, Math.min(w, h) * 0.35);
  const angleStep = (Math.PI * 2) / Math.max(1, labels.length);
  const map = new Map<string, THREE.Vector3>();
  labels.forEach((name, i) => {
    const a = i * angleStep - Math.PI / 2; // start top
    map.set(name, new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 0));
  });
  return map;
}

function makeTextSprite(text: string, color = '#111', bg = 'rgba(255,255,255,0.9)') {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const pad = 8;
  ctx.font = '14px system-ui, sans-serif';
  const metrics = ctx.measureText(text);
  const w = Math.ceil(metrics.width + pad * 2);
  const h = 22 + pad * 2;
  canvas.width = w * 2; // high DPI
  canvas.height = h * 2;
  ctx.scale(2, 2);
  // bg with rounded rect
  ctx.fillStyle = bg;
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  const r = 6;
  const x = 0.5, y = 0.5, rw = w - 1, rh = h - 1;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + rw - r, y);
  ctx.quadraticCurveTo(x + rw, y, x + rw, y + r);
  ctx.lineTo(x + rw, y + rh - r);
  ctx.quadraticCurveTo(x + rw, y + rh, x + rw - r, y + rh);
  ctx.lineTo(x + r, y + rh);
  ctx.quadraticCurveTo(x, y + rh, x, y + rh - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // text
  ctx.fillStyle = color;
  ctx.font = '14px system-ui, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pad, h / 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 2;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  // scale so that 1 unit ~ 1 pixel with our ortho setup
  sprite.scale.set(w, h, 1);
  return { sprite, dispose: () => { try { tex.dispose(); } catch {} try { mat.dispose(); } catch {} } };
}

export function planBuilder(scene: THREE.Scene, opts: Options = {}) {
  const mount = opts.mount ?? document.getElementById('work') ?? document.body;
  const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
  scene.background = new THREE.Color(bg);

  // Build split UI inside mount
  const wrap = document.createElement('div');
  wrap.className = 'plan-wrap';
  const left = document.createElement('div');
  left.className = 'plan-canvas';
  const right = document.createElement('div');
  right.className = 'plan-controls';
  wrap.appendChild(left);
  wrap.appendChild(right);
  mount.appendChild(wrap);

  // Controls: textarea for edges, add form, toggle arrows, and sizes editor
  right.innerHTML = `
    <div class="plan-controls-inner">
      <h3 class="h5">Room Relations</h3>
      <div class="form-row">
        <input type="text" id="from" placeholder="from (e.g. living)" />
        <span>⇒</span>
        <input type="text" id="to" placeholder="to (e.g. room1)" />
        <button id="addEdge" aria-label="Add relation">Add</button>
      </div>
      <label class="toggle"><input type="checkbox" id="showArrows" checked/> Show arrows</label>
      <textarea id="edges" spellcheck="false" placeholder="Enter relations, one per line: room1 => room2"></textarea>
      <small class="hint">Format: name => name. Updates live.</small>
      <div id="roomsList" class="rooms-list" aria-live="polite"></div>
      <div id="sizes" class="rooms-sizes">
        <h4 class="h6">Room Sizes</h4>
        <div id="sizesList"></div>
      </div>
    </div>
  `;

  const edgesArea = right.querySelector<HTMLTextAreaElement>('#edges')!;
  const showArrows = right.querySelector<HTMLInputElement>('#showArrows')!;
  const fromInput = right.querySelector<HTMLInputElement>('#from')!;
  const toInput = right.querySelector<HTMLInputElement>('#to')!;
  const addBtn = right.querySelector<HTMLButtonElement>('#addEdge')!;
  const roomsList = right.querySelector<HTMLDivElement>('#roomsList')!;
  const sizesList = right.querySelector<HTMLDivElement>('#sizesList')!;

  // Seed with a couple of examples (preview uses different seed)
  if (!opts.preview) {
    edgesArea.value = 'living room => room1\nroom1 => room2';
  }

  // Three.js renderer + camera for left pane
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  left.appendChild(renderer.domElement);

  const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
  camera.position.set(0, 0, 10);
  camera.lookAt(0, 0, 0);

  // Shared resources
  const baseRoomW = 80;
  const baseRoomH = 50;
  const roomGeometry = new THREE.PlaneGeometry(baseRoomW, baseRoomH);
  const roomMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
  const roomBorderMaterial = new THREE.LineBasicMaterial({ color: 0x111111 });
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0x2979ff });
  const arrowColor = 0xff7043;

  const toDispose: Array<() => void> = [];
  const liveObjects: THREE.Object3D[] = [];

  type Node = { name: string; pos: THREE.Vector2; vel: THREE.Vector2; w: number; h: number };
  const nodes = new Map<string, Node>();
  let edges: Edge[] = [];
  let simRunning = false;

  function disposeObject3D(obj: THREE.Object3D) {
    // depth-first dispose
    for (const child of [...obj.children]) disposeObject3D(child);
    // Do NOT dispose shared geometry/materials reused across frames
    const geo = (obj as any).geometry as THREE.BufferGeometry | undefined;
    if (geo && typeof geo.dispose === 'function' && geo !== roomGeometry) {
      try { geo.dispose(); } catch {}
    }
    const matAny = (obj as any).material as THREE.Material | THREE.Material[] | undefined;
    if (matAny) {
      if (Array.isArray(matAny)) {
        matAny.forEach((m) => { if (m !== roomMaterial && m !== roomBorderMaterial && m !== lineMaterial) { try { m.dispose(); } catch {} } });
      } else if (matAny !== roomMaterial && matAny !== roomBorderMaterial && matAny !== lineMaterial) {
        try { matAny.dispose(); } catch {}
      }
    }
  }

  function clearLive() {
    for (const obj of liveObjects) {
      try { scene.remove(obj); } catch {}
      disposeObject3D(obj);
    }
    liveObjects.length = 0;
    // labels and arrows use extra disposers registered in toDispose
    while (toDispose.length) { const d = toDispose.pop(); try { d && d(); } catch {} }
  }

  function updateRoomsList(names: string[]) {
    roomsList.innerHTML = names.map((n) => `<span class="pill">${n}</span>`).join(' ');
  }

  function updateSizesUI(names: string[]) {
    const frag = document.createDocumentFragment();
    names.forEach((name) => {
      const node = nodes.get(name);
      const w = node?.w ?? baseRoomW;
      const h = node?.h ?? baseRoomH;
      const row = document.createElement('div');
      row.className = 'size-row';
      row.innerHTML = `
        <label>${name}</label>
        <input type="number" min="20" step="1" value="${Math.round(w)}" data-room="${name}" data-k="w" aria-label="${name} width" />
        ×
        <input type="number" min="20" step="1" value="${Math.round(h)}" data-room="${name}" data-k="h" aria-label="${name} height" />
        <span class="unit">px</span>`;
      frag.appendChild(row);
    });
    sizesList.innerHTML = '';
    sizesList.appendChild(frag);
    sizesList.querySelectorAll('input[type="number"]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const el = inp as HTMLInputElement;
        const room = el.getAttribute('data-room')!;
        const k = el.getAttribute('data-k') as 'w' | 'h';
        const v = Math.max(20, Number(el.value) || (k === 'w' ? baseRoomW : baseRoomH));
        const node = nodes.get(room);
        if (node) { (node as any)[k] = v; }
        startSimulation();
      });
    });
  }

  let lastNamesKey = '';
  function drawGraph(edgesIn: Edge[], arrows: boolean) {
    clearLive();
    const { clientWidth: wIn, clientHeight: hIn } = left;
    const w = wIn || left.getBoundingClientRect().width || 640;
    const h = hIn || left.getBoundingClientRect().height || 360;
    // resize renderer and camera to pane size
    renderer.setSize(w, h);
    camera.left = -w / 2; camera.right = w / 2; camera.top = h / 2; camera.bottom = -h / 2;
    camera.updateProjectionMatrix();

    const names = uniqueRooms(edgesIn);
    updateRoomsList(names);
    const key = names.join('|');
    if (key !== lastNamesKey) {
      updateSizesUI(names);
      lastNamesKey = key;
    }
    if (names.length === 0) {
      renderer.render(scene, camera);
      return;
    }

    // Initialize or preserve node positions
    const pos = layoutCircle(names, w, h);
    names.forEach((name) => {
      const existing = nodes.get(name);
      const p = pos.get(name)!;
      if (!existing) {
        nodes.set(name, { name, pos: new THREE.Vector2(p.x, p.y), vel: new THREE.Vector2(), w: baseRoomW, h: baseRoomH });
      }
    });
    for (const k of Array.from(nodes.keys())) {
      if (!names.includes(k)) nodes.delete(k);
    }

    // Draw rooms (plane + border + label)
    for (const name of names) {
      const node = nodes.get(name)!;
      const p = new THREE.Vector3(node.pos.x, node.pos.y, 0);
      const mesh = new THREE.Mesh(roomGeometry, roomMaterial);
      mesh.position.copy(p);
      mesh.scale.set(node.w / baseRoomW, node.h / baseRoomH, 1);
      scene.add(mesh);
      liveObjects.push(mesh);

      const borderGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-baseRoomW/2, -baseRoomH/2, 0), new THREE.Vector3(baseRoomW/2, -baseRoomH/2, 0),
        new THREE.Vector3(baseRoomW/2, baseRoomH/2, 0), new THREE.Vector3(-baseRoomW/2, baseRoomH/2, 0), new THREE.Vector3(-baseRoomW/2, -baseRoomH/2, 0)
      ]);
      const border = new THREE.Line(borderGeo, roomBorderMaterial);
      border.position.copy(p);
      border.scale.set(node.w / baseRoomW, node.h / baseRoomH, 1);
      scene.add(border);
      liveObjects.push(border);

      const { sprite, dispose } = makeTextSprite(name);
      sprite.position.set(p.x, p.y, 1);
      scene.add(sprite);
      liveObjects.push(sprite);
      toDispose.push(dispose);
    }

    // Draw connections
    for (const e of edgesIn) {
      const aN = nodes.get(e.from);
      const bN = nodes.get(e.to);
      const a = aN ? new THREE.Vector3(aN.pos.x, aN.pos.y, 0) : undefined;
      const b = bN ? new THREE.Vector3(bN.pos.x, bN.pos.y, 0) : undefined;
      if (!a || !b) continue;
      const dir = new THREE.Vector3().subVectors(b, a);
      const len = dir.length();
      if (len < 1) continue;
      dir.normalize();

      const radA = aN ? 0.5 * Math.hypot(aN.w, aN.h) : 0;
      const radB = bN ? 0.5 * Math.hypot(bN.w, bN.h) : 0;
      // Offset start and end to the edges of boxes for visual clarity
      const startEdge = new THREE.Vector3(a.x, a.y, a.z).addScaledVector(dir, Math.max(0, radA));
      const endEdge = new THREE.Vector3(b.x, b.y, b.z).addScaledVector(dir, -Math.max(0, radB));
      if (arrows) {
        const origin = startEdge;
        const headLen = 16;
        const headWidth = 10;
        const shaftLen = Math.max(0, startEdge.distanceTo(endEdge) - 10); // keep a small gap for head
        const arrow = new THREE.ArrowHelper(dir, origin, shaftLen, arrowColor, headLen, headWidth);
        scene.add(arrow);
        liveObjects.push(arrow);
      } else {
        const start = startEdge;
        const end = endEdge;
        const geo = new THREE.BufferGeometry().setFromPoints([start, end]);
        const line = new THREE.Line(geo, lineMaterial);
        scene.add(line);
        liveObjects.push(line);
      }
    }

    renderer.render(scene, camera);
  }

  // Events
  function refresh() {
    edges = parseEdges(edgesArea.value);
    drawGraph(edges, showArrows.checked);
    startSimulation();
  }

  function onResize() { refresh(); }
  if (!opts.preview) window.addEventListener('resize', onResize);
  edgesArea.addEventListener('input', refresh);
  showArrows.addEventListener('change', refresh);
  addBtn.addEventListener('click', () => {
    const f = fromInput.value.trim();
    const t = toInput.value.trim();
    if (!f || !t) return;
    const line = `${f} => ${t}`;
    edgesArea.value = edgesArea.value ? `${edgesArea.value}\n${line}` : line;
    fromInput.value = '';
    toInput.value = '';
    refresh();
  });

  // Initial draw
  if (opts.preview) {
    edgesArea.value = 'A => B\nB => C';
    showArrows.checked = false;
  }
  refresh();

  // --- Physics simulation (force-directed) ---
  function isConnected(a: string, b: string) {
    return edges.some((e) => (e.from === a && e.to === b) || (e.from === b && e.to === a));
  }

  function startSimulation() {
    if (opts.preview) return; // keep preview light
    if (simRunning) return;
    simRunning = true;
    renderer.setAnimationLoop(step as unknown as XRFrameRequestCallback);
  }

  function stopSimulation() {
    simRunning = false;
    try { renderer.setAnimationLoop(null as unknown as XRFrameRequestCallback); } catch { /* noop */ }
  }

  const params = {
    centerK: 0.02,
    attractK: 0.02,
    repelK: 2000,
    damping: 0.9,
    maxSpeed: 400,
    targetGap: 40,
    minGap: 20,
    stopVel: 2,
  };

  function resolveAabbOverlap(a: Node, b: Node) {
    // Minimal translation vector for axis-aligned rectangles
    const halfAx = a.w / 2, halfAy = a.h / 2;
    const halfBx = b.w / 2, halfBy = b.h / 2;
    const dx = b.pos.x - a.pos.x;
    const dy = b.pos.y - a.pos.y;
    const overlapX = halfAx + halfBx - Math.abs(dx);
    const overlapY = halfAy + halfBy - Math.abs(dy);
    if (overlapX > 0 && overlapY > 0) {
      if (overlapX < overlapY) {
        const sx = Math.sign(dx) || 1;
        const push = overlapX / 2;
        a.pos.x -= sx * push;
        b.pos.x += sx * push;
        // damp velocities along axis to reduce jitter
        a.vel.x *= 0.5; b.vel.x *= 0.5;
      } else {
        const sy = Math.sign(dy) || 1;
        const push = overlapY / 2;
        a.pos.y -= sy * push;
        b.pos.y += sy * push;
        a.vel.y *= 0.5; b.vel.y *= 0.5;
      }
      return true;
    }
    return false;
  }

  function step() {
    const dt = 1 / 60;
    const arr = Array.from(nodes.values());
    if (arr.length === 0) {
      stopSimulation();
      return;
    }

    // Pairwise forces
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      for (let j = i + 1; j < arr.length; j++) {
        const b = arr[j];
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;
        let dist = Math.hypot(dx, dy) || 0.0001;
        const ux = dx / dist, uy = dy / dist;
        if (isConnected(a.name, b.name)) {
          // Spring attraction toward a distance roughly proportional to box sizes
          const ra = 0.5 * Math.hypot(a.w, a.h);
          const rb = 0.5 * Math.hypot(b.w, b.h);
          const target = ra + rb + params.targetGap;
          const diff = dist - target;
          const f = params.attractK * diff;
          a.vel.x += f * ux * dt; a.vel.y += f * uy * dt;
          b.vel.x -= f * ux * dt; b.vel.y -= f * uy * dt;
        } else {
          // Inverse-square repulsion
          const f = params.repelK / (dist * dist);
          a.vel.x -= f * ux * dt; a.vel.y -= f * uy * dt;
          b.vel.x += f * ux * dt; b.vel.y += f * uy * dt;
        }

        // Always resolve AABB overlap to react to sudden size changes
        for (let k = 0; k < 2; k++) { // a couple iterations improves stability
          if (!resolveAabbOverlap(a, b)) break;
        }
      }
    }

    // Centering + integrate
    for (const n of arr) {
      n.vel.x += -n.pos.x * params.centerK * dt;
      n.vel.y += -n.pos.y * params.centerK * dt;
      n.vel.x *= params.damping; n.vel.y *= params.damping;
      const speed = Math.hypot(n.vel.x, n.vel.y);
      if (speed > params.maxSpeed) {
        const s = params.maxSpeed / Math.max(1e-6, speed);
        n.vel.x *= s; n.vel.y *= s;
      }
      n.pos.x += n.vel.x * dt * 60;
      n.pos.y += n.vel.y * dt * 60;
    }

    // Redraw
    drawGraph(edges, showArrows.checked);

    // Stop when non-overlapping and distances ok and velocity small
    let okDistances = true;
    for (let i = 0; i < arr.length && okDistances; i++) {
      for (let j = i + 1; j < arr.length && okDistances; j++) {
        const a = arr[i], b = arr[j];
        // Require no overlap in AABB sense
        const halfAx = a.w / 2, halfAy = a.h / 2;
        const halfBx = b.w / 2, halfBy = b.h / 2;
        const dx = Math.abs(b.pos.x - a.pos.x);
        const dy = Math.abs(b.pos.y - a.pos.y);
        const overlapX = halfAx + halfBx - dx;
        const overlapY = halfAy + halfBy - dy;
        const overlapping = overlapX > 0 && overlapY > 0;
        if (overlapping) { okDistances = false; break; }
        // Also ensure rough distance constraint similar to before
        const dist = Math.hypot(b.pos.x - a.pos.x, b.pos.y - a.pos.y);
        const ra = 0.5 * Math.hypot(a.w, a.h);
        const rb = 0.5 * Math.hypot(b.w, b.h);
        if (isConnected(a.name, b.name)) {
          const target = ra + rb + params.targetGap;
          if (dist > target + 4) okDistances = false;
        } else {
          const minSep = ra + rb + params.minGap;
          if (dist < minSep - 4) okDistances = false;
        }
      }
    }
    const slow = arr.every((n) => Math.hypot(n.vel.x, n.vel.y) < params.stopVel);
    if (okDistances && slow) stopSimulation();
  }

  return () => {
    if (!opts.preview) window.removeEventListener('resize', onResize);
    edgesArea.removeEventListener('input', refresh);
    showArrows.removeEventListener('change', refresh);
    try { addBtn.replaceWith(addBtn.cloneNode(true)); } catch { /* noop */ }
    clearLive();
    stopSimulation();
    try { renderer.dispose(); } catch {}
    try { renderer.domElement.remove(); } catch {}
    try { roomGeometry.dispose(); } catch {}
    try { roomMaterial.dispose(); } catch {}
    try { roomBorderMaterial.dispose(); } catch {}
    try { lineMaterial.dispose(); } catch {}
    try { wrap.remove(); } catch {}
  };
}

export default planBuilder;
