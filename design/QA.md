# Landscape Assembly — verification and fidelity ledger

## 22 September refinement pass

User requested a contained improvement pass and richer background texture. Added code-native decorative contour lines (not survey data), paper grain, drafting dots, woven About stock, clearer Explore/Assemble actions, replay, larger controls, tighter mobile hero and case-study chapter links. These are intentional user-authorized deviations from the earlier concept.

Compared `hero.png` and current IAB capture `refined-hero.png` through view_image. Checked five points: (1) original headline and nav copy preserved; (2) original folder/hero composition retained; (3) pine/paper palette preserved with subtle sage/clay washes; (4) texture remains behind readable foreground content; (5) control type sizes increased intentionally. Existing native-size comparison and embedded-browser scaling limitation above still apply; this pass checked the current desktop viewport and measured mobile width of 390px without document overflow. No new ImageGen pass was needed for this bounded refinement of the existing direction.

Verified direct exploration, replay after a project visit, four-piece mobile placement, close/focus restoration, animated skip-to-case, and drawing chapter scrolling (archive positioned about 90px below the viewport top). Console clean. Five automated tests pass, including all seven bilingual direct/replay controls and chapter targets. Latest build and diff checks pass. The revised implementation remains faithful to the original direction with the explicit texture/navigation adaptations; no blocking visual issue was observed. These refinements are local, not yet pushed.

Verified 21 September 2026 against `hero.png`, `collection.png`, `puzzle.png`, `about.png`, and `case.png` in this directory. These are working design references, not user-approved project artwork. The adaptation rules in DIRECTION.md take precedence over invented imagery and annotations within them.

## Visual method

Used Codex In-app Browser on local port 4174. Captured screenshots with the browser screenshot API as `actual-*.png`, then opened reference and rendered images through `view_image` in the same QA pass. This was visual comparison, not a pixel-difference score.

Reference dimensions: 1536 × 1024. Inspected a near-native CSS viewport of 1536 × 1025. The embedded browser's 0.88 device scale and screenshot padding prevent an exact 1:1 exported raster comparison; `actual-hero-native.png` records the capture. Default desktop/current viewport screenshots were checked separately. Phone testing used measured CSS dimensions 390 × 845, plus an intermediate width of 444. Overrides were reset afterward.

| Comparison | Concept evidence | Render evidence | Resolution |
| --- | --- | --- | --- |
| Hero hierarchy and copy | hero.png: left serif headline, restrained nav, outlined CTA | actual-hero.png and actual-hero-native.png | Same hierarchy in TR/EN. Kept English headline and CTA; added functional motion preference as documented. |
| Hero artwork | hero.png: overlapping sage/lilac/terracotta covers and six drawing pieces | actual-hero-native.png | Same composition using actual canteen plan. Intentionally replaced fabricated artwork with real crops and interactive SVG. |
| Palette and surface | All references: paper, pine type, botanical muted colors | All actual captures | Shared palette, distinct folder colors and subtle texture. Simplified photorealistic grain and decorative botanical printing for live surfaces. |
| Collection structure | collection.png: editorial introduction and stacked folders | actual-collection.png | Sticky introduction, seven numbered tabbed packages, original titles and renders. More breathing room; added direct links and session status. No fake search, dates or metrics. |
| Puzzle workspace | puzzle.png: drawing puzzle, grid, reset/skip | actual-puzzle.png | Matching SVG tabs, side trays, faint target and live progress. Verified shared cubic edges. Removed invented scales/program lists. Actual initial state has all pieces scattered. |
| About | about.png: tilted sketch, lilac field, biography | actual-about.png | Original supplied photo replaces generated substitute. Same split composition; full CV continues below. |
| Case study | case.png: oversized title, prominent drawing, concept/render | actual-case.png | Real plan, verified description, visualization and original boards. Genuine drawing proportions require more vertical space than the fabricated wide plan. |
| Type and icons | Serif hierarchy, fine outline arrows/rules | Desktop and mobile captures | Checked hero, folder/case titles, biography, nav, reset/skip and captions. Georgia and explicit sans control sizes are intentional adaptations, not exact raster-font reproduction. |
| Responsive behavior | Desktop references | actual-mobile-hero.png and actual-mobile-puzzle.png | Stacked composition, four-piece tray below target, accessible controls, no horizontal document overflow at measured 390px. |

Above-the-fold copy audit: headline, supporting sentence, brand, nav, locale, collection CTA/count match DIRECTION.md's allowed list or Turkish equivalents. Folder branding and motion preference are documented deviations. No extra eyebrow, fake client/date, score or project fact was introduced.

The implementation was faithfully verified against the documented design direction and intentional adaptations. It is not a pixel-identical reproduction of generated concepts. No known blocking visual defect remains in inspected views.

## Functional checks

- All seven desktop packages: open, keyboard placement, reset to zero, skip, dedicated project route, browser Back. Piece counts: 6, 6, 8, 8, 6, 8, 6.
- All seven at phone width in Turkish: four pieces each, placement, reset, skip and correct route.
- Actual pointer drag snapped and locked a piece on desktop and phone-sized viewport, advancing progress to 1/6 and 1/4.
- Completed all six canteen pieces through keyboard activation without Skip. Animated completion revealed its project route.
- Closing restored page access. Desktop-to-phone resizing rebuilt six pieces as four. Completed projects opened directly during the tab session.
- Language switching worked on home and cases and survived navigation. Original board annotations remain Turkish with a visible explanation.
- Motion pause/resume exercised. OS reduced-motion support is implemented through matchMedia and CSS; an OS preference change was not performed. Physical touch/pen hardware, Safari and Firefox were not tested; Pointer Events and touch-action support are implemented.
- Fixed cross-document View Transition InvalidStateError during rapid automated navigation by removing redundant CSS view transitions. Fresh animated completion and Back produced no console errors/warnings; GSAP reveals remain.
- Build generated home and seven routes. Four tests pass: matching shared cubic boundaries; responsive topology and radial snapping; all source assets and bilingual content; every generated local HTML link. `git diff --check` passed.
- Static content and direct anchors are emitted before JavaScript. No BoardLab or Toolkit links appear in generated pages. Development files and both local tools remain excluded from Jekyll output.

Local changes only; this pass does not publish or push the rebuilt portfolio.
