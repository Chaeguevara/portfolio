import * as THREE from 'three';
import { resolveThreeBgFromCss } from '../config';
import { GPUPickHelper } from '../lib/gpuPickHelper';

type Options = { mount?: HTMLElement; preview?: boolean };

/**
 * GPU Picking Demo
 * 
 * This demo illustrates "GPU Picking", where we render the scene to an off-screen texture
 * with unique colors for each object, and then read the pixel under the mouse to identify the object.
 * This is performant for scenes with many objects.
 */
export const gpuPickingDemo = (scene: THREE.Scene, opts: Options = {}) => {
    const container = opts.mount ?? document.getElementById("work") ?? document.body;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(resolveThreeBgFromCss());
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth || window.innerWidth, clientHeight || window.innerHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(
        60,
        (clientWidth || window.innerWidth) / (clientHeight || window.innerHeight),
        0.1,
        200
    );
    camera.position.z = 30;

    // Create a grid of cubes
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    const cubes: THREE.Mesh[] = [];
    const idToObject: { [key: number]: THREE.Object3D } = {};

    // Use a simple color texture or just colors

    const group = new THREE.Group();
    scene.add(group);

    for (let i = 0; i < 100; ++i) {
        const material = new THREE.MeshPhongMaterial({
            color: randomColor(),
        });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = (Math.random() - 0.5) * 40;
        cube.position.y = (Math.random() - 0.5) * 40;
        cube.position.z = (Math.random() - 0.5) * 40;

        cube.rotation.x = Math.random() * 2 * Math.PI;
        cube.rotation.y = Math.random() * 2 * Math.PI;
        cube.rotation.z = Math.random() * 2 * Math.PI;

        cube.scale.x = Math.random() + 0.5;
        cube.scale.y = Math.random() + 0.5;
        cube.scale.z = Math.random() + 0.5;

        group.add(cube);
        cubes.push(cube);

        // Give each object a unique color ID for picking
        const id = i + 1;
        idToObject[id] = cube;
        // @ts-ignore
        cube.material.userData = { id }; // Store ID if needed, but we use the map
    }

    // Add lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 10, 0);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    const pickHelper = new GPUPickHelper();
    const pickPosition = { x: 0, y: 0 };
    let pickedObject: THREE.Object3D | null = null;
    let pickedObjectSavedColor = 0;

    const onMouseMove = (event: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pickPosition.x = event.clientX - rect.left;
        pickPosition.y = event.clientY - rect.top;
    };

    if (!opts.preview) {
        window.addEventListener('mousemove', onMouseMove);
    }

    const animate = (time: number) => {
        time *= 0.001; // convert to seconds

        cubes.forEach((cube, ndx) => {
            const speed = 1 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });

        if (!opts.preview) {
            // We need to render the scene with picking colors
            // But we can't easily swap all materials every frame efficiently without cloning or using a custom shader.
            // The standard "GPU Picking" technique involves rendering the scene with a special material override.

            // Save original materials
            const originalMaterials: THREE.Material[] = [];
            cubes.forEach((c, i) => {
                originalMaterials[i] = c.material as THREE.Material;
                // Create a picking material (simple basic material with the ID color)
                // ID is 1-based index
                const id = i + 1;
                const pickingMaterial = new THREE.MeshBasicMaterial();
                pickingMaterial.color.setHex(id);
                c.material = pickingMaterial;
            });

            // Render for picking
            // Set background to black for picking to avoid picking the background
            const originalBackground = scene.background;
            scene.background = new THREE.Color(0);

            const picked = pickHelper.pick(pickPosition, scene, camera, renderer, idToObject);

            // Restore background
            scene.background = originalBackground;

            // Restore original materials immediately after rendering to picking texture
            cubes.forEach((c, i) => {
                c.material = originalMaterials[i];
            });

            // Handle highlighting
            if (pickedObject && pickedObject !== picked) {
                // Restore color of previously picked object
                // @ts-ignore
                pickedObject.material.emissive.setHex(pickedObjectSavedColor);
                pickedObject = null;
            }

            if (picked && picked !== pickedObject) {
                pickedObject = picked;
                // @ts-ignore
                pickedObjectSavedColor = pickedObject.material.emissive.getHex();
                // @ts-ignore
                pickedObject.material.emissive.setHex((Date.now() * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
            } else if (picked) {
                // Keep flashing
                // @ts-ignore
                picked.material.emissive.setHex((Date.now() * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
            }
        }

        renderer.render(scene, camera);
    };

    if (!opts.preview) {
        renderer.setAnimationLoop(animate);
    } else {
        renderer.render(scene, camera);
    }

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
        cubes.forEach(c => {
            try { (c.material as THREE.Material).dispose(); } catch { /* noop */ }
        });
        try { pickHelper.pickingTexture.dispose(); } catch { /* noop */ }
    };
};

function randomColor() {
    return `hsl(${Math.random() * 360 | 0}, ${Math.random() * 50 + 50}%, ${Math.random() * 50 + 25}%)`;
}
