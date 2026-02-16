import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise combines variables, functions that return values, repeat loops,
    and complex conditionals (using 'and'). Students check if a golf shot lands
    in a hole by comparing the shot length to a range (56-63).

    The exercise has four scenarios: too short, too long, and the two boundary
    values of the valid range.
  `,

  tasks: {
    "check-shot": {
      description: `
        Students need to:
        1. Call get_shot_length() and store the result in a variable
        2. Use a repeat loop to move the ball right by the shot length
        3. Check if shot_length >= 56 and shot_length <= 63
        4. If yes, move ball down 9 times and fire fireworks

        Common mistakes:
        - Forgetting to store the shot length in a variable
        - Using the wrong range for the hole check
        - Not combining conditions with 'and'
        - Moving down or firing fireworks unconditionally
        - Off-by-one errors in the range check

        Teaching strategy:
        - Start with getting and using the shot length for horizontal movement
        - Then add the conditional check for the hole range
        - Explain that 'and' requires both conditions to be true
        - Use the too-short scenario first to debug basic movement
      `
    }
  }
};
