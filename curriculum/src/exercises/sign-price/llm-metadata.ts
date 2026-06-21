import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore combining string iteration with a conditional filter inside the loop. It builds on the tile-rack exercise by adding an if-statement (skip spaces) to the loop body.
  `,

  tasks: {
    "calculate-sign-price": {
      description: `
        Count non-space characters, multiply by 12, and return the formatted "That will cost $X" string.

        Common mistakes:
        - Counting spaces too (missing or inverted if-condition, e.g. === " " instead of !== " ")
        - Multiplying inside the loop instead of after it
        - Returning the bare number rather than the formatted string
      `
    }
  }
};
