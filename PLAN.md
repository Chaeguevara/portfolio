# Project Plan - OSM Terrain & City Generator

## Current Implementation Flow

### Phase 1: Terrain Projection & Building Generation

**Goal:** Project building outlines onto terrain surface and extrude buildings from terrain

#### Step 1: Generate Terrain Surface
- [x] Fetch elevation data from Open-Elevation API
- [x] Generate terrain mesh (surface only, not solid yet)
- [x] Terrain is solid with top surface, bottom base, and perimeter walls

#### Step 2: Get Building Outlines
- [x] Fetch building data from OSM Overpass API
- [x] Parse GeoJSON building footprints
- [x] Convert lat/lon coordinates to Three.js scene coordinates

#### Step 3: Project Buildings onto Terrain
For each building outline:

**3.1 Vertical Projection (Raycasting)**
- [x] Move building outline to arbitrarily high Y position (e.g., Y=20000)
- [x] Cast rays downward (-Y direction) from each outline vertex
- [x] Find intersection points with terrain surface

**3.2 Get Projected Outline**
- [x] Collect all intersection points from raycasting
- [x] Form projected outline on terrain surface

**3.3 Find Highest Point (Foundation Pad Approach)**
- [x] From projected outline points, find maximum Y value
- [x] This Y value = where building pad sits (foundation fills down to terrain)

**3.4 Foundation Pad Creation**
- [x] Create horizontal pad at highest elevation point
- [x] Add vertical walls connecting pad down to actual terrain surface
- [x] Building sits on top of the foundation pad

**3.5 Extrude Building**
- [x] Extrude outline upward by building height (from OSM data)
- [x] Building now sits on foundation pad at correct elevation

#### Step 4: Solidify Terrain
**3.6 Convert Terrain to Solid**
- [ ] Add bottom surface at depth = -terrainThickness
- [ ] Add vertical walls around perimeter
- [ ] GUI parameter: terrain thickness (controllable)

**3.7 Boolean Operations**
- [ ] Subtract building volumes from solid terrain
- [ ] Use three-bvh-csg library for CSG operations
- [ ] Result: buildings "cut into" terrain

### Phase 2: Fabrication & Export
- [x] STL export functionality
- [ ] Mesh watertightness validation
- [ ] Combine terrain + buildings into single printable model

### Phase 3: Interaction & Polish
- [x] Building selection (click to highlight)
- [x] Pastel color scheme
- [x] Orbit controls
- [ ] Address/coordinate search UI
- [ ] Multiple location bookmarks
