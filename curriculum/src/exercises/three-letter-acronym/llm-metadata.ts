import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string indexing and concatenation.
    Students learn to access individual characters in a string using [1]
    and combine them using concatenate().
  `,

  tasks: {
    "create-acronym-function": {
      description: `
        Students need to get the first character of each word using [1]
        and join them together with concatenate().

        The solution is a single return statement:
        return concatenate(word1[1], word2[1], word3[1])

        Common mistakes:
        - Forgetting that string indexing starts at 1 in Jikiscript (not 0)
        - Trying to use + instead of concatenate() in Jikiscript
        - Returning just one character instead of all three
      `
    }
  }
};
