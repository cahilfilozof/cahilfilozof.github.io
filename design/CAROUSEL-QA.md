# Box carousel and opening repair — 2026-09-23

- Native horizontal scroll-snap collection, centered active box, tilted/dimmed neighbors, previous/next controls and Home/End/arrow keys. Index view retained. Turkish/English controls; no automatic advance.
- Jigsaw SVG hover cursor replaces the circular OPEN badge. Normal cursor remains for touch and paused motion.
- Removed the session-history bypass from puzzle-opening links. Direct Explore project links still navigate immediately.
- Replaced the inherited opening-cover class with an isolated box-opening class. Removed folder-tab pseudo elements and oversized inherited span styles. Lid lifts and slides away from the tray; Skip/Reset and responsive relayout finish the opening safely.

Verified: build, all five existing tests, syntax and whitespace checks. Desktop next/End controls reached 02 and 07 with correct endpoint disabling. A visited canteen project reopened from the hero into a six-piece modal. Captured the lid/tray mid-animation and checked the absence of legacy folder markup/pseudo elements. Reset and close exercised. At 390 CSS pixels the carousel had no document overflow and the selected playground box opened a four-piece puzzle. Browser error log empty. Native physical-device swiping and OS reduced-motion emulation were not separately tested.

Changes are local; no commit or push performed.
