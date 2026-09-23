# Launchfolio motion pass — 2026-09-23

Reference: https://launchfolio.framer.website/

Observed its word-level opacity/blur/translate reveals, layered hero imagery, floating navigation and rotating footer vocabulary. Adapted the reveal rhythm and floating header to the existing paper-and-puzzle design. Added rolling action labels, case-study board entrances, and a bilingual contact word reel. Existing project images and box interactions remain the presentation system.

Implementation: shared `src/editorial-motion.mjs` and `editorial-motion.css`; existing GSAP and ScrollTrigger, no new packages. Reversible wrappers preserve emphasis and line breaks. Motion pause reverts animation styles. The word reel pauses outside its section. Locale rerenders clean up wrappers, listeners, timelines and triggers. OS reduced-motion uses the existing shared preference gate.

Verification:
- Production static build: home and seven project routes generated.
- Existing five tests pass; module syntax and git whitespace checks pass.
- Desktop: heading reveals, contact reel, motion pause/resume and Turkish/English switching checked; no nested duplicate word wrappers.
- Puzzle: six-piece canteen opening, keyboard placement, Reset and Skip/reveal exercised; completion reaches the canteen route.
- Phone viewport measured at 390 CSS pixels: canteen and cat-house direct routes render, no horizontal overflow; contact fits in both languages; pause leaves no hidden heading words.
- Browser error log empty on tested routes.

Still local and uncommitted. OS-level reduced-motion emulation and physical-device touch dragging were not separately exercised in this pass. Phone project-page screenshots rendered, but the browser capture returned blank images for the long homepage after viewport resizing despite visible DOM geometry; mobile contact verification is limited to DOM dimensions, overflow and controls. Desktop contact screenshots rendered normally.
