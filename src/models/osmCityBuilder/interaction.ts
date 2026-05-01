/**
 * @fileoverview Interaction handlers for OSM City Builder.
 * Handles mouse clicks, building selection, and raycasting.
 */

import * as THREE from 'three';
import type { BuildingMesh } from './building';
import { defaultMaterial, highlightMaterial } from './building';

/**
 * Building selection state.
 */
export interface SelectionState {
    selectedBuilding: BuildingMesh | null;
}

/**
 * Handle mouse click for building selection.
 */
export function handleBuildingClick(
    event: MouseEvent,
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    buildings: BuildingMesh[],
    selectionState: SelectionState
): void {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(buildings);

    if (intersects.length > 0) {
        const building = intersects[0].object as BuildingMesh;

        // Deselect previous
        if (selectionState.selectedBuilding && selectionState.selectedBuilding !== building) {
            selectionState.selectedBuilding.material = defaultMaterial;
            selectionState.selectedBuilding.userData.isHighlighted = false;
        }

        // Toggle highlight
        if (!building.userData.isHighlighted) {
            building.material = highlightMaterial;
            building.userData.isHighlighted = true;
            selectionState.selectedBuilding = building;
            console.log(`[OSMCityBuilder] Selected building:`, building.userData);
        } else {
            building.material = defaultMaterial;
            building.userData.isHighlighted = false;
            selectionState.selectedBuilding = null;
        }
    }
}

/**
 * Create click handler bound to scene state.
 */
export function createClickHandler(
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer,
    buildings: BuildingMesh[],
    selectionState: SelectionState
): (event: MouseEvent) => void {
    return (event: MouseEvent) => {
        handleBuildingClick(event, camera, renderer, buildings, selectionState);
    };
}
