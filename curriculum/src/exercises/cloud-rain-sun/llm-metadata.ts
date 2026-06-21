import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore the ellipse function alongside the already-known
    rectangle and circle, placing shapes against a faded template background.
  `,

  tasks: {
    "draw-scene": {
      description: `
        Anchor steps: draw the sun, the cloud puffs (the cloud body rectangle is locked in
        the stub), then the rain ellipses.

        Non-obvious points worth flagging:
        - ellipse takes (x, y, rx, ry, color); rx is horizontal, ry vertical. Raindrops are
          taller than wide (rx=3, ry=5). Confusing rx/ry is the usual ellipse mistake.
        - The sun must be drawn BEFORE the cloud so the cloud overlaps in front of it.
        - Ellipses are only for raindrops; using them for the sun or puffs fails the checks.
      `
    }
  }
};
