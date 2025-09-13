# Project Philosophy and Guidelines

This repository hosts a client‑side web app deployed on GitHub Pages. All features must run entirely in the browser without any server‑side components. The codebase favors modular design and clear separation of concerns, with Three.js powering interactive works.

## Purpose
- Provide a lightweight, modular portfolio app that can be deployed to GitHub Pages.
- Showcase Three.js based works in a way that is easy to extend and maintain.

## Hosting Constraints (GitHub Pages)
- Static hosting only: no server or SSR. Assume browser‑only APIs.
- Bundle dependencies; do not rely on runtime package installs. Prefer local builds over third‑party CDNs to avoid CSP/CORS surprises.
- Use relative asset paths so content works under repository subpaths (e.g., `https://<user>.github.io/<repo>/`). If using Vite, configure `base` accordingly.
- Avoid secrets, private APIs, or anything requiring authentication.
- Keep payload sizes reasonable; lazy‑load where appropriate.

## Three.js Works
- Structure: place self‑contained scene/animation modules under `src/models/`. Export functions that accept a `THREE.Scene` (and optionally a mount element) and set up the work.
- Renderer lifecycle: create at most one renderer per mounted scene. Attach to a known container (currently `#work`).
- Responsiveness: handle window resize (update camera aspect/projection and renderer size). Clamp device pixel ratio for performance.
- Cleanup: on route changes, remove animation loops, GUI, event listeners, and dispose geometries/materials/textures when applicable.
- Performance: reuse shared geometries/materials when possible; avoid creating objects in hot loops; prefer `renderer.setAnimationLoop` for consistency.
- Debug/GUI: `lil-gui` and helpers are welcome, but should be optional and kept lightweight; avoid shipping heavy debug tooling by default.

## Modularity
- Favor small, composable modules and pure helpers (e.g., camera/renderer factories, geometry/mesh builders).
- Keep DOM access centralized and explicit; pass the mount element instead of querying globally when feasible.
- Use clear names and export only what’s needed from each module.

## Styling
- Bootstrap is sufficient for now. Place custom tweaks in `src/style.css` and keep them minimal.
- Fancy CSS/theming can be layered later without disrupting structure.

## Tooling and Commands
- Use Node LTS. Keep the toolchain simple (TypeScript, ESLint, Vite or equivalent bundler).
- Scripts should cover: type‑check, lint, build, and local preview.
- Deployment: `npm run build` should produce a static `dist/` ready for GitHub Pages. Configure the repo or an action to publish `dist/`.

## Contribution Guidelines
- Keep files focused and small; avoid unrelated refactors.
- Follow existing code style and directory layout (`src/pages`, `src/components`, `src/models`, etc.).
- Prefer TypeScript types/interfaces for clear contracts.
- Remove dead code and noisy console logs before merging; keep helpful runtime warnings during development only.
- Document non‑obvious decisions with short comments or this file.

## Browser Support
- Target modern evergreen browsers. Avoid Node‑only APIs and experimental features that lack broad support unless properly guarded.

## Out of Scope
- Server‑side features, secret management, or runtime package installation.
- Assumptions that require non‑static hosting or custom headers.

By adhering to these guidelines, each component and Three.js work will remain modular, maintainable, and compatible with GitHub Pages’ static hosting model.

## Vite Static Deploy Cheatsheet

This app uses Vite. Production builds go to `dist/` and can be hosted on any static provider. Key references adapted from Vite’s static deployment guide.

### Build
- Install deps: `npm ci`
- Build: `npm run build` (runs `tsc && vite build`)
- Preview locally: `npm run preview`

### Base Path (subpath hosting)
- When the site is served under a subpath (e.g., GitHub Pages at `/<repo>/`), set Vite’s `base`.
- Example `vite.config.ts`:
  ```ts
  import { defineConfig } from 'vite';
  export default defineConfig({
    base: '/<repo>/', // e.g. '/portfolio/'
  });
  ```
- Use relative URLs for assets referenced in HTML and code when practical.

### Single-Page App Fallbacks
- Many static hosts need a fallback so deep links work (history mode).
- GitHub Pages: copy `index.html` to `404.html` in `dist/`.
  - Example step in CI: `cp dist/index.html dist/404.html`
- Netlify: add `_redirects` with `/* /index.html 200`.
- Cloudflare Pages / Vercel: enable SPA/History fallback or framework preset.

### GitHub Pages Deployment
- Branch-based: serve `dist/` from `gh-pages` branch.
  - Build: `npm run build`
  - Copy SPA fallback: `cp dist/index.html dist/404.html`
  - Push `dist/` to `gh-pages`.
- GitHub Actions (Pages):
  - Use `actions/upload-pages-artifact@v3` to upload `dist/` and `actions/deploy-pages@v4` to publish.
  - Ensure `vite.config.ts` sets `base: '/<repo>/'`.

### Other Providers (quick hints)
- Netlify: Build `npm run build`, Publish directory `dist`, Redirects `_redirects` → `/* /index.html 200`.
- Vercel: Framework preset “Vite”, Build `npm run build`, Output `dist`.
- Cloudflare Pages: Build command `npm run build`, Output directory `dist`.
- GitLab Pages: Produce `public/` (or configure job to copy `dist/` to `public/`).
- Firebase Hosting: `firebase.json` rewrites to `/index.html`, `public` set to `dist`.

### Deployment Tips
- Always confirm the site root in production matches the configured `base`.
- Avoid absolute `/` asset paths when hosting under subpaths.
- Keep bundles small; code-split large Three.js demos if needed.
- Add `dist/404.html` for GitHub Pages SPA routing.

## Git Commit Messages

Follow these practices (adapted from cbea.ms/git-commit) to keep history readable and useful:

- Subject line: max ~50 chars, imperative mood, capitalized, no trailing period.
- Separate subject from body with a blank line.
- Body: wrap at ~72 chars; explain what and why, not how.
- Reference issues/PRs when relevant (e.g., "Fixes #123").
- Keep each commit focused; avoid unrelated changes.
- Prefer active voice and concrete phrasing.

Example

Add responsive container for Three.js canvas

Wraps the Three.js renderer in a `.three-stage` container and
sizes the renderer to the container for better responsiveness.
Also adds a resize handler to update camera aspect and renderer size.

Files: `src/components/view/work.ts`, `src/style.css`, `src/models/earthAndSun.ts`
