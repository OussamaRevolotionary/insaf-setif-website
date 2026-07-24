import { defineConfig } from 'vite';

// GitHub Pages serves this project at /insaf-setif-website/, not the domain root.
// Keep the dev server at root ('/') so local development is unaffected.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/insaf-setif-website/' : '/',
}));
