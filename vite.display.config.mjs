import { defineConfig } from 'vite';
import { resolve } from 'node:path'

// https://vitejs.dev/config
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        display: resolve(__dirname, 'display.html'),
      }
    }
  }
});