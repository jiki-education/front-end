import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore passing pre-declared variables
    as arguments to a function, reusing the same variable across several calls.
  `,

  tasks: {
    "draw-lights": {
      description: `
        Anchor steps:
        1. Call circle once per light, passing the provided variables (not
           literal numbers) for x, y and radius plus the color string.
        2. Match each y variable to the right color (top=red, middle=amber,
           bottom=green) and reuse centerX/radius across all three calls.

        Watch for hardcoded literals instead of the variables, swapped
        y/color pairings, or a missing color argument.
      `
    }
  }
};
