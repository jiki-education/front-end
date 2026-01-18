import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string manipulation, case conversion, and character searching.
    Students learn to build reusable helper functions and apply them to solve a
    practical problem. This is a moderately complex exercise that benefits from
    decomposition into smaller functions.

    Key concepts:
    - String iteration and character comparison
    - Case conversion (implementing to_lower manually)
    - Helper function design (contains, index_of, to_lower)
    - Early return pattern for efficiency
  `,

  tasks: {
    "check-pangram": {
      description: `
        Students need to:
        1. Write a contains() function to check if a character is in a string
        2. Write an index_of() function to find a character's position
        3. Write a to_lower() function using uppercase/lowercase alphabet strings
        4. Write is_pangram() that:
           - Converts the sentence to lowercase
           - Checks if each letter a-z appears in the sentence
           - Returns false immediately if any letter is missing
           - Returns true only if all 26 letters are found

        Common mistakes:
        - Forgetting to convert to lowercase before checking
        - Not handling non-letter characters (they should be ignored, not cause failures)
        - Off-by-one errors in index_of (should return position, not position + 1)
        - Using language-specific methods instead of implementing helpers (which may not be available)
        - Checking uppercase separately instead of converting to lowercase first

        Teaching strategy:
        - Strongly recommend building helper functions first
        - Test each helper function independently before combining
        - Use the two parallel strings (lowercase and uppercase alphabet) for case conversion
        - Emphasize the early return pattern: return false as soon as a letter is missing
        - Discuss why ignoring non-letter characters is the right approach

        Language-specific notes:
        - Jikiscript: Use concatenate() to build strings character by character
        - JavaScript: String concatenation with + works, but solution matches Jiki pattern
        - Python: String concatenation with + works, 'in' operator could simplify but solution uses helper
      `
    }
  }
};
