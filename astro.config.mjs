// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: 'https://canadiancreditcardfinder.com',
  trailingSlash: 'always',
  // Astro 7 defaults to 'jsx' whitespace stripping; keep v5/v6 HTML-aware compression so inline spacing is unchanged.
  compressHTML: true,
  // Static fallback for retired URLs (meta refresh + canonical). Apache serves the real 301s from public/.htaccess first.
  redirects: {
    '/card/bmo-air-miles-mastercard': '/card/bmo-blue-rewards-mastercard/',
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
      },
    },
  },
});
