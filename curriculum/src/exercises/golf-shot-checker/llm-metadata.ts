import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Practising a function return value + loop + conditional together. Single task.
  `,

  tasks: {
    "check-shot": {
      description: `
        Solution shape: roll the ball horizontally one step at a time (loop count driven by
        getShotLength()), then a conditional drops the ball and fires fireFireworks() only when
        the shot lands in the hole. Suggest getting the horizontal movement working first.

        Watch for: combining the two range bounds into one condition, off-by-one errors in the
        roll count, and forgetting to update x/y before each moveTo (jumping instead of stepping).
      `
    }
  }
};
