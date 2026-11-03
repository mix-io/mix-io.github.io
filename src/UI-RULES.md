# mix.io UI rules (locked)

These are Alec's standing rules for every screen. Check new work against them before it ships.

## Symmetry and alignment
- Everything centered sits on the true screen center line: logo, orb, score, labels, buttons, pills, dials.
- A container is never narrower than what it holds. Growing items (the orb grows with eye score) get full-width parents so nothing overflows to one side.
- Stacked controls share one width and one left/right edge (e.g. birthday dial columns and the continue button span the same 340px block).
- Side-by-side columns are equal width with even gaps unless there is a strong reason.
- Letter-spaced uppercase labels get a matching `text-indent` so the trailing space doesn't push them off center.
- All digits are tabular (equal width) app-wide, so numbers never jiggle as they change.

## Dials and wheels
- Flat, even rows: no 3D tilt. Rows only scale down and fade away from center.
- The selected row sits dead center in its lens/pill.
- Wheels move calmly: drag 1:1.22, capped flick speed, soft settle, no bounce overshoot.
- The dye wheel magnifies at the center (Mac-dock feel) and never moves under the finger while dragging.
- Selecting never triggers an action: tapping a dye only selects it. Drops go into the glass by hand.

## Motion
- Liquid, fluid and calm, at 60fps on iPhone.
- Tab changes: an instant solid backdrop plus a short ~0.26s fade, with no sliding or jumping and no flash of another screen.
- Nothing animates or renders while it's off screen.
- Everything respects reduced motion.

## Look
- Liquid / Frutiger Aero: dark, glassy, soft glows, frosted pills, rainbow-drop chroma icon.
- Backgrounds: the same swirl on home, intro and atlas.
- Water starts nearly clear; dye brings the color back in.
- Never change the DNA orb's look, motion or feel without approval.

## Process
- Nothing gets built without Alec's board approval. Skipped items are never built.
- Every change ships to mix-io.github.io and the Claude artifact copy.
