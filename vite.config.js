import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import vitePluginIt from '@tahir-baloch1408/vite-plugin-it';

export default defineConfig({
  plugins: [
    tailwindcss(),
    vitePluginIt(),
  ],
  resolve: {
    alias: {
      '@tahir-baloch1408/rind-core': '/packages/rind-core/src/index.js',
      '@tahir-baloch1408/vite-plugin-it': '/packages/vite-plugin-it/src/index.js',
      'tahir-code-easy': '/packages/tahir-code-easy/index.js',
    },
  },
});