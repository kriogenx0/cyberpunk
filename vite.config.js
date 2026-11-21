import { defineConfig } from 'vite';
import seo from './seo/build.js';

export default defineConfig({
  plugins: [seo()],
});
