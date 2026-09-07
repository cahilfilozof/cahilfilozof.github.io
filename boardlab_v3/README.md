# BoardLab Pro v3

BoardLab Pro is a browser-based presentation-board generator for architecture and landscape architecture students.

## What changed in v3

- The canvas now scrolls horizontally and vertically at every zoom level.
- Zooming uses a correctly sized shell, so the board is never visually clipped by the workspace.
- Normal mouse-wheel scrolling stays available; **Ctrl + mouse wheel** zooms.
- Added **Fit** and **100%** zoom controls.
- The left sidebar has independent scrolling with `min-height: 0`, so the layout library and lower controls remain reachable.
- The layout library itself is scrollable and filterable by Design, Analysis, Technical, Planning and Portfolio.
- Presentation layouts no longer depend on the selected guide-column count.
- The board now uses a stable internal **12 × 16 snap grid**. Guide columns are visual only, preventing reflow when changing 6/8/10/12-column guides.
- Margin and gap changes resize the internal grid without wrapping modules into unintended rows.
- Modules can be dragged to exact positions on the board.
- Added many landscape-architecture-specific presentation modules and layouts.

## Layouts

1. Balanced Jury
2. Masterplan Focus
3. Render Narrative
4. Analysis Atlas
5. Heritage + Timeline
6. Solid–Void + Land Use
7. Strategy Masterplan
8. Design Development
9. Plan + Function Callouts
10. Plan + Sections
11. Planting Plan
12. Construction Details
13. Sections + Renders
14. Function Plan
15. Competition Minimal
16. Editorial Portfolio
17. Dense Jury Grid

## Presentation modules

- Heading
- Text / concept statement
- Image
- Analysis map
- Process diagram
- Historical / urban-development timeline
- Design objectives
- Numbered strategy list
- SWOT analysis
- Graphic legend
- Material legend with hatch patterns
- Plant schedule
- Section / elevation
- Before / After comparison
- Three-image photo strip
- Function callouts
- Planting / material color palette
- Project metadata
- North arrow + scale bar

## Running the app

Open `index.html` directly in Chrome/Edge, or open the folder in VS Code and use Live Server.

## Export

- PNG at 1.5×, 2× or 3× resolution
- Print / Save as PDF using the browser print dialog
- Editable `.json` project file

## Notes

Uploaded images are stored as data URLs in the browser project. Saved JSON projects can therefore become large if you use many high-resolution images.

The layouts are original BoardLab arrangements synthesized from common architecture and landscape-architecture presentation conventions: dominant master plans, analysis matrices, strategic maps, section strips, program callouts, planting schedules, material legends and editorial image hierarchy.
