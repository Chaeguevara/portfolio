import { drawLines, orbitObject, rotateBox, materialsShowcase, planBuilder, pickingDemo, gpuPickingDemo } from "../models";
import { Scene } from "three";
type AnimOpts = { mount?: HTMLElement; preview?: boolean };

export type WorkCategory = "featured" | "fundamentals";

export const Works: Record<number, {
  title: string;
  body: string;
  category: WorkCategory;
  details?: string;
  animation: (scene: Scene, opts?: AnimOpts) => (() => void) | Promise<() => void>;
}> = {
  // ── Featured Projects ──────────────────────────────────────
  13: {
    title: "Single-Vertex Checker",
    body: "Interactive Kawasaki & Maekawa theorem validator for flat-foldability",
    category: "featured",
    details: `
      <h3>Purpose</h3>
      <p>Interactively explore the two fundamental theorems of single-vertex flat-foldability from MIT 6.849.</p>

      <h3>Kawasaki's Theorem</h3>
      <p>At a flat-foldable vertex with 2n creases, the alternating sum of sector angles equals zero.
      For a degree-4 vertex: <code>α₁ + α₃ = α₂ + α₄ = 180°</code></p>

      <h3>Maekawa's Theorem</h3>
      <p>The difference between Mountain (M) and Valley (V) folds must be exactly 2: <code>|M − V| = 2</code>.
      For a degree-4 vertex: 3M:1V or 1M:3V.</p>

      <h3>Interaction</h3>
      <ul>
        <li><strong>Drag</strong> the handles to adjust crease angles — sector angles update in real-time.</li>
        <li><strong>Click</strong> on crease lines to toggle Mountain/Valley assignment.</li>
        <li>The validation panel shows both conditions live — green when satisfied, red when violated.</li>
      </ul>
    `,
    animation: (scene, opts) => import("../models/singleVertexChecker").then(m => m.singleVertexChecker(scene, opts))
  },
  11: {
    title: "Crease Pattern Folding",
    body: "3D crease pattern visualization with mountain/valley fold animation",
    category: "featured",
    details: `
      <h3>Purpose</h3>
      <p>Visualize crease patterns as foldable 3D meshes. Mountain and valley folds are distinguished by color (red/blue), and the paper folds along the diagonal crease.</p>

      <h3>How it works</h3>
      <p>A square sheet is split along crease lines. The fold group rotates around the crease axis to simulate folding motion.</p>

      <h3>Interaction</h3>
      <ul>
        <li>Orbit controls to inspect the folding from different angles.</li>
        <li>Watch the automatic fold animation along the diagonal crease.</li>
      </ul>
    `,
    animation: (scene, opts) => import("../models/geometricFolding").then(m => m.geometricFolding(scene, opts))
  },
  14: {
    title: "ISO/ANTO Vertex Rule",
    body: "Biggest sector must be ISO — the core constraint of degree-4 flat-foldability",
    category: "featured",
    details: `
      <h3>Purpose</h3>
      <p>Visualize the ISO/ANTO rule for degree-4 (bird's foot) vertices. Adjacent creases sharing the same MV assignment are <strong>ISO</strong>; opposite assignments are <strong>ANTO</strong>.</p>

      <h3>Core Rule</h3>
      <p>The <strong>unique biggest angle sector</strong> must always be ISO (both adjacent creases have the same M/V assignment). This is not a choice — it's a necessary condition forced by flat-foldability.</p>

      <h3>Why?</h3>
      <p>If the largest sector's creases were ANTO (opposite), the wide paper region would flare outward and cannot lie flat. ISO ensures it folds inward cleanly.</p>

      <h3>Interaction</h3>
      <ul>
        <li><strong>Drag</strong> handles to change crease angles — the biggest sector is highlighted with ★</li>
        <li><strong>Click</strong> crease lines to toggle M/V — watch ISO/ANTO labels update</li>
        <li>All three conditions checked: ISO/ANTO rule + Kawasaki + Maekawa</li>
      </ul>
    `,
    animation: (scene, opts) => import("../models/isoAntoVertex").then(m => m.isoAntoVertex(scene, opts))
  },
  15: {
    title: "LFFG Constraint Propagation",
    body: "Graph-based visualization of MV constraint propagation across vertices",
    category: "featured",
    details: `
      <h3>Purpose</h3>
      <p>The <strong>Local Flat-Foldability Graph (LFFG)</strong> encodes compatibility constraints between adjacent vertices. Global foldability = finding a consistent MV assignment across all vertices — a Constraint Satisfaction Problem (CSP).</p>

      <h3>How it works</h3>
      <p>Each node represents a crease pattern vertex with its set of locally valid MV assignments. Edges represent shared creases — the MV label must agree on both sides. Fixing one vertex's assignment <strong>propagates</strong> constraints to neighbors.</p>

      <h3>Key Insight</h3>
      <p>Locally flat-foldable ≠ globally flat-foldable. All vertices may satisfy Kawasaki and Maekawa individually, but edge constraints can create <strong>global contradictions</strong>.</p>

      <h3>Interaction</h3>
      <ul>
        <li><strong>Click</strong> a vertex to cycle through MV assignments (blue = user-fixed)</li>
        <li>Watch constraints <strong>propagate</strong> (green = forced by neighbor)</li>
        <li>Red = <strong>conflict</strong> — no consistent assignment possible</li>
        <li><strong>Right-click</strong> to reset a vertex or the entire graph</li>
      </ul>
    `,
    animation: (scene, opts) => import("../models/lffgPropagation").then(m => m.lffgPropagation(scene, opts))
  },
  16: {
    title: "Crease Pattern Designer",
    body: "Tessellation patterns with real-time flat-foldability validation",
    category: "featured",
    details: `
      <h3>Purpose</h3>
      <p>Explore classic flat-foldable tessellation patterns. Each interior vertex is validated against Kawasaki's and Maekawa's theorems in real-time.</p>

      <h3>Preset Patterns</h3>
      <ul>
        <li><strong>Miura-ori</strong> — the gold standard deployable fold (aerospace, solar arrays)</li>
        <li><strong>Square Twist Grid</strong> — alternating diagonal twists creating rotational symmetry</li>
        <li><strong>Diagonal Grid</strong> — simple grid + diagonals for testing foldability</li>
      </ul>

      <h3>Interaction</h3>
      <ul>
        <li><strong>Click</strong> a crease to cycle: Unassigned → Mountain (red) → Valley (blue)</li>
        <li>Red dots = vertices violating Kawasaki or Maekawa</li>
        <li>Press <strong>1/2/3</strong> to switch pattern, <strong>R</strong> to reset</li>
      </ul>
    `,
    animation: (scene, opts) => import("../models/creasePatternDesigner").then(m => m.creasePatternDesigner(scene, opts))
  },
  12: {
    title: "Curved Billboard Mapping",
    body: "UV mapping optimization for images on curved LED surfaces",
    category: "featured",
    details: `
      <h3>Purpose</h3>
      <p>Solve the geometric problem of projecting flat images onto curved and non-planar LED billboard surfaces while minimizing distortion.</p>

      <h3>How it works</h3>
      <p>A curved surface mesh is generated and UV coordinates are computed to map a source image with minimal stretching. The visualization shows both the curved surface and the distortion heatmap.</p>

      <h3>Interaction</h3>
      <ul>
        <li>Adjust surface curvature parameters to see how mapping changes.</li>
        <li>Toggle distortion heatmap overlay.</li>
        <li>Orbit around the curved display to inspect from different angles.</li>
      </ul>
    `,
    animation: (scene, opts) => import("../models/curvedBillboard").then(m => m.curvedBillboard(scene, opts))
  },
  10: {
    title: "OSM City Builder",
    body: "Generate 3D cities from OpenStreetMap data with STL export",
    category: "featured",
    details: `
      <h3>Purpose</h3>
      <p>Automatically generate 3D city models from real-world OpenStreetMap data. Features address geocoding, building visualization, and STL export for 3D printing.</p>

      <h3>How it works</h3>
      <p>Uses Nominatim API for geocoding and Overpass API to fetch building footprints:</p>
      <pre><code>// 1. Geocode address to coordinates
const {lat, lon} = await geocode("1600 Amphitheatre Parkway");

// 2. Fetch buildings from OSM
const buildings = await fetchBuildingsInRadius(lat, lon, 500);

// 3. Generate 3D meshes with ExtrudeGeometry
const shape = new THREE.Shape(polygonPoints);
const geometry = new THREE.ExtrudeGeometry(shape, {depth: height});</code></pre>

      <h3>Interaction</h3>
      <ul>
        <li><strong>Click</strong> on buildings to highlight them in pastel red.</li>
        <li>Press <strong>'e'</strong> to export the entire scene to STL format for 3D printing.</li>
        <li>Use mouse to orbit and zoom around the city.</li>
      </ul>

      <p><strong>Default Location</strong>: Google HQ, Mountain View, CA</p>
    `,
    animation: (scene, opts) => import("../models/osmCityBuilder").then(m => m.osmCityBuilder(scene, opts))
  },

  // ── Three.js Fundamentals ──────────────────────────────────
  1: {
    title: "Rotating Box",
    body: "Your first step into Three.js",
    category: "fundamentals",
    details: `
      <h3>Purpose</h3>
      <p>Demonstrates the fundamental Three.js setup: Scene, Camera, Renderer, and an Animation Loop.</p>

      <h3>How it works</h3>
      <p>The core loop updates the box's rotation every frame:</p>
      <pre><code>mesh.rotation.x += 0.01;
mesh.rotation.y += 0.01;</code></pre>

      <h3>Interaction</h3>
      <p>Watch the box rotate continuously in 3D space.</p>
    `,
    animation: (scene, opts) => rotateBox(scene, opts)
  },
  2: {
    title: "Line Drawing",
    body: "Drawing dynamic lines in 3D space",
    category: "fundamentals",
    details: `
      <h3>Purpose</h3>
      <p>Demonstrates how to visualize paths, connections, or wireframe models using Three.js LineBasicMaterial.</p>

      <h3>How it works</h3>
      <p>Define vertices in 3D space and connect them:</p>
      <pre><code>const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);</code></pre>

      <h3>Interaction</h3>
      <p>Observe the lines forming geometric patterns in 3D space.</p>
    `,
    animation: (scene, opts) => drawLines(scene, opts)
  },
  3: {
    title: "Orbital System",
    body: "Hierarchical transformations in 3D",
    category: "fundamentals",
    details: `
      <h3>Purpose</h3>
      <p>Simulates a solar system with sun, earth, and moon to demonstrate object hierarchy (grouping) and relative transformations.</p>

      <h3>How it works</h3>
      <p>Objects are nested in groups, inheriting parent transformations:</p>
      <pre><code>// Earth orbits sun
sunGroup.add(earthGroup);
earthGroup.position.x = 10;
earthGroup.rotation.y += 0.01;

// Moon orbits earth
earthGroup.add(moonGroup);
moonGroup.position.x = 2;
moonGroup.rotation.y += 0.03;</code></pre>

      <h3>Interaction</h3>
      <p>Watch the nested rotation creating realistic orbital mechanics.</p>
    `,
    animation: (scene, opts) => orbitObject(scene, opts)
  },
  4: {
    title: "Materials Gallery",
    body: "Exploring Three.js materials and lighting",
    category: "fundamentals",
    details: `
      <h3>Purpose</h3>
      <p>Showcases different material types (Basic, Lambert, Phong, Standard) and how they react to light.</p>

      <h3>How it works</h3>
      <p>Each material responds differently to light:</p>
      <pre><code>// MeshBasicMaterial: No lighting
const basicMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

// MeshLambertMaterial: Diffuse lighting
const lambertMat = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

// MeshPhongMaterial: Specular highlights
const phongMat = new THREE.MeshPhongMaterial({
  color: 0x0000ff,
  shininess: 100
});</code></pre>

      <h3>Interaction</h3>
      <p>Compare how each material reacts to the scene's lighting.</p>
    `,
    animation: (scene, opts) => materialsShowcase(scene, opts)
  },
  5: {
    title: "2D Plan Builder",
    body: "Physics-based layout engine for architectural planning",
    category: "fundamentals",
    details: `
      <h3>Purpose</h3>
      <p>A Proof of Concept for a 2D layout engine that uses physics-based simulation to arrange nodes (rooms) and draws connections between them.</p>

      <h3>How it works</h3>
      <p>Uses force-directed graph layout:</p>
      <pre><code>// Nodes repel each other
for (let node of nodes) {
  const repulsion = calculateRepulsion(node, others);
  node.velocity.add(repulsion);
}

// Connected nodes attract
for (let edge of edges) {
  const attraction = calculateAttraction(edge.source, edge.target);
  edge.source.velocity.add(attraction);
  edge.target.velocity.sub(attraction);
}</code></pre>

      <h3>Interaction</h3>
      <p>Watch the rooms automatically organize themselves based on their relationships.</p>
    `,
    animation: (scene, opts) => planBuilder(scene, opts)
  },
  6: {
    title: "Picking Demo",
    body: "Interactive demo explaining Three.js Raycasting.",
    category: "fundamentals",
    details: `
      <h3>How it works</h3>
      <p>This demo illustrates <strong>Raycasting</strong>, a method to determine what objects are under the mouse cursor.</p>
      <ol>
        <li><strong>Mouse Position</strong>: We track the mouse coordinates and convert them to a range of -1 to +1 (Normalized Device Coordinates).</li>
        <li><strong>Raycaster</strong>: We cast a ray from the camera through the mouse position into the 3D scene.</li>
        <li><strong>Intersection</strong>: We check if this ray intersects with any of the cubes.</li>
      </ol>
      <p><strong>Interaction</strong>: Move your mouse over the cubes to see them turn red.</p>
    `,
    animation: (scene, opts) => pickingDemo(scene, opts)
  },
  7: {
    title: "GPU Picking Demo",
    body: "Optimized picking for many objects using GPU off-screen rendering.",
    category: "fundamentals",
    details: `
      <h3>How it works</h3>
      <p>This demo uses <strong>GPU Picking</strong>, an optimization for scenes with many objects.</p>
      <ol>
        <li><strong>Off-screen Rendering</strong>: We render the scene to a hidden texture where every object has a unique color.</li>
        <li><strong>Pixel Reading</strong>: When you move the mouse, we read the color of the pixel under the cursor from this hidden texture.</li>
        <li><strong>Identification</strong>: The color tells us exactly which object ID was hit, without doing complex math for every object.</li>
      </ol>
      <p><strong>Interaction</strong>: Move your mouse over the rotating cubes. Notice how smooth it is even with many objects!</p>
    `,
    animation: (scene, opts) => gpuPickingDemo(scene, opts)
  },
  8: {
    title: "Cozy Cartoon Bike",
    body: "A procedural bicycle rendered with Cel shading.",
    category: "fundamentals",
    details: `
        <h3>A Cozy Ride</h3>
        <p>This scene uses <strong>Toon Shading</strong> (Cel Shading) to create a hand-drawn, illustrative feel.</p>
        <ul>
          <li><strong>Procedural Geometry</strong>: The bicycle is built entirely from code using basic shapes (Cylinders, Tori).</li>
          <li><strong>Gradient Map</strong>: A custom 3-tone gradient texture snaps the lighting into distinct bands (Dark, Mid, Light).</li>
        </ul>
        <p><strong>Tech</strong>: <code>THREE.MeshToonMaterial</code>, <code>THREE.DataTexture</code> (Gradient).</p>
      `,
    animation: (scene, opts) => import("../models/cartoonBicycle").then(m => m.cartoonBicycle(scene, opts))
  },
  9: {
    title: "Simple Asset Test",
    body: "Verifying asset loading architecture.",
    category: "fundamentals",
    details: "A red box loaded from <code>src/models/assets/simpleBox.ts</code> used in <code>simpleTestScene.ts</code>.",
    animation: (scene, opts) => import("../models/simpleTestScene").then(m => m.simpleTestScene(scene, opts))
  }
};
