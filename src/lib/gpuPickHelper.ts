import * as THREE from 'three';

export class GPUPickHelper {
    pickingTexture: THREE.WebGLRenderTarget;
    pixelBuffer: Uint8Array;

    constructor() {
        // Create a 1x1 pixel render target
        this.pickingTexture = new THREE.WebGLRenderTarget(1, 1);
        this.pickingTexture.texture.minFilter = THREE.NearestFilter;
        this.pickingTexture.texture.magFilter = THREE.NearestFilter;
        this.pickingTexture.texture.generateMipmaps = false;
        // @ts-ignore
        this.pickingTexture.texture.colorSpace = THREE.NoColorSpace; // Ensure linear color space
        this.pixelBuffer = new Uint8Array(4);
    }

    pick(cssPosition: { x: number; y: number }, scene: THREE.Scene, camera: THREE.Camera, renderer: THREE.WebGLRenderer, idToObject: { [key: number]: THREE.Object3D }): THREE.Object3D | null {
        const { pickingTexture, pixelBuffer } = this;

        // set the view offset to represent just a single pixel under the mouse
        const pixelRatio = renderer.getPixelRatio();
        // @ts-ignore
        camera.setViewOffset(
            renderer.getContext().drawingBufferWidth,   // full width
            renderer.getContext().drawingBufferHeight,  // full height
            cssPosition.x * pixelRatio | 0,             // rect x
            cssPosition.y * pixelRatio | 0,             // rect y
            1,                                          // rect width
            1,                                          // rect height
        );

        // render the scene
        renderer.setRenderTarget(pickingTexture);
        renderer.render(scene, camera);
        renderer.setRenderTarget(null);

        // clear the view offset so rendering returns to normal
        // @ts-ignore
        camera.clearViewOffset();

        // read the pixel
        renderer.readRenderTargetPixels(
            pickingTexture,
            0,   // x
            0,   // y
            1,   // width
            1,   // height
            pixelBuffer
        );

        const id =
            (pixelBuffer[0] << 16) |
            (pixelBuffer[1] << 8) |
            (pixelBuffer[2]);

        if (id === 0) return null;

        return idToObject[id] || null;
    }
}
