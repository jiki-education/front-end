import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string manipulation, iteration, and character extraction.
    Students learn to process text word-by-word and build up results incrementally.
    Key concepts: string splitting, character access, string building, and case conversion.
  `,

  tasks: {
    "create-acronym-function": {
      description: `
        Students need to iterate through the phrase, identify word boundaries (spaces/hyphens),
        extract the first character of each word, convert to uppercase, and concatenate.
        Common mistakes: forgetting to handle hyphens, not uppercasing, including spaces in output.
        Encourage using a loop with a boundary-tracking flag rather than split() since that's not available yet.
      `
    }
  }
};
