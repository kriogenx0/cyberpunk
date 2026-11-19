# Night City Decision Map

A fan-made helper for Cyberpunk 2077 (base game + Phantom Liberty). It shows the story's major decisions as an interactive left-to-right flowchart, tracks the choices you made, and tells you which endings you can still reach.

**Contains story spoilers.** Turn on *Spoiler shield* to blur outcomes you haven't reached.

## Features

- **Flowchart**: every main-story decision, key side questlines and all endings. Drag to pan, scroll or pinch to zoom, click a node for details, consequences and tips. Log your pick right from the panel.
- **Endings**: live requirement checklists for The Devil, The Star, The Sun, Temperance, The Tower, the rooftop ending and the secret route.
- **Checklist**: every quest in story order with dropdowns for each decision.
- Search (`/`), act filters, "Fit" overview (`F`). Progress is saved in your browser.

## Develop

```sh
npm install
npm run dev       # local dev server
npm run build     # static build to dist/
npm run preview   # serve the build on :4173
```

## Deploy

The site is fully static. `Dockerfile` builds it with Node 22 and serves `dist/` with nginx on port 80 (SPA fallback in `nginx.conf`).

```sh
docker build -t nightcity-map . && docker run -p 8080:80 nightcity-map
```

Story data lives in `src/data.js`; add nodes and edges there and the layout updates automatically.

Unofficial fan project, not affiliated with or endorsed by CD PROJEKT RED. No game assets are used.
