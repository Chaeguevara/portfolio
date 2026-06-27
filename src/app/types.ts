import type * as THREE from 'three';
import type { NavController } from './ui/raycastNav';
import type { ContentData } from './content';
import type { Route } from './router';

export interface FrameRef {
  fn: ((dt: number, now: number) => void) | null;
}

export interface Ctx {
  scene: THREE.Scene;
  camera: THREE.Camera;
  nav: NavController;
  go: (r: Route) => void;
  content: ContentData;
  frame: FrameRef;
}
