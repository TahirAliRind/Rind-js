import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vitePluginIt from 'vite-plugin-it';

export default defineConfig({
  plugins: [
    tailwindcss(),
    vitePluginIt(),
  ],
  resolve: {
    alias: {
      'rind-core': '/packages/rind-core/src/index.js',
      'vite-plugin-it': '/packages/vite-plugin-it/src/index.js',
    },
  },
  server: {
    watch: {
      ignored: ['!**/packages/**'],
    },
  },
});