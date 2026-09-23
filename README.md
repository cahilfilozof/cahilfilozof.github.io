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
- `refinements.css`: contour-paper textures, clearer project actions and mobile refinements; decorative contour asset is `assets/topography.svg`.
- `src/studio-render.mjs`, `src/studio.mjs`, `studio.css`: movable studio scraps, comparison and tracing tools, drawing lens, study sequence, perspective table, and return-to-folder choreography. `design/STUDIO-QA.md` records this pass.
- `src/boxes-render.mjs`, `src/boxes.mjs`, `boxes.css`: printed CSS 3D puzzle boxes, lift-off lids and cardboard trays, collection/index views, and SVG sketch assembly. Box counts describe desktop puzzles; phones use four pieces.
- `src/gallery.mjs`: native-dialog image viewer with thumbnails, 1–4× zoom, pointer/keyboard panning, fit, previous/next, original links, error feedback, Escape and focus return.

GSAP 3.15 and ScrollTrigger come from the user-supplied distribution. Lenis is vendored. There are no runtime CDN dependencies. Older terrain scripts and styles remain in the repository as previous-version source, but the rebuilt site does not load them.

## Assets and provenance

The seven existing project renders remain unchanged. `assets/boards` contains full-resolution portfolio pages 3–26 and smaller responsive variants. `assets/plans` contains documented crops from those pages. `assets/provenance.json` records the sources. `scripts/extract-assets.py` reproduces the board extraction using pypdf and Pillow. No generated image is presented as Sevde’s work.

The supplied jigsaw-profile sketch is preserved in `assets/sketches` as its original JPEG and a display WebP. PDFs and board annotations remain in Turkish; the site interface and case text switch between Turkish and English.

## Interaction and access

Desktop puzzles contain 6–8 pieces, tablet 6, and phone 4. Drag with mouse/touch/pen or focus a piece and press Enter/Space to place it. Arrow keys move it; Shift gives finer movement. Skip, reset and Escape are supported. Closing restores focus. Completed package covers open directly for the rest of the tab session; the Assemble drawing action always permits replay. Explore project bypasses the puzzle. Direct links work without playing or without JavaScript. Case-study chapter links jump to approach, visualization and drawing archive.

The motion toggle is saved locally. OS reduced motion takes precedence and removes animated scattering/reveals. The phone layout uses native page scrolling.

The studio scraps move from their labelled grips by pointer or arrow keys; Reset desk restores their positions. Each project has a draggable comparison with a keyboard range alternative, switchable drawing/board tracing layer, opacity control, keyboard/touch lens, and browsable source images. The canteen page also has a tilting image table with detail pins; it uses the existing visualization, not a reconstructed 3D model. Back to collection returns to that project's folder. These controls are translated into Turkish and English.

## Hosting

Generated HTML is ready for the existing GitHub Pages setup. `_config.yml` excludes local BoardLab/Toolkit, development scripts, tests and design references from Jekyll output. Preserve those exclusions if replacing Jekyll with a custom deployment workflow. There are no portfolio links to either local tool.
