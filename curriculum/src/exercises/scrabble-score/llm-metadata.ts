import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches dictionary/object creation, string iteration, and value lookups.
    Students learn to build data structures and use them for efficient lookups.
    Key concepts: dictionaries, iteration, case conversion, accumulation.
  `,

  tasks: {
    "calculate-scrabble-score": {
      description: `
        Students need to:
        1. Create a letter_values function that builds a dictionary from letter groups to scores
        2. Create a scrabble_score function that uses this dictionary to calculate word scores

        The elegant approach uses a list of [letters, value] pairs and iterates to build the dictionary.
        Then iterate through the word, look up each letter's value, and sum them.

        Common mistakes:
        - Forgetting to handle lowercase letters (need to convert to uppercase)
        - Trying to type out the full dictionary manually instead of building it
        - Off-by-one errors when iterating

        The stdlib provides to_upper_case() so students don't need to implement it themselves.
      `
    }
  }
};
