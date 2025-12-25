# Completed Project Plans

## Portfolio UI Improvements
- [x] Reverse Order of Works: Higher-indexed (recent) works appear first.
- [x] Fix Dark Mode Background: Ensured Three.js scenes have a dark green background in dark mode via `AppConfig` and CSS variables.

## Theme & Visuals
- [x] Centralize Three.js viewer background:
    - [x] Define CSS variable `--three-bg` in `src/style.css`
    - [x] Export `AppConfig.threeBackground` in `src/config.ts`
    - [x] Integrate resolved background into scene initialization (`src/scene.ts`, `src/previews.ts`)

## GPU Picking Fix (Initial Phase)
- [x] Fix rotation bug in GPU picking demo.
