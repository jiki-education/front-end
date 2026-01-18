import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string manipulation, suffix matching, and helper function design.
    Students learn to extract substrings, check string endings, and apply these operations
    to solve a practical matching problem.

    Key concepts:
    - String parsing and extraction (removing honorifics)
    - Implementing ends_with functionality from scratch
    - Helper function decomposition
    - Working with string indices and lengths
    - List iteration with early returns
  `,

  tasks: {
    "check-formal-guest-list": {
      description: `
        Students need to:
        1. Create a helper to calculate string length
        2. Create a remove_honorific helper that extracts everything after the first space
        3. Create an ends_with helper that checks if one string ends with another
        4. Use these helpers to check each name in the guest list
        5. Return true if any name ends with the extracted surname

        Common mistakes:
        - Off-by-one errors in ends_with (Jikiscript uses 1-based indexing)
        - Not handling the case where surname is longer than the name
        - Forgetting to skip the space when extracting the surname
        - Using == instead of checking character by character

        Teaching strategy:
        - Build up the solution step by step
        - Start with length(), then remove_honorific(), then ends_with()
        - Test each helper independently
        - Show how the main function becomes simple once helpers exist

        Language-specific notes:
        - Jikiscript: Uses concatenate() stdlib, 1-based indexing
        - JavaScript: Uses string concatenation with +, 0-based indexing
        - Python: Uses string concatenation with +, 0-based indexing, has len() built-in
      `
    },
    "bonus-multi-word-surname": {
      description: `
        This bonus task tests multi-word surnames like "Lloyd Webber".
        The key insight is that the honorific is only the FIRST word,
        so "Baron Lloyd Webber" should extract "Lloyd Webber" as the surname.

        The solution should already handle this correctly if remove_honorific
        extracts EVERYTHING after the first space (not just the second word).

        Common mistakes:
        - Only extracting one word after the honorific
        - Partial matches (matching "Webber" alone when looking for "Lloyd Webber")

        Guide students to verify their remove_honorific function handles this case.
      `
    }
  }
};
