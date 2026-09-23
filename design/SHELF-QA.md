# Dimensional shelf — 2026-09-23

Implemented the four agreed priorities: desktop pointer dragging with click suppression and snap settling; stronger neighboring-box depth; crossfading real project drawing backdrops and color; a cloned selected box travelling into the modal before the lid opens. Added session restoration of the selected box and bilingual browsing instructions. Existing GSAP and native pointer/scroll APIs; no dependencies added.

Verified in browser:
- Mouse drag from first to second box changes selection and tint without opening the puzzle; drag class clears on release.
- Only two backdrop layers retained during changes.
- Travelling box bounds are inside the desktop viewport. Closing during entry removes the clone and restores source visibility.
- Selection 02 survives reload and Turkish-to-English rerender.
- At 390 CSS pixels there is no page overflow; selected box opens a four-piece puzzle and its opening clone is removed after arrival.
- No console errors on tested interaction path.

Build and all five existing tests passed. Syntax and whitespace checks passed. Physical touch hardware and OS reduced-motion emulation not separately tested. Changes remain local and uncommitted.
