import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces Wordle game logic. Students learn to compare two strings
    character by character, categorizing each letter as correct (right letter, right place),
    present (right letter, wrong place), or absent (letter not in word).
    Key concepts: string iteration with index, array building with push(), conditional logic.
  `,

  tasks: {
    "process-guess": {
      description: `
        Students need to iterate through each letter of the guess, compare it to the target word,
        and build up a list of states. A helper function to check if a letter exists in the word
        is very useful. Common mistakes: forgetting to use indexed iteration, confusing the order
        of correct/present/absent checks, not using push() to build the states list.
      `
    }
  }
};
