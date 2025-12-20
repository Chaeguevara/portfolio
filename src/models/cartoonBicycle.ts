import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { resolveThreeBgFromCss } from '../config';
import { createBicycle } from './assets/bicycle';

type Options = { mount?: HTMLElement; preview?: boolean };

/**
 * Cartoon Bicycle Scene
 * 
 * Features:
 * - Procedural geometry (Torus, Cylinder, Tube)
 * - Custom Toon Shading using a generated gradient map
 * - Cozy pastel atmosphere
 */
export const cartoonBicycle = (scene: THREE.Scene, opts: Options = {}) => {
    console.log("[CartoonBicycle] Init", opts);
    const container = opts.mount ?? document.getElementById("work") ?? document.body;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });

    // Cozy background color (soft pastel yellow/beige)
    // We override the default three-bg for this specific artistic scene to match the "cozy" vibe
    // or we can stick to the theme. The user asked for "cozy", so let's use a warm background.
    // However, the rules say "ALL scenes must use resolved background".
    // Let's stick to the rule but maybe add a big soft sphere or backdrop if needed.
    // actually, let's follow the rule strictly for consistency, but we can add ambient warm light.
    const bgColor = resolveThreeBgFromCss();
    console.log(`[CartoonBicycle] Setting background color: ${bgColor}`);
    renderer.setClearColor(bgColor);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const { clientWidth, clientHeight } = container;
    console.log(`[CartoonBicycle] Container dimensions: ${clientWidth}x${clientHeight}`);
    renderer.setSize(clientWidth, clientHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(50, clientWidth / clientHeight, 0.1, 100);
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0.5, 0);

    const controls = !opts.preview ? new OrbitControls(camera, renderer.domElement) : null;
    if (controls) {
        controls.enableDamping = true;
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.target.set(0, 0.5, 0);
    }

    // --- Lighting ---
    // Warm, cozy lighting
    const ambientLight = new THREE.AmbientLight(0xffeebb, 0.6); // Warm ambient
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffddaa, 0.8); // Sunny directional
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // --- Toon Material Setup ---
    // Generate a simple 3-4 tone gradient map for cel shading
    const format = THREE.RGBAFormat;
    const colors = new Uint8Array([
        0, 0, 0, 255,
        128, 128, 128, 255,
        255, 255, 255, 255
    ]); // Dark, Mid, Light
    const gradientMap = new THREE.DataTexture(colors, colors.length / 4, 1, format);
    gradientMap.needsUpdate = true;
    gradientMap.minFilter = THREE.NearestFilter;
    gradientMap.magFilter = THREE.NearestFilter;

    // Helper material factory
    const createToonMat = (color: number | string) => new THREE.MeshToonMaterial({
        color: new THREE.Color(color),
        gradientMap: gradientMap,
    });

    // --- Bicycle Model ---
    const { group: bikeGroup, wheels, dispose: disposeBike } = createBicycle(createToonMat);
    scene.add(bikeGroup);

    // Ground shadow (simple circle plane)
    const shadowGeo = new THREE.CircleGeometry(2.5, 32);
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.15 });
    const shadow = new THREE.Mesh(shadowGeo, shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.01; // Just above 0
    // Scale shadow to fit bike shape
    shadow.scale.y = 0.4;
    scene.add(shadow);

    // Initialize animation loop
    // Override animate to be simple
    const cleanAnimate = () => {
        if (!opts.preview && controls) controls.update();

        const time = Date.now() * 0.001;
        bikeGroup.position.y = Math.sin(time) * 0.05 + 0.05;
        shadow.material.opacity = 0.15 - Math.sin(time) * 0.02;

        const rot = -time * 2;
        // The wheels object from asset contains the groups
        wheels.back.rotation.z = rot;
        wheels.front.rotation.z = rot;

        renderer.render(scene, camera);
    };
    console.log("[CartoonBicycle] Animation loop defined");


    if (!opts.preview) {
        renderer.setAnimationLoop(cleanAnimate);
    } else {
        renderer.render(scene, camera);
    }

    // Resize handler
    const onResize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    if (!opts.preview) {
        window.addEventListener('resize', onResize);
        // Force initial resize to ensure correct dimensions
        onResize();
    }

    return () => {
        console.log("[CartoonBicycle] Disposing scene");
        if (!opts.preview) {
            window.removeEventListener('resize', onResize);
            renderer.setAnimationLoop(null);
        }
        renderer.dispose();
        disposeBike();
        shadowGeo.dispose(); shadowMat.dispose();
        gradientMap.dispose();
        console.log("[CartoonBicycle] Disposal complete");
    };
};
