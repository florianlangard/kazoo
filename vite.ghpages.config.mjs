import { defineConfig } from 'vite';

// nom de ton repo GitHub
const repoName = 'kazoo';

export default defineConfig({
  root: 'docs-src',
  base: `/${repoName}/`, // nécessaire pour GitHub Pages
  build: {
    outDir: '../docs', // génère dans /docs
    emptyOutDir: true
  }
});
