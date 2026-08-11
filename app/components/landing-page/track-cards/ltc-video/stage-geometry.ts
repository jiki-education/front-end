// Fixed coordinates inside the stage, and the confetti burst.

import type { CursorTarget } from "./timeline";

// Every coordinate is in the stage's own units, measured off the rendered stage. The stage is
// scaled with `transform`, so these stay correct whatever it's drawn at and need no scale factor.

/** The scrubber track: where it starts, how wide it runs, and the thumb's centre line. */
const TRACK_LEFT = 62;
const TRACK_WIDTH = 485;
const TRACK_Y = 730;

/** Where the cursor's tip lands for each target. `editLine` sits below the line so it never covers the code. */
const ANCHORS: Record<Exclude<CursorTarget["kind"], "track">, { x: number; y: number }> = {
  runButton: { x: 575, y: 363 },
  jikiTab: { x: 842, y: 34 },
  instructionsTab: { x: 730, y: 34 },
  chatBox: { x: 735, y: 690 },
  chatSend: { x: 1005, y: 715 },
  editLine: { x: 273, y: 166 },
  editLineEnd: { x: 202, y: 163 }
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

/** The burst, precomputed once. Deterministic so the shape is identical on every loop. */
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
