# Canadian Credit Card Finder

Static [Astro](https://astro.build) site for comparing Canadian credit cards. Interactive filters and compare tools run as React islands. The production build is static HTML/CSS/JS and does not need a Node server at runtime.

Live site: [canadiancreditcardfinder.com](https://canadiancreditcardfinder.com)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view the site.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Astro dev server |
| `npm run build` | Create a static production build in `dist/` |
| `npm run preview` | Preview the production build locally |

Card data is fetched at build time from the published Google Sheet CSV used by the previous Next.js site.

## Project structure

```
src/
  pages/            # Home, compare, card detail, sitemap
  components/       # React islands + Astro footer
  layouts/          # Shared HTML layout, fonts, AdSense
  lib/              # Card types, CSV parsing, helpers
  stores/           # Compare list (localStorage, shared across islands)
public/
  images/           # Logo and card images
  ads.txt
  robots.txt
```

## Deploy

This site is meant for Hostinger static hosting / GitHub auto-deploy. See [DEPLOYMENT.md](./DEPLOYMENT.md) for the build command and publish directory.
