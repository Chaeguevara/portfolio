# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server (with --host flag for network access)
npm run build            # TypeScript compilation + Vite production build
npm run preview          # Preview production build locally
npx eslint <file>        # Lint specific file
```

## Project Architecture

### Core Concept
A client-side Three.js portfolio with SPA routing. All scenes run in the browser—no server-side logic. Deployed to GitHub Pages at `/portfolio/` subpath.

### Application Flow

1. **Entry Point** (`src/main.ts`):
   - Initializes theme system and in-progress dropdown
   - Sets up client-side router with click delegation for `[data-link]` anchors
   - Handles browser history via `popstate` events

2. **Routing** (`src/routes.ts`):
   - Maps paths to page views: `/` → home, `/works` → work grid or individual work, `/about` → about
   - **Critical**: Always calls `disposeActiveScene()` and `disposeCardPreviews()` before rendering new route to prevent memory leaks
   - Individual work pages call `createScene(id)` which initializes Three.js scene

3. **Scene Lifecycle** (`src/scene.ts`):
   - **Token-based cleanup**: Uses `currentSceneToken` to prevent race conditions when scenes load asynchronously
   - Tracks `activeScene` to update background on theme changes via `theme-changed` event
   - `createScene(id)` factory returns initializer that:
     - Disposes previous scene
     - Creates new scene with background from CSS var `--three-bg`
     - Runs work's animation function
     - Handles sync/async cleanup functions (async cleanup only applied if scene token still matches)

4. **Preview System** (`src/previews.ts`):
   - Renders small Three.js previews in work grid cards
   - Each work's animation function receives `{ preview: true }` to adjust behavior (no controls, smaller canvas)
   - Cleanup functions stored in `previewCleanups` array for batch disposal

### Scene Modules Pattern

All scenes in `src/models/*.ts` must follow this signature:

```typescript
export function sceneName(
  scene: THREE.Scene,
  opts?: { mount?: HTMLElement; preview?: boolean }
): (() => void) | Promise<() => void>
```

- **Returns**: Cleanup function (sync or async) to dispose geometries, materials, renderers, event listeners
- **opts.preview**: If `true`, render smaller version without controls (for grid cards)
- **opts.mount**: HTML element to attach canvas (defaults to `#work` for full scenes)

### Work Registry

Works are defined in `src/data/works.ts` with this structure:

```typescript
{
  title: string;
  body: string;           // Short description for card
  details?: string;       // HTML content for overlay panel (toggled with 'h' key)
  animation: (scene, opts) => cleanup | Promise<cleanup>
}
```

Every work should include `details` explaining Purpose, How it works, and Interaction.

### Theme System

- **CSS Variables**: Light/dark themes defined in `src/styles/_variables.scss`
- **Three.js Background**: Synced via `--three-bg` CSS variable
- **Theme Toggle**: Button in nav triggers `theme-changed` custom event
- All active scenes automatically update background when theme changes (via event listener in `scene.ts`)

### Styling

- **SCSS**: Main styles in `src/styles/main.scss` (imports partials)
- **Structure**: `_variables.scss` (colors, fonts), `_mixins.scss`, `_base.scss`, `_components.scss`
- **Design**: Apple-inspired minimalism with glassmorphism (backdrop-blur), smooth animations

### Build & Deploy

- **Vite Config**: Sets `base: '/portfolio/'` for GitHub Pages subpath deployment
- **Manual Chunks**: Splits Three.js into separate bundle for better caching
- **GitHub Actions**: Auto-deploys on push to `main` branch (`.github/workflows/deploy.yml`)
- **Output**: Production build in `dist/` directory

## Key Constraints

- **Static-only**: No server-side code. Browser APIs only.
- **GitHub Pages**: Must work under `/portfolio/` subpath
- **Memory Management**: Always return cleanup functions from scenes to dispose Three.js resources
- **Race Conditions**: Scene token system prevents async scenes from setting stale cleanup handlers
- **Navigation**: Use `[data-link]` attribute on links for SPA routing

## Adding a New Work

1. Create scene file in `src/models/myScene.ts` following the scene module pattern
2. Export from `src/models/index.ts`
3. Add entry to `src/data/works.ts` with title, body, details (HTML), and animation function
4. Scene will automatically appear in grid and be routable at `/portfolio/works/{id}`
