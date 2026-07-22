import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise string indexing and concatenation.
  `,

  tasks: {
    "create-acronym-function": {
      description: `
        Common mistakes:
        - Using [1] instead of [0] (strings are 0-indexed)
        - Returning just one character instead of concatenating all three
      `
    }
  }
};
