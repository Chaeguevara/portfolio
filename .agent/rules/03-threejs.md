---
trigger: always_on
---

# Three.js Guidelines

This project uses Three.js for interactive models. We aim for performance and modularity.

## Structure
- **Location**: `src/models/`
- **Pattern**: Export functions that accept a `THREE.Scene` and mount themselves.
- **Lifecycle**:
  - **Setup**: Create objects, add to scene.
  - **Loop**: Use a shared render loop if possible, or `renderer.setAnimationLoop`.
  - **Cleanup**: Crucial! Dispose geometries, materials, and textures when the component unmounts. Remove event listeners.

## Best Practices
- **Reuse**: Share geometries/materials to reduce draw calls and memory.
- **Optimization**: Clamp pixel ratio (e.g., `Math.min(window.devicePixelRatio, 2)`).
- **Responsiveness**: Handle window resize events to update camera aspect and renderer size.

## Theme & Visuals
To ensure consistency across the main viewer and previews:
- **Background**: The Three.js viewer background color is centralized.
- **CSS Source**: Define `--three-bg` in `src/style.css` (e.g., `#80ff80`).
- **Config**: Use `AppConfig.threeBackground` or `resolveThreeBgFromCss()` to get the color value in JS.
- **Requirement**: ALL scenes (pages and card previews) must use this resolved background color.

## Work Descriptions
For every work in `src/data/works.ts`:
1.  **Details**: Must include a `details` field with HTML content.
2.  **Content**: Explain *Purpose*, *How it works* (briefly), and *Interaction*.
3.  **UI**: The app displays this in an overlay, toggleable with the **'h'** key.
