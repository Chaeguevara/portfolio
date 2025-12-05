import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { createBicycleSkeleton } from './assets/simpleBox';

type Options = { mount?: HTMLElement; preview?: boolean };

export const simpleTestScene = (scene: THREE.Scene, opts: Options = {}) => {
    const container = opts.mount ?? document.getElementById("work") ?? document.body;
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    const { clientWidth, clientHeight } = container;

    renderer.setSize(clientWidth, clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 100);
    camera.position.set(3, 3, 3);
    camera.lookAt(0, 0, 0);

    const controls = !opts.preview ? new OrbitControls(camera, renderer.domElement) : null;

    // --- Asset Usage ---
    const { group, dispose } = createBicycleSkeleton();
    scene.add(group);

    // Helpers
    const axes = new THREE.AxesHelper(2);
    scene.add(axes);

    const animate = () => {
        if (controls) controls.update();
        group.rotation.y += 0.01;
        renderer.render(scene, camera);
    };

    if (!opts.preview) {
        renderer.setAnimationLoop(animate);
    } else {
        renderer.render(scene, camera);
    }

    const onResize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };

    if (!opts.preview) {
        window.addEventListener('resize', onResize);
        onResize(); // Force initial
        // Also force a delayed resize just in case CSS flexbox is slow
        setTimeout(onResize, 100);
    }

    return () => {
        if (!opts.preview) {
            window.removeEventListener('resize', onResize);
            renderer.setAnimationLoop(null);
        }
        renderer.dispose();
        dispose();
    };
};
