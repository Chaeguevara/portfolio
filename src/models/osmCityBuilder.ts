/**
 * @fileoverview OSM City Builder - Generate 3D cities from OpenStreetMap data.
 * Features geocoding, building visualization, selection highlighting, and STL export.
 */

import * as THREE from 'three';
import type { Feature } from 'geojson';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Evaluator, SUBTRACTION, Brush } from 'three-bvh-csg';
import { geocode, fetchBuildingsInRadius } from '../lib/osmClient';
import { fetchElevationGrid, type ElevationPoint } from '../lib/elevationClient';
import { AppConfig, resolveThreeBgFromCss } from '../config';

interface BuildingMesh extends THREE.Mesh {
    userData: {
        osmId: string;
        address?: string;
        height: number;
        isHighlighted: boolean;
    };
}

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

    // Scene setup
    const bg = resolveThreeBgFromCss() ?? AppConfig.threeBackground;
    scene.background = new THREE.Color(bg);

    // Orthographic Camera for axonometric/isometric view (cartoon style)
    const aspect = mount.clientWidth / mount.clientHeight;
    const frustumSize = 600;
    const camera = new THREE.OrthographicCamera(
        frustumSize * aspect / -2,
        frustumSize * aspect / 2,
        frustumSize / 2,
        frustumSize / -2,
        0.1,  // Near plane - smaller to prevent clipping
        10000
    );
    // Position at 45-degree isometric angle
    camera.position.set(400, 400, 400);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.1; // Prevent going below ground

    // Lighting - soft pastel ambient
    const ambientLight = new THREE.AmbientLight(0xffd9e6, 0.8); // Pastel pink tint
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffe6f0, 2); // Soft pastel
    directionalLight.position.set(100, 200, 100);
    scene.add(directionalLight);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(2000, 2000);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x3a3a3a,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // North indicator (red arrow pointing north = -Z direction)
    const northArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, -1), // Direction: -Z is north
        new THREE.Vector3(400, 50, 400), // Position
        100, // Length
        0xff0000, // Red color
        30, // Head length
        20 // Head width
    );
    scene.add(northArrow);

    // Terrain storage
    let terrainMesh: THREE.Mesh | null = null;
    const gridSize = 20; // 20x20 elevation grid

    // Building storage
    const buildings: BuildingMesh[] = [];
    let selectedBuilding: BuildingMesh | null = null;

    // Materials
    const defaultMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        roughness: 0.7,
        metalness: 0.1
    });

    const highlightMaterial = new THREE.MeshStandardMaterial({
        color: 0xf4a3a8, // Pastel red
        roughness: 0.5,
        metalness: 0.2,
        emissive: 0xf4a3a8,
        emissiveIntensity: 0.2
    });

    /**
     * Convert lat/lon coordinates to scene coordinates.
     * Simple equirectangular projection centered at origin.
     */
    function latLonToScene(lat: number, lon: number, centerLat: number, centerLon: number): { x: number; z: number } {
        const scale = 100000; // Scale factor for meters to scene units
        const x = (lon - centerLon) * Math.cos(centerLat * Math.PI / 180) * scale;
        const z = -(lat - centerLat) * scale; // Negative Z for north
        return { x, z };
    }

    /**
     * Extract footprint points from a GeoJSON feature.
     */
    function getFootprintPoints(
        feature: Feature,
        centerLat: number,
        centerLon: number
    ): THREE.Vector2[] {
        if (feature.geometry.type !== 'Polygon') return [];

        const coords = feature.geometry.coordinates[0];
        const points: THREE.Vector2[] = [];

        for (let i = 0; i < coords.length - 1; i++) {
            const [lon, lat] = coords[i];
            const { x, z } = latLonToScene(lat, lon, centerLat, centerLon);
            points.push(new THREE.Vector2(x, z));
        }

        return points;
    }

    /**
     * Create 3D building mesh from footprint points.
     */
    function createBuildingMesh(
        footprintPoints: THREE.Vector2[],
        height: number,
        osmId: string,
        name?: string
    ): BuildingMesh | null {
        if (footprintPoints.length < 3) return null;

        // Create shape from footprint points
        const shape = new THREE.Shape(footprintPoints);

        // Extrude settings
        const extrudeSettings = {
            depth: height,
            bevelEnabled: false
        };

        // Create geometry
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Rotate to stand upright (ExtrudeGeometry extrudes in Z, we want Y-up)
        geometry.rotateX(-Math.PI / 2);

        // After rotation, ExtrudeGeometry goes in -Y direction
        // Translate up by full height so base sits at y=0 and building extends upward
        geometry.translate(0, height, 0);

        // Create mesh
        const mesh = new THREE.Mesh(geometry, defaultMaterial);
        mesh.userData = {
            osmId: osmId,
            height: height,
            isHighlighted: false,
            address: name
        };

        return mesh as unknown as BuildingMesh;
    }

    /**
     * Project a point down onto terrain mesh using raycasting.
     * Returns terrain elevation at that XZ position.
     */
    function projectToTerrain(x: number, z: number): number {
        if (!terrainMesh) return 0;

        const raycaster = new THREE.Raycaster();
        const origin = new THREE.Vector3(x, 20000, z); // Start high above
        const direction = new THREE.Vector3(0, -1, 0); // Cast downward

        raycaster.set(origin, direction);
        const intersects = raycaster.intersectObject(terrainMesh);

        if (intersects.length > 0) {
            return intersects[0].point.y;
        }
        return 0; // Fallback if no intersection
    }

    /**
     * Create foundation pad for building with terrain-aware vertical walls.
     * Uses raycasting to project footprint onto actual terrain surface.
     */
    function createFoundationPad(
        footprintPoints: THREE.Vector2[]
    ): { mesh: THREE.Mesh; padElevation: number } {
        // Project all footprint points to terrain and find lowest
        const terrainElevations: number[] = [];
        let lowestElevation = Infinity;

        for (const point of footprintPoints) {
            const terrainY = projectToTerrain(point.x, point.y);
            console.log(`Terrain elevation at ${point.x}, ${point.y}: ${terrainY}`);
            terrainElevations.push(terrainY);
            if (terrainY < lowestElevation) {
                lowestElevation = terrainY;
            }
        }

        // Create foundation geometry with ABSOLUTE world coordinates
        const positions: number[] = [];
        const indices: number[] = [];

        // Top pad vertices (horizontal at lowestElevation) - world coordinates
        for (const point of footprintPoints) {
            positions.push(point.x, lowestElevation, point.y);
        }

        // Bottom vertices (at actual terrain surface) - world coordinates
        const bottomOffset = footprintPoints.length;
        for (let i = 0; i < footprintPoints.length; i++) {
            const point = footprintPoints[i];
            const terrainY = terrainElevations[i];
            positions.push(point.x, terrainY, point.y);
        }


        // Top face indices (fan triangulation from center)
        const topCenter = positions.length / 3;
        positions.push(0, lowestElevation, 0);
        for (let i = 0; i < footprintPoints.length - 1; i++) {
            indices.push(topCenter, i + 1, i);
        }
        // Close the loop
        indices.push(topCenter, 0, footprintPoints.length - 1);

        // Vertical walls connecting pad to terrain
        for (let i = 0; i < footprintPoints.length; i++) {
            const next = (i + 1) % footprintPoints.length;
            const a = i;
            const b = next;
            const c = bottomOffset + i;
            const d = bottomOffset + next;
            // Two triangles per wall segment
            indices.push(a, c, b);
            indices.push(b, c, d);
        }

        const foundationGeometry = new THREE.BufferGeometry();
        foundationGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        foundationGeometry.setIndex(indices);
        foundationGeometry.computeVertexNormals();

        const foundationMaterial = new THREE.MeshStandardMaterial({
            color: 0xffb3e6, // Pastel pink/purple for distinct visibility
            roughness: 0.5,
            metalness: 0.1,
            side: THREE.DoubleSide
        });

        return {
            mesh: new THREE.Mesh(foundationGeometry, foundationMaterial),
            padElevation: lowestElevation
        };
    }

    /**
     * Create terrain mesh from elevation data.
     */
    function createTerrainMesh(
        elevations: ElevationPoint[],
        centerLat: number,
        centerLon: number
    ): THREE.Mesh {
        console.log('[OSMCityBuilder] Creating solid terrain mesh');

        // Convert to BufferGeometry with lat/lon based positions
        const solidGeometry = new THREE.BufferGeometry();
        const positions: number[] = [];
        const indices: number[] = [];

        const baseHeight = -50; // 50 meters down from lowest point

        // Top surface vertices (with elevation) - Y-up, XZ plane
        // Use actual lat/lon coordinates converted to scene space
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const idx = i * gridSize + j;
                const point = elevations[idx];

                // Convert this elevation point's lat/lon to scene coordinates
                const { x, z } = latLonToScene(point.lat, point.lon, centerLat, centerLon);
                const y = point.elevation;
                positions.push(x, y, z);
            }
        }

        // Bottom surface vertices (flat base) - Y-up
        const bottomOffset = gridSize * gridSize;
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const idx = i * gridSize + j;
                const point = elevations[idx];

                const { x, z } = latLonToScene(point.lat, point.lon, centerLat, centerLon);
                positions.push(x, baseHeight, z);
            }
        }

        // Top surface indices (reversed winding for Y-up)
        for (let i = 0; i < gridSize - 1; i++) {
            for (let j = 0; j < gridSize - 1; j++) {
                const a = i * gridSize + j;
                const b = a + 1;
                const c = a + gridSize;
                const d = c + 1;
                indices.push(a, b, c, b, d, c);  // Reversed for Y-up
            }
        }

        // Bottom surface indices
        for (let i = 0; i < gridSize - 1; i++) {
            for (let j = 0; j < gridSize - 1; j++) {
                const a = bottomOffset + i * gridSize + j;
                const b = a + 1;
                const c = a + gridSize;
                const d = c + 1;
                indices.push(a, c, b, b, c, d);  // Normal winding for bottom
            }
        }

        // Side walls
        // Front edge (min Z)
        for (let j = 0; j < gridSize - 1; j++) {
            const a = j;
            const b = j + 1;
            const c = bottomOffset + j;
            const d = bottomOffset + j + 1;
            indices.push(a, b, c, b, d, c);
        }
        // Back edge (max Z)
        for (let j = 0; j < gridSize - 1; j++) {
            const a = (gridSize - 1) * gridSize + j;
            const b = a + 1;
            const c = bottomOffset + (gridSize - 1) * gridSize + j;
            const d = c + 1;
            indices.push(a, c, b, b, c, d);
        }
        // Left edge (min X)
        for (let i = 0; i < gridSize - 1; i++) {
            const a = i * gridSize;
            const b = (i + 1) * gridSize;
            const c = bottomOffset + i * gridSize;
            const d = bottomOffset + (i + 1) * gridSize;
            indices.push(a, c, b, b, c, d);
        }
        // Right edge (max X)
        for (let i = 0; i < gridSize - 1; i++) {
            const a = i * gridSize + (gridSize - 1);
            const b = (i + 1) * gridSize + (gridSize - 1);
            const c = bottomOffset + i * gridSize + (gridSize - 1);
            const d = bottomOffset + (i + 1) * gridSize + (gridSize - 1);
            indices.push(a, b, c, b, d, c);
        }

        solidGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        solidGeometry.setIndex(indices);
        solidGeometry.computeVertexNormals();

        const terrainMaterial = new THREE.MeshStandardMaterial({
            color: 0x8B7355, // Brown terrain
            roughness: 0.9,
            metalness: 0.1,
            wireframe: false,
            side: THREE.DoubleSide
        });

        const mesh = new THREE.Mesh(solidGeometry, terrainMaterial);
        // No rotation needed - already Y-up!
        return mesh;
    }

    /**
     * Load buildings for a given address.
     */
    // Loading overlay placeholder (created later in UI section)
    let loadingOverlay: HTMLDivElement | null = null;
    let loadingText: HTMLDivElement | null = null;

    function showLoading(message: string = 'Loading city data...') {
        if (loadingOverlay && loadingText) {
            loadingText.textContent = message;
            loadingOverlay.style.display = 'flex';
        }
    }

    function hideLoading() {
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }

    async function loadBuildings(address: string) {
        console.log(`[OSMCityBuilder] Loading buildings for: ${address}`);
        showLoading('Geocoding address...');

        try {
            // Geocode address
            const { lat, lon } = await geocode(address);
            showLoading('Fetching elevation data...');

            // Fetch elevation data
            const elevations = await fetchElevationGrid(lat, lon, 500, gridSize);
            showLoading('Creating terrain...');

            // Remove old terrain if exists
            if (terrainMesh) {
                scene.remove(terrainMesh);
                terrainMesh.geometry.dispose();
                (terrainMesh.material as THREE.Material).dispose();
            }

            // Create and add new terrain
            terrainMesh = createTerrainMesh(elevations, lat, lon);
            scene.add(terrainMesh);
            ground.visible = false; // Hide flat ground
            showLoading('Fetching buildings...');

            // Fetch buildings
            const geojson = await fetchBuildingsInRadius(lat, lon, 500);
            showLoading(`Processing ${geojson.features.length} buildings...`);

            // Clear existing buildings
            buildings.forEach(building => scene.remove(building));
            buildings.length = 0;
            selectedBuilding = null;

            // Create building meshes with foundation pads
            let count = 0;
            for (const feature of geojson.features) {
                if (feature.geometry.type !== 'Polygon') continue;

                // Get footprint points using the SAME function as building mesh
                const footprintPoints = getFootprintPoints(feature, lat, lon);
                if (footprintPoints.length < 3) continue;

                // Create foundation pad with raycasting (geometry has absolute world coords)
                const { mesh: foundationPad, padElevation } = createFoundationPad(footprintPoints);
                scene.add(foundationPad);

                // Extract building properties
                const buildingHeight = (feature.properties?.height as number) || 10;
                const osmId = String(feature.properties?.osmId || '');
                const buildingName = feature.properties?.name as string | undefined;

                // Create building mesh from SAME footprint points
                const mesh = createBuildingMesh(footprintPoints, buildingHeight, osmId, buildingName);
                if (mesh) {
                    // Only position in Y - geometry already has correct XZ from latLonToScene
                    mesh.position.y = padElevation;

                    scene.add(mesh);
                    buildings.push(mesh);
                    count++;
                }

                // Update progress every 10 buildings
                if (count % 10 === 0) {
                    showLoading(`Creating buildings... ${count}/${geojson.features.length}`);
                }
            }

            console.log(`[OSMCityBuilder] Loaded ${count} buildings with terrain`);
            hideLoading();

            // Center camera on the area
            camera.position.set(200, 300, 200);
            controls.target.set(0, 0, 0);
            controls.update();

        } catch (error) {
            console.error('[OSMCityBuilder] Load buildings failed:', error);
            hideLoading();
        }
    }

    /**
     * Handle building selection via raycasting.
     */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function onMouseClick(event: MouseEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(buildings);

        if (intersects.length > 0) {
            const building = intersects[0].object as BuildingMesh;

            // Deselect previous
            if (selectedBuilding && selectedBuilding !== building) {
                selectedBuilding.material = defaultMaterial;
                selectedBuilding.userData.isHighlighted = false;
            }

            // Highlight new selection
            if (!building.userData.isHighlighted) {
                building.material = highlightMaterial;
                building.userData.isHighlighted = true;
                selectedBuilding = building;
                console.log(`[OSMCityBuilder] Selected building:`, building.userData);
            } else {
                // Deselect
                building.material = defaultMaterial;
                building.userData.isHighlighted = false;
                selectedBuilding = null;
            }
        }
    }

    renderer.domElement.addEventListener('click', onMouseClick);

    /**
     * Export scene to STL with CSG boolean operations (triggered by 'e' key).
     * Buildings are subtracted from terrain for clean 3D printing.
     */
    async function exportToSTL() {
        console.log('[OSMCityBuilder] Exporting to STL with CSG operations...');

        try {
            // Dynamic import of STLExporter
            const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter.js');
            const exporter = new STLExporter();

            let finalMesh: THREE.Mesh;

            if (terrainMesh && buildings.length > 0) {
                console.log('[OSMCityBuilder] Performing CSG boolean operations...');

                // Create CSG evaluator
                const csgEvaluator = new Evaluator();

                // Convert terrain to CSG Brush
                let terrainBrush = new Brush(terrainMesh.geometry, terrainMesh.material);
                terrainBrush.updateMatrixWorld();

                // Subtract each building from terrain
                for (const building of buildings) {
                    const buildingBrush = new Brush(building.geometry, building.material);
                    buildingBrush.position.copy(building.position);
                    buildingBrush.rotation.copy(building.rotation);
                    buildingBrush.updateMatrixWorld();

                    // Perform subtraction
                    terrainBrush = csgEvaluator.evaluate(terrainBrush, buildingBrush, SUBTRACTION);
                }

                // Create final mesh from CSG result
                finalMesh = new THREE.Mesh(terrainBrush.geometry, terrainBrush.material);

                // Add buildings on top
                const group = new THREE.Group();
                group.add(finalMesh);
                buildings.forEach(building => group.add(building.clone()));

                const stlString = exporter.parse(group, { binary: false });

                // Download
                const blob = new Blob([stlString], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'osm-city-terrain.stl';
                link.click();

                console.log('[OSMCityBuilder] STL export with CSG complete');
            } else {
                // Fallback: export buildings only
                const group = new THREE.Group();
                buildings.forEach(building => group.add(building.clone()));

                const stlString = exporter.parse(group, { binary: false });

                const blob = new Blob([stlString], { type: 'text/plain' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'osm-city.stl';
                link.click();

                console.log('[OSMCityBuilder] STL export (buildings only) complete');
            }
        } catch (error) {
            console.error('[OSMCityBuilder] STL export failed:', error);
        }
    }

    function onKeyDown(event: KeyboardEvent) {
        if (event.key === 'e' || event.key === 'E') {
            exportToSTL();
        }
    }

    window.addEventListener('keydown', onKeyDown);

    // Resize handler
    function onResize() {
        if (!mount) return;
        const aspect = mount.clientWidth / mount.clientHeight;
        const frustumSize = 600;
        (camera as THREE.OrthographicCamera).left = frustumSize * aspect / -2;
        (camera as THREE.OrthographicCamera).right = frustumSize * aspect / 2;
        (camera as THREE.OrthographicCamera).top = frustumSize / 2;
        (camera as THREE.OrthographicCamera).bottom = frustumSize / -2;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
    }

    window.addEventListener('resize', onResize);

    // Animation loop
    function animate() {
        controls.update();
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);

    // Create UI panel for address search
    const uiPanel = document.createElement('div');
    uiPanel.style.position = 'absolute';
    uiPanel.style.top = '20px';
    uiPanel.style.left = '20px';
    uiPanel.style.padding = '15px';
    uiPanel.style.background = 'rgba(0, 0, 0, 0.7)';
    uiPanel.style.color = 'white';
    uiPanel.style.borderRadius = '8px';
    uiPanel.style.fontFamily = 'Inter, sans-serif';
    uiPanel.style.fontSize = '14px';
    uiPanel.style.zIndex = '1000';
    uiPanel.style.minWidth = '300px';

    const title = document.createElement('div');
    title.textContent = 'OSM City Builder';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    title.style.fontSize = '16px';
    uiPanel.appendChild(title);

    const addressInput = document.createElement('input');
    addressInput.type = 'text';
    addressInput.placeholder = 'Enter address or place...';
    addressInput.value = '서울특별시 강남구 영동대로 517'; // Default: Seoul, Gangnam
    addressInput.style.width = '100%';
    addressInput.style.padding = '8px';
    addressInput.style.marginBottom = '10px';
    addressInput.style.border = 'none';
    addressInput.style.borderRadius = '4px';
    addressInput.style.fontSize = '14px';
    addressInput.style.boxSizing = 'border-box';
    uiPanel.appendChild(addressInput);

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load Buildings';
    loadButton.style.width = '100%';
    loadButton.style.padding = '8px';
    loadButton.style.background = '#4CAF50';
    loadButton.style.color = 'white';
    loadButton.style.border = 'none';
    loadButton.style.borderRadius = '4px';
    loadButton.style.cursor = 'pointer';
    loadButton.style.fontSize = '14px';
    loadButton.style.fontWeight = 'bold';
    loadButton.addEventListener('click', () => {
        const address = addressInput.value.trim();
        if (address) {
            loadBuildings(address);
        }
    });
    uiPanel.appendChild(loadButton);

    const statusDiv = document.createElement('div');
    statusDiv.style.marginTop = '10px';
    statusDiv.style.fontSize = '12px';
    statusDiv.style.color = '#aaa';
    statusDiv.textContent = 'Press "e" to export STL | Click buildings to highlight';
    uiPanel.appendChild(statusDiv);

    // Create loading overlay and assign to existing variables
    loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        flex-direction: column;
    `;

    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 50px;
        height: 50px;
        border: 4px solid #333;
        border-top: 4px solid #fff;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;

    loadingText = document.createElement('div');
    loadingText.style.cssText = `
        color: #fff;
        margin-top: 15px;
        font-size: 14px;
    `;
    loadingText.textContent = 'Loading city data...';

    loadingOverlay.appendChild(spinner);
    loadingOverlay.appendChild(loadingText);
    mount.appendChild(loadingOverlay);

    // Add CSS animation for spinner
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);


    mount.appendChild(uiPanel);

    // Load default location (Google HQ as demo)
    if (!opts?.preview) {
        loadBuildings('서울특별시 강남구 영동대로 517');
    }

    // Cleanup function
    return () => {
        console.log('[OSMCityBuilder] Cleanup');
        renderer.setAnimationLoop(null);
        window.removeEventListener('resize', onResize);
        window.removeEventListener('keydown', onKeyDown);
        renderer.domElement.removeEventListener('click', onMouseClick);
        controls.dispose();
        renderer.dispose();
        mount.removeChild(renderer.domElement);
        if (mount.contains(uiPanel)) {
            mount.removeChild(uiPanel);
        }

        buildings.forEach(building => {
            building.geometry.dispose();
            (building.material as THREE.Material).dispose();
            scene.remove(building);
        });
    };
}
