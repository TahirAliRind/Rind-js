import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { vitePluginIt } from 'tahir-code-easy';

export default defineConfig({
  plugins: [tailwindcss(), vitePluginIt()],
});