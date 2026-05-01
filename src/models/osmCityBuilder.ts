/**
 * @fileoverview OSM City Builder - Generate 3D cities from OpenStreetMap data.
 * Features geocoding, building visualization, selection highlighting, and STL export.
 */

import * as THREE from 'three';
import { AppConfig, resolveThreeBgFromCss } from '../config';
import {
    initializeScene,
    handleResize,
    initializeUI,
    showLoading,
    hideLoading,
    createClickHandler,
    createExportHandler,
    loadBuildings,
    centerCamera,
    type BuildingMesh,
    type SelectionState
} from './osmCityBuilder/index';

/**
 * OSM City Builder scene.
 * @param scene - Three.js scene.
 * @param opts - Mount element and preview mode options.
 * @returns Cleanup function.
 */
export function osmCityBuilder(
    scene: THREE.Scene,
    opts?: { mount?: HTMLElement; preview?: boolean }
): () => void {
    console.log('[OSMCityBuilder] Initializing scene');

    const mount = opts?.mount;
    if (!mount) {
        console.error('[OSMCityBuilder] No mount element provided');
        return () => { };
    }

    const isPreview = opts?.preview ?? false;

    // Scene setup
    const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
    scene.background = new THREE.Color(bg);

    // --- Preview mode: simple static render, no UI ---
    if (isPreview) {
        const width = mount.clientWidth;
        const height = mount.clientHeight;
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mount.appendChild(renderer.domElement);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(150, 200, 150);
        camera.lookAt(0, 0, 0);

        // Simple placeholder geometry for preview
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
        dirLight.position.set(100, 200, 100);
        scene.add(dirLight);

        // Ground plane
        const groundGeo = new THREE.PlaneGeometry(300, 300);
        const groundMat = new THREE.MeshStandardMaterial({ color: 0x8B7355, roughness: 0.9 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        scene.add(ground);

        // A few placeholder buildings
        const buildingColor = 0xcccccc;
        const positions = [
            { x: 0, z: 0, w: 30, d: 30, h: 60 },
            { x: 50, z: -20, w: 20, d: 25, h: 40 },
            { x: -40, z: 30, w: 25, d: 20, h: 35 },
            { x: 30, z: 40, w: 15, d: 15, h: 25 },
            { x: -20, z: -40, w: 35, d: 20, h: 50 },
        ];
        for (const p of positions) {
            const geo = new THREE.BoxGeometry(p.w, p.h, p.d);
            const mat = new THREE.MeshStandardMaterial({ color: buildingColor, roughness: 0.7 });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(p.x, p.h / 2, p.z);
            scene.add(mesh);
        }

        let animId = 0;
        let time = 0;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            time += 0.003;
            camera.position.x = 200 * Math.cos(time);
            camera.position.z = 200 * Math.sin(time);
            camera.lookAt(0, 20, 0);
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }

    // --- Full mode ---
    // Initialize scene components
    const { camera, renderer, controls, ground } = initializeScene(scene, mount);

    // State management
    const terrainMeshRef = { current: null as THREE.Mesh | null };
    const buildings: BuildingMesh[] = [];
    const selectionState: SelectionState = { selectedBuilding: null };

    // Initialize UI
    const { uiPanel, loadingOverlay, loadingText } = initializeUI(
        mount,
        async (address: string) => {
            try {
                await loadBuildings(
                    address,
                    scene,
                    ground,
                    terrainMeshRef,
                    buildings,
                    (message) => showLoading(loadingOverlay, loadingText, message)
                );
                centerCamera(camera, controls);
                hideLoading(loadingOverlay);
            } catch {
                hideLoading(loadingOverlay);
            }
        },
        '서울특별시 강남구 영동대로 517'
    );

    // Event handlers
    const onMouseClick = createClickHandler(camera, renderer, buildings, selectionState);
    const onKeyDown = createExportHandler(terrainMeshRef.current, buildings);
    const onResize = () => handleResize(camera, renderer, mount);

    renderer.domElement.addEventListener('click', onMouseClick);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);

    // Animation loop
    function animate() {
        controls.update();
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    // Load default location
    loadBuildings(
        '서울특별시 강남구 영동대로 517',
        scene,
        ground,
        terrainMeshRef,
        buildings,
        (message) => showLoading(loadingOverlay, loadingText, message)
    ).then(() => {
        centerCamera(camera, controls);
        hideLoading(loadingOverlay);
    }).catch(() => {
        hideLoading(loadingOverlay);
    });

    // Cleanup function
    return () => {
        console.log('[OSMCityBuilder] Cleanup');
        renderer.setAnimationLoop(null);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', onKeyDown);
        renderer.domElement.removeEventListener('click', onMouseClick);
        controls.dispose();
        renderer.dispose();

        if (mount.contains(renderer.domElement)) {
            mount.removeChild(renderer.domElement);
        }
        if (mount.contains(uiPanel)) {
            mount.removeChild(uiPanel);
        }
        if (mount.contains(loadingOverlay)) {
            mount.removeChild(loadingOverlay);
        }

        // Dispose buildings
        buildings.forEach(building => {
            building.geometry.dispose();
            (building.material as THREE.Material).dispose();
            scene.remove(building);
        });

        // Dispose terrain if exists
        if (terrainMeshRef.current) {
            terrainMeshRef.current.geometry.dispose();
            (terrainMeshRef.current.material as THREE.Material).dispose();
            scene.remove(terrainMeshRef.current);
        }
    };
}
