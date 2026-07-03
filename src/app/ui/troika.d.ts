declare module 'troika-three-text' {
  import * as THREE from 'three';
  export class Text extends THREE.Mesh {
    text: string;
    fontSize: number;
    color: number | string;
    maxWidth: number;
    anchorX: string | number;
    anchorY: string | number;
    font: string | undefined;
    outlineWidth: number | string;
    outlineColor: number | string;
    fillOpacity: number;
    sync(callback?: () => void): void;
    dispose(): void;
  }
}
