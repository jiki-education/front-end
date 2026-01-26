import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is a classic beginner exercise that teaches conditionals and string concatenation.
    Students learn to check for empty strings and build dynamic output.
    Key concepts: conditional logic, string building, default values.
  `,

  tasks: {
    "create-two-fer-function": {
      description: `
        Students need to check if the name is empty and use "you" as the default.
        Then build the output string using concatenate().

        Two main approaches:
        1. Check if empty, return different strings for each case
        2. Set name to "you" if empty, then build one concatenated string

        Common mistakes:
        - Forgetting to handle the empty string case
        - Getting the punctuation wrong (comma and period)
        - Hardcoding names like "Bob" or "Alice"
      `
    }
  }
};
