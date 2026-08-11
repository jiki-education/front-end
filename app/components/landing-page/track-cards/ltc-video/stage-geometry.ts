/**
 * Fixed coordinates inside the stage, and the confetti burst.
 *
 * The stage is drawn at a fixed 1040px and scaled as one piece, so every anchor the fake cursor
 * aims at is a constant in that coordinate space. Holding them here is what lets the cursor move
 * without measuring anything: the prototype called `getBoundingClientRect()` plus `offsetWidth`
 * on every cursor move — twice per call — which forced layout on all eight scrub steps.
 */

import type { CursorTarget } from "./timeline";

/* Every coordinate here is in the stage's own units — its internal width and the scale it is
   drawn at are set in the stylesheet as `--stage-w` and `--ltc-scale`, and deliberately not
   mirrored here. The stage is scaled with `transform`, which leaves the inner coordinate space
   untouched, so nothing below has to know the scale: these numbers are read off the rendered
   stage and stay correct whatever it is drawn at.

   The values below are measured off the rendered stage, in those units.
   The cursor sprite is translated so its tip is the element's origin, so these are the points the
   tip lands on — no per-target fudge factors. */

/** The scrubber track: where it starts, how wide it runs, and the thumb's centre line. */
const TRACK_LEFT = 62;
const TRACK_WIDTH = 485;
const TRACK_Y = 730;

/**
 * Where the cursor's tip lands for each thing it reaches for.
 *
 * `editLine` deliberately sits below the line it is about to edit rather than on it, so the
 * pointer never covers the code being typed.
 */
const ANCHORS: Record<Exclude<CursorTarget["kind"], "track">, { x: number; y: number }> = {
  runButton: { x: 575, y: 363 },
  jikiTab: { x: 842, y: 34 },
  chatBox: { x: 735, y: 690 },
  chatSend: { x: 1005, y: 715 },
  editLine: { x: 300, y: 196 },
  editLineEnd: { x: 340, y: 196 }
};

/** Where the cursor should sit for a given target. */
export function cursorOffset(target: CursorTarget): { x: number; y: number } {
  if (target.kind === "track") {
    return { x: TRACK_LEFT + target.pct * TRACK_WIDTH, y: TRACK_Y };
  }
  return ANCHORS[target.kind];
}

/** Brand confetti colours, from `lib/confetti.ts`. */
const CONFETTI_COLORS = [
  "var(--confetti-1)",
  "var(--confetti-2)",
  "var(--confetti-3)",
  "var(--confetti-4)",
  "var(--confetti-5)"
];

const CONFETTI_COUNT = 60;

/**
 * The burst, precomputed once. Deterministic rather than random so the shape is the same on
 * every loop, and 60 particles rather than the prototype's drifted-to-90.
 */
export const CONFETTI = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  const fromLeft = i % 2 === 0;
  const spread = 150 + ((i * 37) % 380);
  return {
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    left: fromLeft ? "4%" : "96%",
    dx: `${fromLeft ? spread : -spread}px`,
    dy: `${-(240 + ((i * 53) % 300))}px`,
    rot: `${((i * 47) % 720) - 360}deg`,
    delay: `${(i / CONFETTI_COUNT) * 420}ms`
  };
});
