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

## Model-Tiered Workflow (Token Efficiency)

The main session runs on Opus and should reserve its tokens for what only Opus does well:
high-level reasoning, architecture decisions, planning, ambiguous design judgment, and
**evaluating the output of cheaper models**.

**Delegate implementation to Sonnet/Haiku via subagents** whenever the task is mechanical:

| Task type | Run on | Why |
|-----------|--------|-----|
| Architecture design, API design, novel algorithms | Opus (main) | Requires deep reasoning |
| Planning, breaking work into steps | Opus (main) | Requires judgment |
| Ambiguous bug investigation (root cause unclear) | Opus (main) | Hypothesis generation |
| Code reading / search / grep across files | Sonnet via Explore agent | Mechanical, parallelizable |
| Implementing a well-specified change | Sonnet via general-purpose agent | Pattern matching |
| Writing tests for already-designed code | Sonnet | Mechanical |
| Refactor/rename/move with clear spec | Haiku | Pure transformation |
| Build verification, lint fixing, formatting | Haiku via subagent or hook | No judgment needed |
| Reading large files for fact extraction | Sonnet via Explore | Bandwidth heavy |

**How to delegate from Opus**:
- Use the `Agent` tool with `subagent_type: "general-purpose"` and `model: "sonnet"` (or `"haiku"`)
- Pass a fully-specified prompt — Opus has already done the thinking, so the subagent
  just needs the *what*, not the *why*
- Expect to verify the result: a subagent's report is a claim, not a guarantee.
  Spot-check critical edits with `Read` before reporting done

**Anti-pattern**: Opus running `grep` across 50 files itself, or hand-writing a 200-line
boilerplate scene. Both should be delegated.

**Pattern**: Opus designs the cylindrical-hinge geometry → spawns Sonnet subagent with
"implement `addKnuckleCylinder()` matching this signature, here's the math" → reviews
the diff, fixes any subtle bugs.

## Origami / Kirigami Fold Pipeline (golden-standard SVGs)

The `/lab` and `/simulator` pages fold crease patterns and export "golden-standard"
SVGs for real-world folding. Core modules in `src/app/fold/`:

- **`svgImport.ts`** — parse crease-pattern SVG → `FoldPattern`. Order-invariant
  (duplicated edges resolve by assignment priority M/V > F > C > B > U). `foldFormat.ts`
  does the same for FOLD v1.0 (lossless round-trip).
- **`solver.ts`** — compliant bar-and-hinge fold solver (Verlet, port of Origami
  Simulator). No collision; settles to a low-energy state, not necessarily fully flat.
- **`foldability.ts`** — Maekawa + Kawasaki flat-foldability at each interior vertex
  (topological boundary detection). The *correct* measure of flat-foldable (folded
  flatness in the compliant solver is NOT a proxy).
- **`collision.ts`** — self-intersection (Möller–Trumbore), physical validity. Only
  meaningful at mid-fold (~0.7); flat layers stack coplanar near 100% and false-positive.
- **`patternGen.ts`** — the Foundry generators (yoshimura/kresling/miuraTube/waterbomb/
  gluelessBox). Every emitted SVG is golden: element `opacity` = fold angle, mm scale,
  `<g id="cut">`/`<g id="score">` laser layers, `<title>`/`<desc>` legend, **closed** cut
  outline. gluelessBox borders use coverage-sampling (T-junction robust).
- **`kirigami.ts`** — `applyCuts` tears the sheet along `C` (green) cut edges.
- **`material.ts`** — stock presets; thickness caps the fold angle (thick can't crease flat).

SVG convention (origamisimulator-compatible): `#ff0000`=mountain, `#0000ff`=valley,
`#000000`=border, `#00ff00`=cut, `#ffff00`=facet, `#ff00ff`=free; element `opacity`
= fold angle (1.0=180°). All emitters (`svgOf`, `exportPatternSVG`, `builtinSVG`,
`auxeticCutSVG`) follow it — keep new emitters golden.

Gates (all must stay green): `npm run check:fold` (unit suite, 16 tests),
`npm run validate:svgs` (folds all 49 catalog patterns + foldability/physical manifest),
`npm run manifest` (regenerates `public/patterns/FOLDABILITY.md`). Node strips TS types,
so scripts import `.ts` directly and use `scripts/domshim.mjs` for `DOMParser`.
