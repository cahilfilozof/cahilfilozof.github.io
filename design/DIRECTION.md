# Landscape Assembly — implementation specification

## Audit
Existing stack: static HTML/CSS/JavaScript, GitHub Pages/Jekyll exclusions, vendored GSAP 3.13, Lenis and Three.js. No package/build framework. Seven projects, seven WebP renders, 26-page raster portfolio PDF and one-page raster CV. No standalone project routes yet. Local BoardLab/Toolkit are unrelated and remain excluded.

Source mapping: canteen PDF 3–4; residence 5–6; collective housing 7–9; square 10–15; boundary 16–22; planning 23–25; cat house 26. Plans will be extracted without altering the underlying work. CV facts, original descriptions, phone, email, education and experience remain intact. No project dates or client/role/software attributions are added.

## Visual specification
Generated references: hero.png, collection.png, puzzle.png, about.png, case.png. These are design references, not portfolio artwork. Palette: paper #f2eee6, pine #253f37, moss #b9c39b, lilac #c6bfd0, terracotta #b97b65. Distinct editorial serif (Georgia fallback), neutral sans UI. 56px desktop gutters, 20px mobile; thin rules, folder tabs, muted paper shadows. No generic grid or game chrome.

Allowed first-screen copy: Sevde Nur Fidan; Work; About; CV; Contact; EN/TR; motion preference control; Building landscapes, piece by piece.; Landscape architecture. A collection of places, ideas and connections.; Explore the collection; The project collection; (07). Turkish equivalents are allowed. Project title/category on functional folders are allowed.

Section order: hero with three layered folder covers and genuine project-plan pieces; asymmetric collection with a sticky editorial introduction; lilac About block with supplied sketch; full original CV; large typographic contact. Case studies use genuine plan, original description, render, and relevant PDF boards with source page links. Puzzle is an entry ritual only.

## Intentional reference deviations
- Generated imagery, invented annotations, fake scales and invented facts in concepts must never reach the site. Use the actual seven renders and PDF plans instead.
- Packages and jigsaws are code-native SVG/HTML, as explicitly requested in the brief. They must support live text, clipping, drag, snap, accessibility and localization; rasterized packaging would prevent that.
- Use the actual supplied sketch, not the image generator's substitute drawing.
- Keep all seven existing projects and the complete CV despite concepts showing only selected examples.
- No automatic sound, score, timer, dates or decorative metrics. No invented header search or nav destinations from generated concepts.
- Direct route anchors, localized motion button, hints and keyboard-placement instructions are functional necessities.

## Architecture and behavior
Shared project configuration; pure jigsaw geometry; one PuzzleBoard lifecycle; small rendering helpers; build script generates home and seven indexable /projects/id/ pages. Existing static deployment retained. Use supplied GSAP 3.15 core + ScrollTrigger. Pointer Events support mouse, touch and pen; keyboard activation places a selected piece. Skip/Reset are always available. Reduced motion removes scattering animation; session completion bypasses repeat puzzles. Closing restores the originating package focus.

Desktop 6–8 pieces; tablet 6; mobile 4 in a tray below a target. Positions are clamped. Responsive resize reconstructs layout and retains placed-piece progress when piece topology is unchanged; topology changes reset gracefully. Preload only active plan/reveal. Full case-study boards lazy-load with srcset. No network runtime dependencies.

## QA acceptance
Test every project open, skip, reset, final route, back, completion persistence. Test physical drag/snap plus keyboard placement, mobile geometry, resizing, language persistence, reduced-motion control and console. Inspect generated reference and browser screenshots using view_image. Record at least copy, layout, type, palette, real-asset replacement, responsive behavior and functional states in QA.md. No claim of pixel-identical fidelity to invented raster content.
