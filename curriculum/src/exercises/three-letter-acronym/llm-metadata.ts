import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string indexing and concatenation.
    Students learn to access individual characters in a string using [0]
    and combine them using the + operator (or a template string).
  `,

  tasks: {
    "create-acronym-function": {
      description: `
        Students need to get the first character of each word using [0]
        and join them together with the + operator.

        The solution is a single return statement:
        return word1[0] + word2[0] + word3[0]

        Common mistakes:
        - Using [1] instead of [0] (JavaScript is 0-indexed)
        - Returning just one character instead of all three
        - Getting the concatenation syntax wrong
      `
    }
  }
};
