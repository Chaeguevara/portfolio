/**
 * @fileoverview Curved Billboard Mapping - UV mapping on curved LED surfaces.
 * Placeholder scene: a curved surface with a test grid texture showing UV distortion.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Generate a checkerboard + grid texture for UV distortion visualization.
 */
function createTestTexture(size: number = 512): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cellSize = size / 16;

    // Checkerboard
    for (let i = 0; i < 16; i++) {
        for (let j = 0; j < 16; j++) {
            ctx.fillStyle = (i + j) % 2 === 0 ? '#e8e8e8' : '#ffffff';
            ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }

    // Grid lines
    ctx.strokeStyle = '#3498db';
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 16; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, size);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(size, i * cellSize);
        ctx.stroke();
    }

    // Center crosshair
    ctx.strokeStyle = '#e74c3c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(size / 2, 0);
    ctx.lineTo(size / 2, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, size / 2);
    ctx.lineTo(size, size / 2);
    ctx.stroke();

    // Label
    ctx.fillStyle = '#2c3e50';
    ctx.font = `bold ${size / 12}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('UV TEST', size / 2, size / 2 - 10);
    ctx.font = `${size / 18}px monospace`;
    ctx.fillText('Curved Surface', size / 2, size / 2 + 30);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

export function curvedBillboard(
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
    camera.position.set(0, 1, 6);
    camera.lookAt(0, 0, 0);

    // Controls
    let controls: OrbitControls | null = null;
    if (!isPreview) {
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
    }

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // --- Curved billboard surface ---
    // Cylindrical section (partial cylinder like a curved LED screen)
    const curveRadius = 4;
    const curveArc = Math.PI * 0.6; // ~108 degrees of curvature
    const billboardWidth = 32;
    const billboardHeight = 16;

    const curvedGeo = new THREE.PlaneGeometry(3, 2, billboardWidth, billboardHeight);
    const posAttr = curvedGeo.attributes.position;

    // Bend the plane into a cylindrical arc
    for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);

        // Map x from [-1.5, 1.5] to angle range
        const angle = (x / 1.5) * (curveArc / 2);
        const newX = curveRadius * Math.sin(angle);
        const newZ = curveRadius * (1 - Math.cos(angle));

        posAttr.setXYZ(i, newX, y, -newZ);
    }
    curvedGeo.computeVertexNormals();

    const testTexture = createTestTexture();
    const billboardMaterial = new THREE.MeshStandardMaterial({
        map: testTexture,
        side: THREE.DoubleSide,
        roughness: 0.3,
        metalness: 0.1,
    });

    const billboard = new THREE.Mesh(curvedGeo, billboardMaterial);
    scene.add(billboard);

    // Wireframe overlay to show mesh topology
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x2c3e50,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
    });
    const wireframe = new THREE.Mesh(curvedGeo.clone(), wireframeMaterial);
    wireframe.position.copy(billboard.position);
    scene.add(wireframe);

    // Frame/edge highlight
    const edgesGeo = new THREE.EdgesGeometry(curvedGeo, 15);
    const edgesMaterial = new THREE.LineBasicMaterial({ color: 0x2c3e50, linewidth: 1 });
    const edges = new THREE.LineSegments(edgesGeo, edgesMaterial);
    scene.add(edges);

    if (!isPreview) {
        const gridHelper = new THREE.GridHelper(8, 16, 0xdddddd, 0xeeeeee);
        gridHelper.position.y = -1.5;
        scene.add(gridHelper);
    }

    // Animation
    let animId = 0;
    let time = 0;

    const animate = () => {
        animId = requestAnimationFrame(animate);
        time += 0.005;

        // Gentle rotation to show the curvature
        if (isPreview) {
            billboard.rotation.y = Math.sin(time * 2) * 0.3;
            wireframe.rotation.y = billboard.rotation.y;
            edges.rotation.y = billboard.rotation.y;
        }

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
        curvedGeo.dispose();
        billboardMaterial.dispose();
        wireframeMaterial.dispose();
        edgesGeo.dispose();
        edgesMaterial.dispose();
        testTexture.dispose();
    };
}
