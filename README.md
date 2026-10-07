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

### YouTube videos on card pages

Card pages embed matching long-form videos from the Canadian Credit Card Finder YouTube channel near the bottom (`src/components/CardVideos.astro`, lite facade: no YouTube JS until play is clicked). The data lives in `src/data/card-videos.json` and is generated, not hand-edited:

1. Add the new video ID and the card slugs it covers to `scripts/card-video-map.json` (review -> that card, head-to-head -> both cards, roundups -> only the main picks, max ~4).
2. Run `python3 scripts/sync_card_videos.py` (read-only YouTube Data API via the channel OAuth helper in `/workspace/cccf-youtube/api`; `--dry-run` prints without writing). It reports any long-form upload that is not mapped or skipped.
3. Commit the JSON and rebuild.

Scheduled (private + publishAt) videos can be synced before they go live: they ship hidden and reveal themselves client-side at publish time; their VideoObject JSON-LD is added on the next build after that.

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
