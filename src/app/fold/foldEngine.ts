import * as THREE from 'three';
import type { CreasePattern } from './creasePattern';

export interface FoldMesh {
  group: THREE.Group;
  /** Per-face panel meshes, index-aligned with pattern.faces (for nav picking). */
  panels: THREE.Mesh[];
  /** Crease line objects, index-aligned with pattern.creases (for draw-in FX). */
  creaseLines: THREE.Line[];
  /** t in [0,1]: 0 = flat sheet, 1 = folded. */
  setFold(t: number): void;
  dispose(): void;
}

const PAPER_LIGHT = 0xf4f1ea;
const PAPER_DARK = 0x2a2a30;
const MOUNTAIN = 0xd9544d; // origami convention: mountain = red
const VALLEY = 0x4d7fd9; //                     valley   = blue

/**
 * Build the foldable paper. The home pattern's interior vertex sits at the
 * origin, so every folding crease passes through (0,0,0) and each face can hinge
 * about its leading spoke via a pivot group at the origin.
 *
 * ponytail: single-vertex petal fold — each face rotates about one bounding
 * spoke by a fixed dihedral schedule. Visually a fold; not the exact spherical
 * 4-bar kinematics. Upgrade path: solve the degree-4 linkage if real rigid
 * motion is needed (see rigid-origami.md).
 */
export function buildFoldMesh(p: CreasePattern, dark = false): FoldMesh {
  const group = new THREE.Group();
  const panels: THREE.Mesh[] = [];
  const pivots: { pivot: THREE.Group; axis: THREE.Vector3; angle: number }[] = [];
  const paperColor = dark ? PAPER_DARK : PAPER_LIGHT;

  p.faces.forEach((ring) => {
    // Flat quad geometry from the face's vertex ring (triangle fan).
    const pos: number[] = [];
    for (let i = 1; i < ring.length - 1; i++) {
      for (const idx of [ring[0], ring[i], ring[i + 1]]) {
        const v = p.vertices[idx];
        pos.push(v.x, v.y, 0);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({
      color: paperColor,
      roughness: 0.85,
      metalness: 0.0,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geo, mat);

    // Hinge: rotate the face about its leading spoke (ring[0]=center → ring[1]).
    const center = p.vertices[ring[0]];
    const lead = p.vertices[ring[1]];
    const axis = new THREE.Vector3(lead.x - center.x, lead.y - center.y, 0).normalize();
    // Alternate fold direction so it reads as a real pinwheel fold.
    const sign = panels.length % 2 === 0 ? 1 : -1;

    const pivot = new THREE.Group();
    pivot.add(mesh);
    group.add(pivot);
    panels.push(mesh);
    pivots.push({ pivot, axis, angle: sign * THREE.MathUtils.degToRad(115) });
  });

  // Crease lines, colored by mountain/valley assignment (the theory, made visible).
  const creaseGroup = new THREE.Group();
  const creaseLines: THREE.Line[] = [];
  for (const c of p.creases) {
    const a = p.vertices[c.v1];
    const b = p.vertices[c.v2];
    const color = c.assignment === 'M' ? MOUNTAIN : c.assignment === 'V' ? VALLEY : 0x999999;
    const g = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(a.x, a.y, 0.002),
      new THREE.Vector3(b.x, b.y, 0.002),
    ]);
    const line = new THREE.Line(
      g,
      new THREE.LineBasicMaterial({ color, transparent: true, opacity: c.assignment === 'B' ? 0.3 : 0.9 }),
    );
    creaseGroup.add(line);
    creaseLines.push(line);
  }
  group.add(creaseGroup);

  const q = new THREE.Quaternion();
  function setFold(t: number) {
    const e = THREE.MathUtils.smoothstep(t, 0, 1);
    for (const { pivot, axis, angle } of pivots) {
      pivot.quaternion.copy(q.setFromAxisAngle(axis, angle * e));
    }
    // Crease lines fade as the paper folds (they live in the flat plane).
    creaseGroup.visible = e < 0.85;
    creaseGroup.traverse((o) => {
      const m = (o as THREE.Line).material as THREE.LineBasicMaterial | undefined;
      if (m && 'opacity' in m) m.opacity = (1 - e) * 0.9;
    });
  }
  setFold(0);

  function dispose() {
    group.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose?.();
    });
  }

  return { group, panels, creaseLines, setFold, dispose };
}
