/**
 * @fileoverview Terrain and foundation pad creation for OSM City Builder.
 */

import * as THREE from 'three';
import type { ElevationPoint } from '../../lib/elevationClient';
import { latLonToScene } from './coordinates';

/**
 * Project a point down onto terrain mesh using raycasting.
 * Returns terrain elevation at that XZ position.
 */
export function projectToTerrain(
    terrainMesh: THREE.Mesh | null,
    x: number,
    z: number
): number {
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
export function createFoundationPad(
    footprintPoints: THREE.Vector2[],
    terrainMesh: THREE.Mesh | null
): { mesh: THREE.Mesh; padElevation: number } {
    // Project all footprint points to terrain and find lowest
    const terrainElevations: number[] = [];
    let lowestElevation = Infinity;

    for (const point of footprintPoints) {
        const terrainY = projectToTerrain(terrainMesh, point.x, point.y);
        console.log(`Terrain elevation at ${point.x.toFixed(2)}, ${point.y.toFixed(2)}: ${terrainY.toFixed(2)}`);
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
export function createTerrainMesh(
    elevations: ElevationPoint[],
    centerLat: number,
    centerLon: number,
    gridSize: number
): THREE.Mesh {
    console.log('[Terrain] Creating solid terrain mesh');

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

    // Top surface triangles
    for (let i = 0; i < gridSize - 1; i++) {
        for (let j = 0; j < gridSize - 1; j++) {
            const a = i * gridSize + j;
            const b = i * gridSize + (j + 1);
            const c = (i + 1) * gridSize + j;
            const d = (i + 1) * gridSize + (j + 1);

            indices.push(a, c, b);
            indices.push(b, c, d);
        }
    }

    // Bottom surface triangles (reversed winding)
    for (let i = 0; i < gridSize - 1; i++) {
        for (let j = 0; j < gridSize - 1; j++) {
            const a = bottomOffset + i * gridSize + j;
            const b = bottomOffset + i * gridSize + (j + 1);
            const c = bottomOffset + (i + 1) * gridSize + j;
            const d = bottomOffset + (i + 1) * gridSize + (j + 1);

            indices.push(a, b, c);
            indices.push(b, d, c);
        }
    }

    // Side walls
    // Front edge (i = 0)
    for (let j = 0; j < gridSize - 1; j++) {
        const topA = j;
        const topB = j + 1;
        const botA = bottomOffset + j;
        const botB = bottomOffset + j + 1;
        indices.push(topA, botA, topB);
        indices.push(topB, botA, botB);
    }

    // Back edge (i = gridSize - 1)
    for (let j = 0; j < gridSize - 1; j++) {
        const topA = (gridSize - 1) * gridSize + j;
        const topB = (gridSize - 1) * gridSize + j + 1;
        const botA = bottomOffset + (gridSize - 1) * gridSize + j;
        const botB = bottomOffset + (gridSize - 1) * gridSize + j + 1;
        indices.push(topA, topB, botA);
        indices.push(topB, botB, botA);
    }

    // Left edge (j = 0)
    for (let i = 0; i < gridSize - 1; i++) {
        const topA = i * gridSize;
        const topB = (i + 1) * gridSize;
        const botA = bottomOffset + i * gridSize;
        const botB = bottomOffset + (i + 1) * gridSize;
        indices.push(topA, topB, botA);
        indices.push(topB, botB, botA);
    }

    // Right edge (j = gridSize - 1)
    for (let i = 0; i < gridSize - 1; i++) {
        const topA = i * gridSize + (gridSize - 1);
        const topB = (i + 1) * gridSize + (gridSize - 1);
        const botA = bottomOffset + i * gridSize + (gridSize - 1);
        const botB = bottomOffset + (i + 1) * gridSize + (gridSize - 1);
        indices.push(topA, botA, topB);
        indices.push(topB, botA, botB);
    }

    solidGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    solidGeometry.setIndex(indices);
    solidGeometry.computeVertexNormals();

    const terrainMaterial = new THREE.MeshStandardMaterial({
        color: 0x8B7355, // Brown terrain
        roughness: 0.9,
        metalness: 0.1
    });

    return new THREE.Mesh(solidGeometry, terrainMaterial);
}
