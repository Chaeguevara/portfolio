import * as THREE from 'three';
import { resolveThreeBgFromCss } from '../config';

type Options = { mount?: HTMLElement; preview?: boolean };

export const aboutScene = (scene: THREE.Scene, opts: Options = {}) => {
    const container = opts.mount ?? document.getElementById("work") ?? document.body;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
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
    camera.position.z = 30;

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 2000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 50;
        colors[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.8,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Animation Loop
    let animationId: number;
    const animate = () => {
        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;
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
            window.removeEventListener('resize', onResize);
            renderer.setAnimationLoop(null);
        }
        try { renderer.dispose(); } catch { /* noop */ }
        try { renderer.domElement.remove(); } catch { /* noop */ }
        try { particlesGeometry.dispose(); } catch { /* noop */ }
        try { particlesMaterial.dispose(); } catch { /* noop */ }
    };
};
