import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore character-by-character string processing and word-boundary tracking.
  `,

  tasks: {
    "create-acronym-function": {
      description: `
        The student needs to walk the phrase a character at a time, tracking whether the next character starts a new word.
        Non-obvious traps: word boundaries are both spaces AND hyphens (the punctuation scenario also relies on this); the
        result must be uppercased. split() is not available at this level, so encourage a loop with a boundary flag.
      `
    }
  }
};
