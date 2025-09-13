// Vite configuration for GitHub Pages deployment under a subpath
// Repo: https://github.com/Chaeguevara/portfolio
// Site: https://Chaeguevara.github.io/portfolio/
import { defineConfig } from 'vite';

export default defineConfig({
  // When deploying to https://<USERNAME>.github.io/<REPO>/ use '/<REPO>/'
  // For a custom domain or root (https://<USERNAME>.github.io/), set to '/'
  base: '/portfolio/',
});
