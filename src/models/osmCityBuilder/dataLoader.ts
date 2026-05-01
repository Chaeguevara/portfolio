/**
 * @fileoverview Data loading orchestration for OSM City Builder.
 * Coordinates geocoding, elevation fetching, and building creation.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { geocode, fetchBuildingsInRadius } from '../../lib/osmClient';
import { fetchElevationGrid } from '../../lib/elevationClient';
import { createTerrainMesh, createFoundationPad } from './terrain';
import { getFootprintPointsFromTerrain } from './coordinates';
import { createBuildingMesh, type BuildingMesh } from './building';

/**
 * Grid size for elevation data.
 */
const GRID_SIZE = 20;
const RADIUS = 500; // meters

/**
 * Load buildings and terrain for a given address.
 */
export async function loadBuildings(
    address: string,
    scene: THREE.Scene,
    ground: THREE.Mesh,
    terrainMeshRef: { current: THREE.Mesh | null },
    buildingsArray: BuildingMesh[],
    onProgress: (message: string) => void
): Promise<void> {
    console.log(`[OSMCityBuilder] Loading buildings for: ${address}`);
    onProgress('Geocoding address...');

    try {
        // Geocode address
        const { lat, lon } = await geocode(address);
        onProgress('Fetching elevation data...');

        // Fetch elevation data
        const elevations = await fetchElevationGrid(lat, lon, RADIUS, GRID_SIZE);
        onProgress('Creating terrain...');

        // Remove old terrain if exists
        if (terrainMeshRef.current) {
            scene.remove(terrainMeshRef.current);
            terrainMeshRef.current.geometry.dispose();
            (terrainMeshRef.current.material as THREE.Material).dispose();
        }

        // Create and add new terrain
        console.log(`[OSMCityBuilder] Center point for terrain: lat=${lat}, lon=${lon}`);
        terrainMeshRef.current = createTerrainMesh(elevations, lat, lon, GRID_SIZE);
        scene.add(terrainMeshRef.current);
        ground.visible = false; // Hide flat ground
        onProgress('Fetching buildings...');

        // Fetch buildings
        const geojson = await fetchBuildingsInRadius(lat, lon, RADIUS);
        onProgress(`Processing ${geojson.features.length} buildings...`);

        // Clear existing buildings
        buildingsArray.forEach(building => {
            scene.remove(building);
            building.geometry.dispose();
        });
        buildingsArray.length = 0;

        // Create building meshes with foundation pads
        console.log(`[OSMCityBuilder] Creating buildings using terrain coordinate system (center: lat=${lat}, lon=${lon})`);
        let count = 0;

        for (const feature of geojson.features) {
            if (feature.geometry.type !== 'Polygon') continue;

            // Get footprint points using terrain's coordinate system
            const footprintPoints = getFootprintPointsFromTerrain(feature, terrainMeshRef.current);
            if (footprintPoints.length < 3) continue;

            // Extract building properties
            const buildingHeight = (feature.properties?.height as number) || 10;
            const osmId = String(feature.properties?.osmId || '');
            const buildingName = feature.properties?.name as string | undefined;

            // Create foundation pad (terrain-aware)
            const { mesh: foundationMesh, padElevation } = createFoundationPad(
                footprintPoints,
                terrainMeshRef.current
            );
            scene.add(foundationMesh);

            // Create building mesh positioned on foundation pad
            const buildingMesh = createBuildingMesh(footprintPoints, buildingHeight, osmId, buildingName);
            if (buildingMesh) {
                // Position building at pad elevation
                buildingMesh.position.y = padElevation;
                scene.add(buildingMesh);
                buildingsArray.push(buildingMesh);
                count++;
            }

            // Update progress every 10 buildings
            if (count % 10 === 0) {
                onProgress(`Creating buildings... ${count}/${geojson.features.length}`);
            }
        }

        onProgress(`Loaded ${count} buildings`);
        console.log(`[OSMCityBuilder] Loaded ${count} buildings with terrain`);
    } catch (error) {
        console.error('[OSMCityBuilder] Load buildings failed:', error);
        throw error;
    }
}

/**
 * Center camera on loaded area.
 */
export function centerCamera(
    camera: THREE.OrthographicCamera,
    controls: OrbitControls
): void {
    camera.position.set(200, 300, 200);
    controls.target.set(0, 0, 0);
    controls.update();
}
