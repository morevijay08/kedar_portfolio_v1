# Performance changes (v2)

## Assets (public/ went from 164 MB to about 19 MB)
- Project screenshots -> WebP (`full.webp` 1100px wide, `preview.webp` 720px wide) in each `public/assets/projects-screenshots/<id>/`
- Scroll animation: 4K JPG frames -> WebP in `public/frames/lg` (1280x720, desktop) and `public/frames/sm` (800x450, phones / Data Saver)
- `about-portrait.png` -> `about-portrait.webp`
- Removed: duplicate 10 MB copies, unused `portfolio/` and `peakposts/` screenshots, `nav-link-previews/.png.png`, 60 unused frames

## Code
- `src/lib/frameLoader.ts`, `src/hooks/useImagePreloader.ts`, `src/components/ImageSequence.tsx`: page shows after the first 24 frames; the rest load in the background; draws the nearest loaded frame if you scroll very fast; no redundant redraws
- `src/hooks/useCanvas.ts`: canvas pixel ratio capped at 1
- `src/components/smooth-scroll.tsx`: Lenis duration 2 -> 1.2
- `src/components/preloader/index.tsx`: splash 2.5s -> 1s
- `src/components/app-overlays.tsx`: particles, cursor, radial menu, realtime cursors, easter eggs load after the page (next/dynamic); elastic cursor skipped on phones
- `src/hooks/use-perf-profile.tsx`: fewer particles, lower pixel ratio
- `src/components/scrolling-preview.tsx`: project card images load only when near the screen
- `src/components/sections/hero.tsx`: portrait uses next/image + WebP
- `src/data/projects.tsx`: points at the new WebP files
- `src/app/layout.tsx`: removed the unpkg preconnect (Spline is only used on the 404 page)
- Deleted `src/lib/useImagePreloader.ts` (unused duplicate)

Not changed: package.json and all lockfiles.
