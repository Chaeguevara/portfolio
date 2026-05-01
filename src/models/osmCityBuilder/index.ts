/**
 * @fileoverview Re-export all OSM City Builder modules.
 */

// Coordinates
export { latLonToScene, getFootprintPoints, getFootprintPointsFromTerrain } from './coordinates';

// Building
export { createBuildingMesh, defaultMaterial, highlightMaterial } from './building';
export type { BuildingMesh } from './building';

// Terrain
export { projectToTerrain, createFoundationPad, createTerrainMesh } from './terrain';

// Scene Setup
export {
    createCamera,
    createRenderer,
    createControls,
    addLighting,
    createGround,
    addCoordinateHelpers,
    initializeScene,
    handleResize,
    type SceneComponents
} from './sceneSetup';

// UI
export {
    createUIPanel,
    createLoadingOverlay,
    addSpinnerAnimation,
    showLoading,
    hideLoading,
    initializeUI,
    type UIComponents
} from './ui';

// Interaction
export {
    handleBuildingClick,
    createClickHandler,
    type SelectionState
} from './interaction';

// Export
export {
    exportToSTL,
    createExportHandler
} from './export';

// Data Loader
export {
    loadBuildings,
    centerCamera
} from './dataLoader';
