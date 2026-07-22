import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore a coordinate system and precise positioning by
    deriving each shape's coordinates from a written spec rather than guessing. The point is
    slow, methodical calculation, so resist handing over finished numbers.
  `,

  tasks: {
    "arrange-house": {
      description: `
        The student calculates and sets the position/size of each shape from the spec in order.

        Non-obvious traps to nudge on rather than solve: rectangles position by their top-left
        corner (not their center) while circles position by center; y increases downward, not
        upward; and the "inset" / "overhang" values require accounting for a shape's own size
        (e.g. inset from the right means starting at width minus inset, not at the right edge).
      `
    }
  }
};
