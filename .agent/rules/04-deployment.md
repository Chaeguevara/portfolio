---
trigger: manual
---

# Deployment (Vite & GitHub Pages)

Reference cheat sheet for deploying this Vite app to GitHub Pages.

## Build Process
1.  **Install**: `npm ci`
2.  **Build**: `npm run build` (Produces `dist/`)
3.  **Preview**: `npm run preview`

## Configuration
- **Base Path**: If hosting at `https://user.github.io/repo/`, set `base: '/repo/'` in `vite.config.ts`.
- **SPA Fallback**: GitHub Pages doesn't support History API by default.
    - **Fix**: Copy `index.html` to `404.html` in the build step.
    - **Command**: `cp dist/index.html dist/404.html`

## Browser Support
- **Target**: Modern evergreen browsers (Chrome, Firefox, Safari, Edge).
- **Avoid**: Node-only APIs or experimental features without polyfills.