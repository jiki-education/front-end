import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string manipulation, helper function creation, and list iteration.
    Students learn to implement common string operations (length, starts_with) from scratch
    and apply them to solve a practical problem. Key concepts: string indexing, iteration,
    early returns, helper functions, and boundary checking.

    This is an intermediate exercise that builds on basic iteration and introduces:
    - Implementing utility functions from scratch (length, starts_with)
    - Working with lists of strings
    - Character-by-character string comparison
    - Handling edge cases (empty lists, exact matches, partial matches)
  `,

  tasks: {
    "check-guest-list": {
      description: `
        Students need to:
        1. Create a helper function to calculate string length (iterate and count)
        2. Create a starts_with helper that checks if one string starts with another
        3. The starts_with function must also check for word boundaries (space after the prefix)
        4. Use these helpers to check each name in the guest list
        5. Return true as soon as a match is found, false if no match

        Common mistakes:
        - Not checking for word boundaries (matching "Bradley" when looking for "Brad")
        - Off-by-one errors in string indexing (Jikiscript uses 1-based indexing)
        - Not handling the case where the prefix equals the entire name (single-name celebrities)
        - Forgetting to return false at the end if no match is found
        - Not handling empty lists correctly

        Teaching strategy:
        - Encourage decomposition: break the problem into smaller helper functions
        - Start with the length function - it's the simplest and needed by starts_with
        - Then build starts_with using length
        - Finally implement on_guest_list using starts_with
        - Test each helper independently before combining

        Language-specific notes:
        - Jikiscript: Uses 1-based indexing with word[counter], for each loops
        - JavaScript: Uses 0-based indexing with word[i], for...of or standard for loops
        - Python: Uses 0-based indexing, len() is built-in so length helper is optional
      `
    },
    "bonus-single-names": {
      description: `
        This bonus task tests edge cases with single-name celebrities like "Cher".
        The main challenge is ensuring that:
        - "Cher" matches the name "Cher" exactly (single name on list)
        - "Cheryl" does NOT match "Cher" (partial match is not valid)

        The solution should already handle this if starts_with is implemented correctly:
        - When the prefix length equals the word length, it's a match (Cher = Cher)
        - When checking "Cheryl" against "Cher", the character after "Cher" is "y", not a space

        Guide students to think about:
        - What makes a valid first name match?
        - Either the first name IS the full name, OR it's followed by a space
        - This handles both "Cher" and "Brad Pitt" cases correctly
      `
    }
  }
};
