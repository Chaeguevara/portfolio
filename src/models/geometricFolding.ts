/**
 * @fileoverview Geometric Folding - Interactive crease pattern visualization.
 * Placeholder scene: a simple crease pattern on a square sheet that folds.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function geometricFolding(
    scene: THREE.Scene,
    opts?: { mount?: HTMLElement; preview?: boolean }
): () => void {
    const mount = opts?.mount ?? document.getElementById('work')!;
    const isPreview = opts?.preview ?? false;
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);

    // Controls
    let controls: OrbitControls | null = null;
    if (!isPreview) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(3, 5, 4);
    scene.add(dirLight);

    // --- Crease Pattern: Square sheet with diagonal + horizontal creases ---
    const sheetSize = 2;
    const half = sheetSize / 2;

    // Paper sheet (two triangles forming a square, split by diagonal crease)
    const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0xfaf3e0,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.0,
    });

    // Left triangle panel
    const leftGeo = new THREE.BufferGeometry();
    leftGeo.setAttribute('position', new THREE.Float32BufferAttribute([
        -half, 0, -half,
        half, 0, -half,
        -half, 0, half,
    ], 3));
    leftGeo.computeVertexNormals();
    const leftPanel = new THREE.Mesh(leftGeo, panelMaterial);

    // Right triangle panel
    const rightGeo = new THREE.BufferGeometry();
    rightGeo.setAttribute('position', new THREE.Float32BufferAttribute([
        half, 0, -half,
        half, 0, half,
        -half, 0, half,
    ], 3));
    rightGeo.computeVertexNormals();
    const rightPanel = new THREE.Mesh(rightGeo, panelMaterial);

    // Group for folding animation (pivot along the diagonal crease)
    const foldGroup = new THREE.Group();
    foldGroup.add(rightPanel);
    scene.add(leftPanel);
    scene.add(foldGroup);

    // Crease lines
    const creaseColor = 0xe74c3c; // Mountain fold = red
    const valleyColor = 0x3498db; // Valley fold = blue

    // Diagonal crease (mountain)
    const diagPoints = [
        new THREE.Vector3(-half, 0.005, half),
        new THREE.Vector3(half, 0.005, -half),
    ];
    const diagGeo = new THREE.BufferGeometry().setFromPoints(diagPoints);
    const diagLine = new THREE.Line(diagGeo, new THREE.LineBasicMaterial({ color: creaseColor, linewidth: 2 }));
    scene.add(diagLine);

    // Horizontal crease (valley)
    const horizPoints = [
        new THREE.Vector3(-half, 0.005, 0),
        new THREE.Vector3(half, 0.005, 0),
    ];
    const horizGeo = new THREE.BufferGeometry().setFromPoints(horizPoints);
    const horizLine = new THREE.Line(horizGeo, new THREE.LineBasicMaterial({ color: valleyColor, linewidth: 2 }));
    scene.add(horizLine);

    // Vertical crease (valley)
    const vertPoints = [
        new THREE.Vector3(0, 0.005, -half),
        new THREE.Vector3(0, 0.005, half),
    ];
    const vertGeo = new THREE.BufferGeometry().setFromPoints(vertPoints);
    const vertLine = new THREE.Line(vertGeo, new THREE.LineBasicMaterial({ color: valleyColor, linewidth: 2 }));
    scene.add(vertLine);

    // Legend (only in full view)
    if (!isPreview) {
        // Grid helper for reference
        const gridHelper = new THREE.GridHelper(6, 12, 0xdddddd, 0xeeeeee);
        gridHelper.position.y = -0.01;
        scene.add(gridHelper);
    }

    // Animation
    let animId = 0;
    let time = 0;
    const foldAxis = new THREE.Vector3(1, 0, -1).normalize();

    const animate = () => {
        animId = requestAnimationFrame(animate);
        time += 0.01;

        // Gentle fold animation along diagonal
        const foldAngle = Math.sin(time * 0.8) * Math.PI * 0.3;
        foldGroup.setRotationFromAxisAngle(foldAxis, foldAngle);

        // Slight elevation of crease lines to follow fold
        diagLine.position.y = Math.abs(foldAngle) * 0.02;

        controls?.update();
        renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    };
    if (!isPreview) {
        window.addEventListener('resize', onResize);
    }

    // Cleanup
    return () => {
        cancelAnimationFrame(animId);
        if (!isPreview) window.removeEventListener('resize', onResize);
        controls?.dispose();
        renderer.dispose();
        mount.removeChild(renderer.domElement);
        leftGeo.dispose();
        rightGeo.dispose();
        diagGeo.dispose();
        horizGeo.dispose();
        vertGeo.dispose();
        panelMaterial.dispose();
    };
}
