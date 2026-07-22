import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore character-by-character string processing:
    iterate the sentence, build up each word, and accumulate finished words into a
    list. Same accumulator shape as word-count but without dictionaries.

    Anchor steps:
    1. Start with an empty list and an empty current-word string.
    2. On a space: if the current word is non-empty, push it and reset to "".
    3. On a period: skip it.
    4. On any other character: append it to the current word.
    5. After the loop: push the final word if non-empty.
  `,

  tasks: {
    "extract-words": {
      description: `
        Non-obvious traps to watch for:
        - The final word after the loop is easily forgotten (no trailing space to trigger a push).
        - Pushing without the non-empty guard yields stray "" entries from double spaces / trailing space.
      `
    }
  }
};
