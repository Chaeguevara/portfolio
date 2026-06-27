import * as THREE from 'three';

type Handler = () => void;

interface Registered {
  object: THREE.Object3D;
  onClick: Handler;
  baseScale: THREE.Vector3;
}

export interface NavController {
  register(object: THREE.Object3D, onClick: Handler): void;
  /** Remove all registrations between scene switches. */
  clear(): void;
  update(pointer: THREE.Vector2): void;
  /** Remove DOM event listeners at app teardown. */
  dispose(): void;
}

export function createNav(camera: THREE.Camera, dom: HTMLElement): NavController {
  const raycaster = new THREE.Raycaster();
  let registered: Registered[] = [];
  let hovered: Registered | null = null;

  function findReg(obj: THREE.Object3D): Registered | undefined {
    return registered.find((r) => {
      let o: THREE.Object3D | null = obj;
      while (o) {
        if (o === r.object) return true;
        o = o.parent;
      }
      return false;
    });
  }

  function update(pointer: THREE.Vector2) {
    raycaster.setFromCamera(pointer, camera);
    const hits = raycaster.intersectObjects(registered.map((r) => r.object), true);
    const hitReg = hits.length ? findReg(hits[0].object) : undefined;

    if (hovered && hovered !== hitReg) {
      hovered.object.scale.copy(hovered.baseScale);
      dom.style.cursor = '';
      hovered = null;
    }
    if (hitReg && hitReg !== hovered) {
      hovered = hitReg;
      dom.style.cursor = 'pointer';
      hovered.object.scale.multiplyScalar(1.06);
    }
  }

  function handleClick() {
    if (hovered) hovered.onClick();
  }

  dom.addEventListener('click', handleClick);

  function clear() {
    if (hovered) {
      hovered.object.scale.copy(hovered.baseScale);
      dom.style.cursor = '';
      hovered = null;
    }
    registered = [];
  }

  return {
    register(object, onClick) {
      registered.push({ object, onClick, baseScale: object.scale.clone() });
    },
    clear,
    update,
    dispose() {
      dom.removeEventListener('click', handleClick);
      clear();
    },
  };
}
