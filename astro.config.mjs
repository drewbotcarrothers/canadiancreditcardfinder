// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { HUB_REDIRECTS } from './src/lib/hubs';

export default defineConfig({
  output: 'static',
  site: 'https://canadiancreditcardfinder.com',
  trailingSlash: 'always',
  // Fallback only: on Hostinger, public/.htaccess returns a real 301 before this
  // meta-refresh page is ever served. Keep both in sync via HUB_REDIRECTS.
  redirects: HUB_REDIRECTS,
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
