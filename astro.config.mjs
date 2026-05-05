import { defineConfig } from 'astro/config';

// GitHub Pages deployment config:
//   site = canonical origin
//   base = repo subpath
// Each route in src/pages/ produces dist/<route>/index.html, so refresh and
// back-button work natively without any SPA fallback trick.
export default defineConfig({
  site: 'https://chaeguevara.github.io',
  base: '/portfolio/',
  output: 'static',
  trailingSlash: 'ignore',
  build: {
    assets: 'assets',
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks: {
            three: ['three'],
          },
        },
      },
    },
  },
});
