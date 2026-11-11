# Rescue 1122 — UI redesign

A responsive, single-page React redesign using Vite and Lucide icons. UI only; no emergency dispatch or backend integration.

## Run

```sh
npm install
npm run dev
```

## Production build

```sh
npm run build
npm run preview
```

Includes service detail dialogs, mobile navigation, expandable FAQs, phone links, and official training programme links. Images are stored locally in public/images; original source pages and dimensions are recorded in src/image-manifest.json. Fonts use Google Fonts with local sans-serif fallbacks. Original official site: https://www.rescue.gov.pk/.

Design direction: Rescue red, forest green, warm off-white, generous typography, real service photography, visible keyboard focus and reduced-motion support. This is an independent UI concept, not an official replacement or live dispatch service.

## Image quality and interaction update

The page uses local WebP originals and responsive srcSet variants. Hero and fire images are 1600px wide, flood imagery is 1800px wide, and the training photograph is 4160px wide. Other documentary service photographs retain their available native resolution (740–1024px); no source is artificially upscaled. Original dimensions and source pages are recorded in src/image-manifest.json, and photography credits are available in the page footer.

The two featured services use larger cards, with a three-column service collection below and a single-column phone layout. Service details use a native modal dialog with keyboard focus containment, Escape to close, focus restoration, and previous/next controls (also left/right arrow keys). Entrance and section reveals respect prefers-reduced-motion and leave content visible if animation is unavailable.
