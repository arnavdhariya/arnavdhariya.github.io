import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://arnavdhariya.github.io',
  integrations: [sitemap()],
});
