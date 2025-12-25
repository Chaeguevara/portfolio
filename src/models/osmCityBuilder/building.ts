/**
 * @fileoverview Building geometry creation for OSM City Builder.
 */

import * as THREE from 'three';

interface BuildingMesh extends THREE.Mesh {
    userData: {
        osmId: string;
        address?: string;
        height: number;
        isHighlighted: boolean;
    };
}

const defaultMaterial = new THREE.MeshStandardMaterial({
    color: 0xcccccc, // Light gray
    roughness: 0.7,
    metalness: 0.1
});

const highlightMaterial = new THREE.MeshStandardMaterial({
    color: 0xffb3b3, // Pastel red
    roughness: 0.7,
    metalness: 0.1
});

/**
 * Create 3D building mesh from footprint points.
 */
export function createBuildingMesh(
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

export { defaultMaterial, highlightMaterial };
export type { BuildingMesh };
