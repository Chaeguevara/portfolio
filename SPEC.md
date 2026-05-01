# Project Specification

## Directory Structure

```
portfolio/
├── src/
│   ├── components/       # Reusable UI components
│   │   └── view/         # View templates (work.ts, card.ts)
│   ├── data/             # Static data (works.ts)
│   ├── lib/              # Utility modules (gpuPickHelper, overlayToggle)
│   ├── models/           # Three.js scene modules
│   │   └── assets/       # Reusable 3D assets (bicycle.ts, etc.)
│   ├── pages/            # Page generators (home, works, about)
│   ├── config.ts         # App configuration
│   ├── main.ts           # Entry point
│   ├── routes.ts         # SPA router
│   ├── scene.ts          # Scene lifecycle management
│   ├── previews.ts       # Card preview renderers
│   └── style.css         # Global styles
├── .agent/
│   ├── rules/            # AI assistant rules
│   └── workflows/        # Automated workflows
├── public/               # Static assets (copied as-is)
├── dist/                 # Build output (gitignored)
└── index.html            # HTML entry point
```

## Design Philosophy (Apple-Inspired)

- **Minimalism**: Focus on whitespace and clean layouts. Remove unnecessary borders and clutter.
- **Typography**: Prioritize legibility with a strong hierarchy using system fonts (Inter/SF Pro).
- **Materials**: Use sophisticated "Glassmorphism" (backdrop-blur) and subtle, deep shadows rather than hard lines.
- **Micro-interactions**: Smooth, intentional animations that feel organic and high-end.

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | `camelCase.ts` | `gpuPickHelper.ts` |
| Components | `camelCase` function | `work(path)` |
| Classes | `UpperCamelCase` | `class SceneManager` |
| Constants | `UPPER_SNAKE_CASE` | `const MAX_LIGHTS = 4` |
| CSS Classes | `kebab-case` + BEM | `.work-details-overlay__title` |

## Module Patterns

### Scene Modules (`src/models/*.ts`)

Each scene exports a function with this signature:
```typescript
export function sceneName(
  scene: THREE.Scene,
  opts?: { mount?: HTMLElement; preview?: boolean }
): (() => void) | Promise<() => void>
```

- **Returns**: Cleanup function (sync or async)
- **preview**: `true` for card thumbnails (smaller, no controls)

### Barrel Exports (`src/models/index.ts`)

Use named re-exports for clarity:
```typescript
export { sceneName } from "./sceneName";
```

## Adding a New Work

1. Create scene in `src/models/myScene.ts`
2. Export from `src/models/index.ts`
3. Add entry to `src/data/works.ts`:
   ```typescript
   10: {
     title: "My Scene",
     body: "Short description",
     details: "HTML for overlay panel",
     animation: (scene, opts) => myScene(scene, opts)
   }
   ```

## OSM City Builder: Coordinate System

### Problem: Coordinate Mismatch Between OSM and Three.js

**OSM/Geographic Coordinates:**
- Latitude/Longitude (lat/lon) in decimal degrees
- Latitude: -90 to +90 (negative = south, positive = north)
- Longitude: -180 to +180 (negative = west, positive = east)
- Example: Seoul Gangnam = (37.5048, 127.0596)

**Three.js Scene Coordinates:**
- Cartesian 3D space: (x, y, z)
- Y-up convention (Y = elevation/height)
- X = East-West, Z = North-South
- Units: arbitrary (we use meters scaled by 100,000)
- Origin (0,0,0) = user-defined center point

### Current Implementation Issues

1. **Equirectangular Projection** (`latLonToScene` function):
   ```typescript
   x = (lon - centerLon) * Math.cos(centerLat * PI/180) * scale
   z = -(lat - centerLat) * scale  // Negative for north = -Z
   ```
   - This is approximate, good for small areas (<1km radius)
   - Distortion increases with distance from equator

2. **Two Separate Worlds:**
   - **Terrain mesh**: Created from elevation grid with lat/lon → scene coords
   - **Building meshes**: Created from OSM footprints with lat/lon → scene coords
   - **MUST use same center point** (centerLat, centerLon) for both!

3. **Current Bug:**
   - Buildings and terrain might be using different center points
   - Raycasting fails because building XZ ≠ terrain XZ
   - Console shows: Building at (-176, 249) but raycast at (-466, 39) = wrong!

### Solution Plan

**Step 1: Verify Coordinate Consistency**
- Log centerLat, centerLon used for terrain
- Log centerLat, centerLon used for each building
- Ensure SAME values throughout

**Step 2: Fix Terrain Coverage**
- Terrain grid must cover ALL building footprints
- Calculate bounds: min/max lat/lon from all buildings
- Expand terrain grid to include all buildings + margin

**Step 3: Raycasting Debug**
- Add visual helpers: wireframe box around terrain bounds
- Add dots at building centroids
- Verify buildings fall within terrain XZ range

**Step 4: Projection Method**
Instead of raycasting, use direct terrain sampling:
```typescript
// Sample terrain height at (x, z) by interpolating grid
function sampleTerrainHeight(x: number, z: number): number {
  // Convert scene XZ back to lat/lon
  // Find nearest elevation grid cell
  // Interpolate between grid points
  return interpolatedHeight;
}
```

## Build & Deploy

```bash
npm run build           # TypeScript + Vite build
npm run preview         # Local preview of build

# GitHub Pages (via Actions)
git push origin main    # Triggers automatic deploy
```
