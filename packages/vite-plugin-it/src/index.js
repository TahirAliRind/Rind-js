import { transformItToJs } from './compiler.js';

const fileRegex = /\.it$/;

export default function vitePluginIt() {
  return {
    name: 'vite-plugin-it',
    enforce: 'pre',
    transform(src, id) {
      if (fileRegex.test(id)) {
        const code = transformItToJs(src);
        return {
          code,
          map: null,
        };
      }
    },
  };
}