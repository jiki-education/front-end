import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore combining a function's return value with a loop
    and a conditional: getShotLength() drives the horizontal roll, and a range check decides
    whether the ball drops into the hole and the fireworks fire.
  `,

  tasks: {
    "check-shot": {
      description: `
        The student first rolls the ball horizontally using getShotLength(), then needs a
        conditional that only animates the drop and fireFireworks() when the shot lands in the
        hole. Suggest getting the horizontal movement working before adding the conditional.

        Watch for: combining the two range bounds into one condition, off-by-one errors in the
        roll count, and forgetting to update x/y before each rollTo (jumping instead of stepping).
      `
    }
  }
};
