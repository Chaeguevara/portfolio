/**
 * @fileoverview Scene setup utilities for OSM City Builder.
 * Handles camera, renderer, controls, and lighting.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export interface SceneComponents {
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    ground: THREE.Mesh;
    axesHelper: THREE.AxesHelper;
}

/**
 * Create and configure orthographic camera for isometric view.
 */
export function createCamera(mount: HTMLElement): THREE.OrthographicCamera {
    const aspect = mount.clientWidth / mount.clientHeight;
    const frustumSize = 600;
    const camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,
        10000
    );
    camera.position.set(400, 400, 400);
    camera.lookAt(0, 0, 0);
    return camera;
}

/**
 * Create and configure WebGL renderer.
 */
export function createRenderer(mount: HTMLElement): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    return renderer;
}

/**
 * Create orbit controls for camera manipulation.
 */
export function createControls(
    camera: THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer
): OrbitControls {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground
    return controls;
}

/**
 * Add lighting to the scene.
 */
export function addLighting(scene: THREE.Scene): void {
    const ambientLight = new THREE.AmbientLight(0xffd9e6, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffe6f0, 2);
    directionalLight.position.set(100, 200, 100);
    scene.add(directionalLight);
}

/**
 * Create ground plane.
 */
export function createGround(scene: THREE.Scene): THREE.Mesh {
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);
    return ground;
}

/**
 * Add coordinate system helpers.
 */
export function addCoordinateHelpers(scene: THREE.Scene): THREE.AxesHelper {
    const axesHelper = new THREE.AxesHelper(200);
    scene.add(axesHelper);
    return axesHelper;
}

/**
 * Initialize complete scene with all components.
 */
export function initializeScene(
    scene: THREE.Scene,
    mount: HTMLElement
): SceneComponents {
    const camera = createCamera(mount);
    const renderer = createRenderer(mount);
    const controls = createControls(camera, renderer);
    addLighting(scene);
    const ground = createGround(scene);
    const axesHelper = addCoordinateHelpers(scene);

    return {
        camera,
        renderer,
        controls,
        ground,
        axesHelper
    };
}

/**
 * Handle window resize.
 */
export function handleResize(
    camera: THREE.OrthographicCamera,
    renderer: THREE.WebGLRenderer,
    mount: HTMLElement
): void {
    const aspect = mount.clientWidth / mount.clientHeight;
    const frustumSize = 600;
    camera.left = frustumSize * aspect / -2;
    camera.right = frustumSize * aspect / 2;
    camera.top = frustumSize / 2;
    camera.bottom = frustumSize / -2;
    camera.updateProjectionMatrix();
    renderer.setSize(mount.clientWidth, mount.clientHeight);
}
