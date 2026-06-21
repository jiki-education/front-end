import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore building a string character by character, where
    the key insight is prepending rather than appending. A nice side effect of the elegant
    approach is that it handles Unicode/emoji naturally.
  `,

  tasks: {
    "reverse-strings": {
      description: `
        The student iterates the input and builds a result, and the whole trick is putting
        each new character BEFORE the accumulated result (letter + result), not after.

        Common mistakes worth watching for:
        - Appending (result + letter), which leaves the string unchanged.
        - Reaching for index-from-the-end logic, which is more error-prone than the
          prepend approach.
        If a student is stuck, walking "cat" through the loop on paper makes the prepend
        idea click.
      `
    }
  }
};
