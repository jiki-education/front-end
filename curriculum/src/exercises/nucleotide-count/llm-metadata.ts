import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches dictionary/object usage, string iteration, and validation.
    Students learn to count occurrences of specific characters and handle invalid input
    by returning a special value (false).

    Key concepts:
    - Dictionaries/objects with string keys and number values
    - String iteration character by character
    - Input validation with early return
    - Using keys() to get valid values from a dictionary
  `,

  tasks: {
    "count-nucleotides": {
      description: `
        Students need to:
        1. Initialize a dictionary with A, C, G, T as keys, all set to 0
        2. Get the valid nucleotide characters using keys()
        3. Write or use a helper function to check if a character is in a list
        4. Iterate through each character in the DNA string
        5. For each character, check if it's valid; if not, return false immediately
        6. If valid, increment the corresponding count in the dictionary
        7. Return the counts dictionary

        Common mistakes:
        - Forgetting to initialize the dictionary before iterating
        - Not handling invalid characters (returning undefined instead of false)
        - Using string comparison incorrectly
        - Forgetting to increment the count (just checking validity)
        - Not understanding dictionary bracket notation for dynamic keys

        Teaching strategy:
        - Emphasize the importance of initialization before counting
        - Walk through the validation logic: check first, then count
        - Explain that dictionaries allow dynamic key access with brackets
        - Point out that keys() returns the keys as a list, which can be searched

        Language-specific notes:
        - Jikiscript: Use keys() function and dictionary bracket notation counts[strand]
        - JavaScript: Use Object.keys() and object bracket notation
        - Python: Use .keys() method (or just 'in' operator for membership)
      `
    }
  }
};
