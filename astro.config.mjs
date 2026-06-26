import { defineConfig } from 'astro/config';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

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
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    // Leave mermaid fences as plain <code class="language-mermaid"> so the
    // client-side renderer on study pages can pick them up.
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
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
