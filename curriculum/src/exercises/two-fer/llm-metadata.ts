import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore conditionals and string building
    via a default value when an input is empty.
  `,

  tasks: {
    "create-two-fer-function": {
      description: `
        Two valid shapes: branch and return a different string per case, or
        default the empty name to "you" and build one concatenated string.

        Watch for: the empty-string case being unhandled, and a name being
        hardcoded rather than interpolated.
      `
    }
  }
};
