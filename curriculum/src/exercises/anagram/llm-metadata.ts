import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches list manipulation, string comparison, and algorithm design.
    Students learn to work with collections, implement filtering logic, and handle
    case-insensitive comparisons. Key concepts: list iteration, string normalization,
    sorting algorithms, and edge case handling (excluding self-matches).

    This is an intermediate-to-advanced exercise that requires understanding of:
    - Working with lists/arrays as both inputs and outputs
    - String manipulation and case handling
    - The "canonical form" pattern (sorting letters to detect anagrams)
    - Filtering and building result sets
    - Alphabetical sorting of results
  `,

  tasks: {
    "find-anagrams": {
      description: `
        Students need to:
        1. Normalize strings to lowercase for comparison
        2. Use sort_string() (Jiki) or native sorting to create a canonical representation
        3. Compare sorted versions to detect anagrams
        4. Filter out the target word itself (case-insensitive check)
        5. Build results list using push() or array methods
        6. Sort final results alphabetically

        Common mistakes:
        - Forgetting to exclude the target word itself (e.g., "BANANA" should not match "banana")
        - Not handling case sensitivity correctly (e.g., "PoTS" should match "sTOp")
        - Forgetting to sort the final results alphabetically
        - Not preserving original casing in results (should return "Eons" not "eons")
        - Comparing unsorted strings or not converting to lowercase first
        - Allowing partial matches/subsets (e.g., "dog" should NOT match "good")

        Teaching strategy:
        - Encourage decomposition into helper functions (especially in Jikiscript)
        - Emphasize the "sorted letters" pattern as a general technique for anagram detection
        - Guide students to test edge cases: empty list, no matches, all matches, self-matches
        - Discuss the importance of case-insensitive comparison vs. preserving original case
        - For advanced students, discuss time/space complexity (O(n*m log m) where n is possibilities count, m is average word length)

        Language-specific notes:
        - Jikiscript: Use comprehensive helper functions to teach decomposition; use push() and sort_string() from stdlib
        - JavaScript: Demonstrate .split('').sort().join('') pattern; use array methods like .push() and .sort()
        - Python: Show ''.join(sorted(string)) pattern; use list comprehension if appropriate for level
      `
    },
    "sorted-results": {
      description: `
        This bonus task challenges students to ensure alphabetical sorting of results.
        While the main task can use built-in sorting, this emphasizes the importance
        of ordered output and can encourage custom sorting implementation.

        Guide students to:
        - Understand lexicographic (dictionary) ordering
        - Handle case-insensitive alphabetical sorting (capital letters should not affect order)
        - For Jikiscript: Implement insertion sort or similar algorithm
        - For JS/Python: Use native sorting with custom comparators

        Note: The original Bootcamp exercise had a "no sort_string usage" constraint
        that we cannot enforce in the Jiki curriculum. This is documented here for
        reference but should not be communicated to students as an enforceable rule.
        Instead, encourage students to understand how sorting works by potentially
        implementing their own sorting logic.
      `
    }
  }
};
