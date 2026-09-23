# Desktop deployment investigation — 2026-09-23

User reports desktop Edge and Brave fail while phone works. Neither external browser session is connected to this task; testing uses the desktop Chromium-based in-app browser.

Evidence: `node scripts/audit-live.mjs` compared all eight HTML routes, five stylesheets, three vendor scripts and twelve current release modules. All 28 returned HTTP 200, expected MIME types and matching normalized content hashes. No deployed-code mismatch at the time of this audit. Public homepage runtime log showed no errors.

Identified failure paths and changes:
- Opening previously watched dialog clientWidth with ResizeObserver. Desktop scrollbar changes could cause layout(true), which cancels the opening. Now only viewport resize events and changed window dimensions trigger layout. A stable scrollbar gutter prevents geometry shifts.
- Moving clones inherited inline opacity/visibility from the animated hero. Their visibility is now explicitly normalized.
- Optional `?debug=1` provides local-only phase/error diagnostics and a Copy report button. It sends nothing automatically.

Verification: production build and six tests pass. Desktop trace with a scrollbar gutter (viewport 1455, dialog 1437) recorded loading, arriving, lifting, ready, and closed in order. No claim of reproduction or successful verification in the user's external Edge/Brave sessions; their diagnostic report is needed if the issue persists.
