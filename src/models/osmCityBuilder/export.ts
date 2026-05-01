/**
 * @fileoverview STL export functionality for OSM City Builder.
 * Handles CSG boolean operations and file download.
 */

import * as THREE from 'three';
import { Evaluator, SUBTRACTION, Brush } from 'three-bvh-csg';
import type { BuildingMesh } from './building';

/**
 * Export scene to STL with CSG boolean operations.
 * Buildings are subtracted from terrain for clean 3D printing.
 */
export async function exportToSTL(
    terrainMesh: THREE.Mesh | null,
    buildings: BuildingMesh[]
): Promise<void> {
    console.log('[OSMCityBuilder] Exporting to STL with CSG operations...');

    try {
        // Dynamic import of STLExporter
        const { STLExporter } = await import('three/examples/jsm/exporters/STLExporter.js');
        const exporter = new STLExporter();

        let stlString: string;
        let filename: string;

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
            const finalMesh = new THREE.Mesh(terrainBrush.geometry, terrainBrush.material);

            // Add buildings on top
            const group = new THREE.Group();
            group.add(finalMesh);
            buildings.forEach(building => group.add(building.clone()));

            stlString = exporter.parse(group, { binary: false }) as string;
            filename = 'osm-city-terrain.stl';

            console.log('[OSMCityBuilder] STL export with CSG complete');
        } else {
            // Fallback: export buildings only
            const group = new THREE.Group();
            buildings.forEach(building => group.add(building.clone()));

            stlString = exporter.parse(group, { binary: false }) as string;
            filename = 'osm-city.stl';

            console.log('[OSMCityBuilder] STL export (buildings only) complete');
        }

        // Download file
        downloadSTL(stlString, filename);
    } catch (error) {
        console.error('[OSMCityBuilder] STL export failed:', error);
    }
}

/**
 * Download STL file to user's computer.
 */
function downloadSTL(stlString: string, filename: string): void {
    const blob = new Blob([stlString], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}

/**
 * Create keyboard handler for export.
 */
export function createExportHandler(
    terrainMesh: THREE.Mesh | null,
    buildings: BuildingMesh[]
): (event: KeyboardEvent) => void {
    return (event: KeyboardEvent) => {
        if (event.key === 'e' || event.key === 'E') {
            exportToSTL(terrainMesh, buildings);
        }
    };
}
