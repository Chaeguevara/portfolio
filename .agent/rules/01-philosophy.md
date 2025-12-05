---
trigger: always_on
---

# Project Philosophy

Welcome! This repository hosts a client‑side web app deployed on GitHub Pages. Our goal is to create a lightweight, modular portfolio that runs entirely in the browser.

## Core Values
- **Simplicity**: No server-side components. Pure static files.
- **Modularity**: Small, focused modules. Clear separation of concerns.
- **Friendliness**: Code should be easy to read for beginners but robust enough for seniors.

## Hosting Constraints (GitHub Pages)
We deploy to a static environment, so keep these in mind:
- **No Server**: Assume browser-only APIs.
- **Dependencies**: Bundle everything. No runtime installs. Avoid external CDNs if possible to prevent CORS/CSP issues.
- **Relative Paths**: Use relative paths for assets so the site works under any subpath (e.g., `https://user.github.io/repo/`).
- **Security**: No secrets or private keys in the code.
- **Performance**: Keep payloads small. Lazy-load heavy assets.

> [!TIP]
> Think "Static First". If it needs a server, reconsider if it belongs here or can be done client-side.
