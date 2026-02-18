import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches dictionary creation, string iteration, and word frequency analysis.
    Students learn to parse text into words, normalize case, and use dictionaries to count occurrences.
    Key concepts: dictionaries, has_key, string iteration, helper functions, character classification.
  `,

  tasks: {
    "basic-word-counting": {
      description: `
        Students need to:
        1. Convert the sentence to lowercase using to_lower_case()
        2. Extract words by iterating character-by-character, treating letters, numbers, and apostrophes as word characters
        3. Build a dictionary of word counts using has_key() to check existence

        Common mistakes:
        - Forgetting to handle empty words (e.g., from consecutive separators)
        - Not converting to lowercase before processing
        - Treating commas and punctuation as word characters
        - Forgetting that numbers count as words

        Encourage breaking the problem into helper functions: is_letter, extract_words, count_words.
      `
    },
    "case-normalization": {
      description: `
        This task tests that case normalization works correctly and apostrophes in contractions are preserved.
        Students should already have lowercase conversion from task 1.
        Common mistakes:
        - Apostrophes being treated as word separators (they should be kept)
        - Multiple spaces creating empty strings in the word list
      `
    },
    "bonus-apostrophes": {
      description: `
        The bonus challenge requires stripping leading/trailing apostrophes from words while keeping internal ones.
        For example, 'large' should become "large" but "can't" should stay as "can't".
        This requires post-processing extracted words to trim apostrophes from edges.
      `
    }
  }
};
