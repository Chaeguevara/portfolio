---
trigger: model_decision
---

# Tech Stack & Tooling

We keep the toolchain simple and standard.

## Core Stack
- **Runtime**: Node.js LTS
- **Language**: TypeScript
- **Bundler**: Vite
- **Linter**: ESLint (Flat Config)

## Styling
- **CSS**: Bootstrap is the base.
- **Custom**: Use `src/style.css` for tweaks.
- **Philosophy**: Keep it simple. Avoid complex CSS-in-JS libraries unless necessary. Structure comes first, fancy themes later.

## Commands
- `npm install`: Install dependencies.
- `npm run dev`: Start local dev server.
- `npm run build`: Build for production (`dist/`).
- `npm run lint`: Run ESLint.
- `npm run preview`: Preview the production build locally.

> [!NOTE]
> See [typescript-codestyle-guide.md](file:///Users/heejinchae/Documents/Dev/Personal/portfolio/.agent/rules/typescript-codestyle-guide.md) for detailed coding standards.