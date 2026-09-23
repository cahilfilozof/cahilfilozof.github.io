# Puzzle boxes — design and verification

The user's retail puzzle photograph supplied the title/artwork/footer anatomy, printed sidewalls, lid seam and lift-off construction. Their reference text was reviewed; the selected mechanics are dimensional packaging, adjacent projects moving aside, assembly/reveal continuity, and a full-screen image explorer. Codrops reference: https://tympanus.net/codrops/2022/06/28/make-way-grid-effect/ . Original implementation; no third-party demo code copied.

## Concept and implementation

Built-in ImageGen generated `boxes-concept.png`. Prompt brief: a warm ivory tabletop with staggered colored retail jigsaw boxes for Sevde Nur Fidan, native title bands, existing-project artwork, printed sidewalls, piece counts, Boxes/Index and Explore project/Open puzzle controls; an inset specifies the lifted lid and cardboard tray. No generated artwork is used as Sevde's work.

`actual-boxes.png` was captured through the in-app browser. Both images were opened in `view_image` during the same review. Current desktop and a 390 × 845 CSS-pixel phone viewport were checked. A near-native 1536 × 1025 CSS-pixel viewport was also checked against the 1536 × 1024 concept. The in-app browser adds capture scaling/padding, so pixel-for-pixel bitmap dimensions are not claimed.

| Comparison | Evidence and resolution |
| --- | --- |
| Physical anatomy | Concept has colored lid, title band, central artwork and footer. Implementation uses separate live lid, bottom and right wall elements with printed details. Fixed side transforms to connect at the lid plane. |
| Layout | Concept's staggered two-column collection with left introduction implemented; removed old featured-card full-width spans and inherited percentage row gaps. |
| Typography | Large editorial serif introduction, readable project titles, small printed edition and piece-count labels; controls use the existing sans-serif. |
| Palette/material | Retained the portfolio's verified project palettes, warm woven tabletop, cardboard grain and restrained shadows. Existing sage replaces the concept's teal intentionally. |
| Images/copy | All seven real titles and existing project images retained. Generated sample names and promotional slogans were rejected. Heading remains The project collection / Proje koleksiyonu. New allowed controls: Boxes/Index and Open puzzle with Turkish equivalents. |
| Motion | CSS 3D pointer tilt, adjacent boxes move aside, lid lifts from tray, pieces scatter, completion expands drawing. Reduced-motion path remains immediate. This is choreographed movement, not a rigid-body physics simulation. |
| Mobile | Boxes stack, index remains available, the puzzle uses four pieces, viewer controls wrap, and no horizontal overflow was observed. |

The implemented packaging system was visually verified against the concept with these intentional adaptations. It is not a pixel-for-pixel reproduction of the illustrative mockup. CSS 3D retains selectable/localizable text and source imagery. No infinite canvas or reconstructed terrain/model is claimed; the existing studio desk remains movable and project pages remain readable.

## Interaction verification

- Boxes/Index switch changes the actual collection layout.
- Open puzzle opens the six-piece desktop board; Enter places a piece. Closing restores surrounding boxes and focus.
- Four-piece phone board completes via Skip and opens the correct project.
- Project image viewer opens from the drawing; zoom reaches 150%, arrow panning updates translation, Next selects the visualization and resets fit. Closing restores focus to the image.
- Phone viewer has reachable zoom and close controls, working pan, and zero overflow.
- About sketch uses nine shaped SVG jigsaw pieces with assembly and replay. Clicking/Enter opens the original sketch in the viewer.
- English/Turkish switch updates new interface labels; no console errors observed in tested flows.
- Build and five existing automated geometry/asset/route/localization checks pass. New modules pass Node syntax checks.

Changes remain local, uncommitted and unpushed.
