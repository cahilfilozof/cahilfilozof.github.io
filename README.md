# Sevde Nur Fidan — Landscape Assembly

Interactive landscape architecture portfolio. Seven architectural folders open into real SVG jigsaws, then reveal editorial project pages containing the original drawings and renders.

## Local development

Run `npm run dev`, then open http://127.0.0.1:4174/. No dependency install is needed. Run `npm run build` after changing content or rendering helpers; it generates the homepage and all seven static project routes. Run `npm test` for geometry, source asset, localization and static link checks.

## Editing

- `src/projects.mjs`: bilingual project content, colors, puzzle image, piece counts, reveal treatment, and portfolio source pages.
- `src/render.mjs`: homepage, folders, About and case-study markup. `src/cv.mjs` preserves original CV content and translations.
- `src/geometry.mjs`: cubic jigsaw boundaries shared by adjacent pieces.
- `src/puzzle.mjs`: Pointer Events, keyboard placement, snapping, reset, skip, hints, resizing and reveal lifecycle.
- `src/main.mjs`: navigation, stored language/motion preferences, session progress, GSAP and Lenis.
- `assembly.css`: responsive visual system. `design/DIRECTION.md` and `design/QA.md`: visual references and verification notes.

GSAP 3.15 and ScrollTrigger come from the user-supplied distribution. Lenis is vendored. There are no runtime CDN dependencies. Older terrain scripts and styles remain in the repository as previous-version source, but the rebuilt site does not load them.

## Assets and provenance

The seven existing project renders remain unchanged. `assets/boards` contains full-resolution portfolio pages 3–26 and smaller responsive variants. `assets/plans` contains documented crops from those pages. `assets/provenance.json` records the sources. `scripts/extract-assets.py` reproduces the board extraction using pypdf and Pillow. No generated image is presented as Sevde’s work.

The supplied jigsaw-profile sketch is preserved in `assets/sketches` as its original JPEG and a display WebP. PDFs and board annotations remain in Turkish; the site interface and case text switch between Turkish and English.

## Interaction and access

Desktop puzzles contain 6–8 pieces, tablet 6, and phone 4. Drag with mouse/touch/pen or focus a piece and press Enter/Space to place it. Arrow keys move it; Shift gives finer movement. Skip, reset and Escape are supported. Closing restores focus. Completed projects open directly for the rest of the tab session. Direct links work without playing or without JavaScript.

The motion toggle is saved locally. OS reduced motion takes precedence and removes animated scattering/reveals. The phone layout uses native page scrolling.

## Hosting

Generated HTML is ready for the existing GitHub Pages setup. `_config.yml` excludes local BoardLab/Toolkit, development scripts, tests and design references from Jekyll output. Preserve those exclusions if replacing Jekyll with a custom deployment workflow. There are no portfolio links to either local tool.
