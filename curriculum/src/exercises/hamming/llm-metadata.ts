import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is a classic Exercism exercise that introduces the Hamming distance algorithm.
    Students learn to compare two sequences character by character, track positions,
    and count differences. This exercise has practical applications in biology,
    error detection, and data comparison.

    Key concepts:
    - Parallel iteration through two strings
    - Position tracking with counter variables
    - Character-by-character comparison
    - Counting and accumulating differences
    - String indexing (0-based in JS/Python)
  `,

  tasks: {
    "calculate-hamming-distance": {
      description: `
        Students need to:
        1. Initialize a position counter (starts at 0 or 1 depending on language)
        2. Initialize a distance counter at 0
        3. Loop through each character in the first string
        4. Compare with the character at the same position in the second string
        5. If they differ, increment the distance counter
        6. Increment the position counter
        7. Return the total distance

        Common mistakes:
        - Off-by-one errors in indexing
        - Forgetting to increment the position counter
        - Incrementing position in the wrong place (should be after comparison)
        - Not handling empty strings (should return 0)

        Teaching strategy:
        - Walk through a short example manually first
        - Show how position tracking allows accessing str2[counter]
        - Emphasize that we loop through str1 but use the counter for str2
        - Point out that empty strings work correctly (loop doesn't execute)

        The Hamming distance algorithm pattern:
        - This is the same pattern used in DNA comparison, error detection codes,
          and fuzzy string matching
        - It's a fundamental algorithm worth understanding

        Language-specific notes:
        - JavaScript/Python: 0-based indexing, counter starts at 0 and is incremented AFTER use
      `
    }
  }
};
