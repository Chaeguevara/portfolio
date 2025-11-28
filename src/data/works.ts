import { drawLines, orbitObject, rotateBox, materialsShowcase, planBuilder, pickingDemo, gpuPickingDemo } from "../models";
import { Scene } from "three";
type AnimOpts = { mount?: HTMLElement; preview?: boolean };
export const Works: Record<number, {
  title: string;
  body: string;
  details?: string;
  animation: (scene: Scene, opts?: AnimOpts) => () => void;
}> = {
  1: {
    title: "helo world",
    body: "this is the new world",
    details: "A simple rotating box to demonstrate the basic Three.js setup: Scene, Camera, Renderer, and an Animation Loop.",
    animation: (scene, opts) => rotateBox(scene, opts)
  },
  2: {
    title: "My next World",
    body: "Card is making a world ",
    details: "A demonstration of drawing lines in 3D space. This can be used for visualizing paths, connections, or wireframe models.",
    animation: (scene, opts) => drawLines(scene, opts)
  },
  3: {
    title: "Orbig Galxy",
    body: "Orbiting Galaxy",
    details: "A simulation of a solar system with a sun, earth, and moon. It demonstrates object hierarchy (grouping) and relative transformations.",
    animation: (scene, opts) => orbitObject(scene, opts)
  },
  4: {
    title: "Materials Gallery",
    body: "A quick tour of common Three.js materials",
    details: "Showcases different material types in Three.js (Basic, Lambert, Phong, Standard) and how they react to light.",
    animation: (scene, opts) => materialsShowcase(scene, opts)
  },
  5: {
    title: "2D Plan Builder",
    body: "PoC: define room relations and see a 2D layout with optional arrows.",
    details: "A Proof of Concept for a 2D layout engine. It uses physics-based simulation to arrange nodes (rooms) and draws connections between them.",
    animation: (scene, opts) => planBuilder(scene, opts)
  },
  6: {
    title: "Picking Demo",
    body: "Interactive demo explaining Three.js Raycasting.",
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
};
