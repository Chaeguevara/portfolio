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

## Build & Deploy

```bash
npm run build           # TypeScript + Vite build
npm run preview         # Local preview of build

# GitHub Pages (via Actions)
git push origin main    # Triggers automatic deploy
```
