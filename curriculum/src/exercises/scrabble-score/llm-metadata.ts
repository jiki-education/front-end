import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches dictionary/object creation, string iteration, and value lookups.
    Students learn to build data structures from grouped data and use them for efficient lookups.
    Key concepts: dictionaries, nested iteration, case conversion, accumulation.
  `,

  tasks: {
    "create-letter-values-function": {
      description: `
        Students need to build a dictionary from a list of [letterGroup, pointValue] pairs.
        They iterate through each pair, then iterate through each letter in the group string,
        setting each letter as a key with the corresponding point value.

        Common mistakes:
        - Trying to type out the full 26-letter dictionary manually instead of building it from the list
        - Incorrect array indexing when accessing the pair elements
        - Forgetting to return the dictionary

        The starting values list is provided in the stub. Students need to convert it to a dictionary.
      `
    },
    "single-letters": {
      description: `
        Students need to use letterValues() to get the scores dictionary, then look up
        a single letter's score. They must convert the letter to uppercase before lookup
        since the dictionary uses uppercase keys.

        Common mistakes:
        - Forgetting to convert to uppercase (dictionary keys are uppercase)
        - Not calling letterValues() to get the dictionary first
      `
    },
    words: {
      description: `
        Students extend their scrabbleScore function to handle full words by iterating
        through each letter, looking up its value, and summing the results.

        Common mistakes:
        - Not accumulating the score (overwriting instead of adding)
        - Forgetting to initialize score to 0
      `
    },
    "edge-cases": {
      description: `
        Students verify their function handles edge cases. An empty string should return 0,
        and the full alphabet should return 87. If the loop and accumulator are correct,
        these should work automatically.

        The empty string case works naturally if score starts at 0 and the loop simply
        doesn't execute. No special handling needed.
      `
    }
  }
};
