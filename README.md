# Sevde Nur Fidan — Landscape Architecture

Static GitHub Pages portfolio. No React runtime or build step is required.

## Running locally

Serve this directory over HTTP (ES modules cannot load from `file://`). For example, with Python installed: `python -m http.server 4173`. Open http://localhost:4173.

## Experience

- Three.js landscape study with contour shading, water ripples and terrain/planting/water controls. The terrain is illustrative, not a real project survey.
- GSAP/ScrollTrigger image reveals, typography entrances, a scroll-drawn route and moving editorial type.
- Lenis smooth wheel scrolling on fine-pointer devices; native touch scrolling on mobile.
- Project image transitions, previous/next browsing, Escape dismissal and focus restoration.
- Turkish/English site content, image descriptions and accessibility labels. Language is saved locally. Original PDF documents retain their original language.
- Motion can be paused and the preference is saved. The operating system's reduced-motion setting takes priority. WebGL animation stops while the scene is offscreen or the tab is hidden. A contour illustration remains available without WebGL.

## Files

`index.html` contains the accessible content. `i18n.js` binds Turkish/English text; keep translations aligned with content edits. `script.js` manages interaction and scroll animation. `landscape.js` builds the 3D scene. `styles.css` and `experience.css` provide the base and current visual layer. Dependencies and licenses are in `vendor/`.

BoardLab and Landscape Toolkit folders are retained locally and have no portfolio links. `_config.yml` excludes them from GitHub Pages' standard Jekyll output. If switching to a custom deployment workflow, preserve these exclusions in its upload step.

## Reference direction

- Bruno Simon and Lusion: an interactive spatial introduction, translated into a landscape study.
- Obys and Aristide Benoist: oversized type, numbered work and animated image entrances.
- Dennis Snellenberg and Locomotive: polished hover interaction and transitions.
- Studio Freight and Burton: motion related to the subject and an image-led project presentation.

Original project images are retained. No external stock media is presented as the architect's work.
