# Studio direction and verification — 22 September 2026

Reference: https://www.killerportfolio.com/by/jackie-zhang and the linked Jackie Zhang portfolio. Studied the charcoal/cream contrast, handwritten accents, physical scraps and invitation to explore. Original branding and content were not copied.

## Visual comparison

Generated concept: `studio-concept.png` (1536 × 1024). Actual browser capture: `actual-studio.png`. Both opened together using the image viewer for comparison. The actual capture was taken at the current desktop viewport (1035 × 902 CSS pixels); earlier desktop inspection also covered a wider layout. A pixel-for-pixel native-size match is not claimed: browser viewport and capture scaling differ from the concept canvas.

| Anchor | Implementation / result |
| --- | --- |
| Charcoal studio background | Implemented with subtle dot/grain texture; contrasts with the warm paper homepage. |
| Oversized cream serif heading | Two-line curiosity/connections heading in both languages. |
| Coral handwriting | Studio note, hero note and small index accents. |
| Four overlapping paper objects | Live HTML cards using existing drawings, visualization and supplied profile sketch; draggable labelled grips and keyboard movement. |
| Tape and varied rotations | CSS tape, shadows and independent rotations; phone layout separates grips so they remain reachable. |
| Reset control | Upper-right outlined pill, resets all scraps. |
| Torn ribbon | Draw / Assemble / Discover ribbon below the desk. |

Intentional deviations: real portfolio assets replace invented concept imagery; live text and controls replace raster labels; clean card borders preserve readable controls; decorative plants and speculative architectural models are omitted. The interactive perspective table is a tilted existing image with detail crops, not a 3D reconstruction.

## Functional checks

- Build generated homepage and all seven project routes. Five automated tests passed, covering geometry, responsive topology, actual asset paths, translated project content, direct/replay links and chapter destinations.
- Browser: keyboard scrap movement changed its position, Reset desk restored it; direct scrap project link opened the correct route.
- Comparison range reached 100%; clicking the image restored the divider to 50%. Lens toggle and arrow-key movement worked. Board tracing switched to the original page; opacity reached 15%.
- Study next control moved from drawing to visualization. Perspective angle reached 12 degrees and detail pin displayed its selected crop.
- Back to collection returned to `#package-canteen`, with that folder in the viewport, both animated and motion-paused.
- Jigsaw keyboard placement changed progress to 1/6; Reset restored 0/6; Skip completed 6/6 and navigated to the case. Completion now includes a project title and expanding drawing.
- Phone check at 390 × 845 CSS pixels: four-piece puzzle, working desk keyboard/reset, comparison and lens controls, and no horizontal page overflow. Mobile cards were further separated after inspecting grip overlap.
- English and Turkish labels inspected. Copy uses invitations to explore without inventing project outcomes. Board language remains clearly identified as Turkish.
- No console errors in the checked browser flows. OS reduced-motion logic remains respected; explicit motion pause was exercised.

This pass is local and has not been committed or pushed.
