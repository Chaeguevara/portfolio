import * as THREE from 'three';
import { resolveThreeBgFromCss } from '../config';

type Options = { mount?: HTMLElement; preview?: boolean };

/**
 * Picking Demo
 * 
 * This demo illustrates how to "pick" or select objects in a 3D scene using the mouse.
 * The core concept is "Raycasting".
 * 
 * Steps:
 * 1. Get the mouse position in Normalized Device Coordinates (NDC).
 *    - X goes from -1 (left) to +1 (right).
 *    - Y goes from -1 (bottom) to +1 (top).
 * 2. Create a Raycaster.
 * 3. Update the Raycaster with the camera and mouse position.
 * 4. Calculate intersections between the ray and the objects in the scene.
 */
export const pickingDemo = (scene: THREE.Scene, opts: Options = {}) => {
    const container = opts.mount ?? document.getElementById("work") ?? document.body;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(resolveThreeBgFromCss());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth || window.innerWidth, clientHeight || window.innerHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        75,
        (clientWidth || window.innerWidth) / (clientHeight || window.innerHeight),
        0.1,
        1000
    );
    camera.position.z = 5;

    // 1. Create a Raycaster
    const raycaster = new THREE.Raycaster();

    // 2. Create a Vector2 to hold the mouse position in NDC
    const mouse = new THREE.Vector2();

    // Create a grid of cubes to pick
    const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cubes: THREE.Mesh[] = [];

    const group = new THREE.Group();
    for (let x = -2; x <= 2; x++) {
        for (let y = -2; y <= 2; y++) {
            const cube = new THREE.Mesh(geometry, material.clone()); // Clone material so each has its own color
            cube.position.set(x, y, 0);
            group.add(cube);
            cubes.push(cube);
        }
    }
    scene.add(group);

    // Event Listener for Mouse Move
    const onMouseMove = (event: MouseEvent) => {
        // Calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    if (!opts.preview) {
        window.addEventListener('mousemove', onMouseMove);
    }

    // Animation Loop
    const animate = () => {
        // Reset all cubes to white
        cubes.forEach(cube => (cube.material as THREE.MeshBasicMaterial).color.set(0xffffff));

        if (!opts.preview) {
            // 3. Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // 4. Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObjects(cubes);

            // Change color of intersected objects
            for (let i = 0; i < intersects.length; i++) {
                // intersects[i].object is the object that was hit
                (intersects[i].object as THREE.Mesh).material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                // Note: In a real app, you'd probably want to avoid creating new materials every frame.
                // Better: (intersects[i].object as THREE.Mesh).material.color.set(0xff0000);
                // But since we cloned materials, we can just set the color.
                ((intersects[i].object as THREE.Mesh).material as THREE.MeshBasicMaterial).color.set(0xff0000);
            }
        }

        renderer.render(scene, camera);
    };

    if (!opts.preview) {
        renderer.setAnimationLoop(animate);
    } else {
        renderer.render(scene, camera);
    }

    // Resize Handler
    const onResize = () => {
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };

    if (!opts.preview) {
        window.addEventListener('resize', onResize);
    }

    return () => {
        if (!opts.preview) {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            renderer.setAnimationLoop(null);
        }
        try { renderer.dispose(); } catch { /* noop */ }
        try { renderer.domElement.remove(); } catch { /* noop */ }
        try { geometry.dispose(); } catch { /* noop */ }
        try { material.dispose(); } catch { /* noop */ }
        cubes.forEach(c => {
            try { (c.material as THREE.Material).dispose(); } catch { /* noop */ }
        });
    };
};
