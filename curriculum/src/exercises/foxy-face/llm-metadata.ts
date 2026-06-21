import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore the triangle function (three corner points
    plus a colour) and shape layering by building an 8-triangle fox face. The colours
    are named strings: "brown", "orange", "white", "charcoal".
  `,

  tasks: {
    "draw-fox": {
      description: `
        Non-obvious traps to watch for:
        - Draw order matters: later triangles paint over earlier ones, so a wrong order hides parts.
        - The face is horizontally symmetric, so the right side mirrors the left across x=50
          (x becomes 100 - x); a student can derive it rather than hover for every point.
      `
    }
  }
};
