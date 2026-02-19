import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This is an advanced exercise that teaches decomposition, helper function design,
    and complex string/list manipulation. Students must break down a real-world problem
    into small, manageable pieces and write multiple helper functions.

    Key concepts:
    - Problem decomposition into helper functions
    - String manipulation (checking prefixes/suffixes, extracting substrings)
    - List operations (filtering, iterating, avoiding duplicates)
    - Building reusable utility functions (length, startsWith, endsWith)

    This is the hardest exercise in the curriculum so far. Students need to implement
    several helper functions before tackling the main problem:
    - length() - count characters in a string
    - startsWith() - check if string starts with a prefix
    - endsWith() - check if string ends with a suffix
    - stripPrefix() - remove N characters from the start
    - extractSocks() - filter list for items ending in " sock"
    - switchLeftRight() - swap "left "/"right " prefix
    - pushIfMissing() - add to list only if not already present
  `,

  tasks: {
    "find-matching-socks": {
      description: `
        Students need to:
        1. Build helper functions for string manipulation (length, starts_with, ends_with)
        2. Create a function to remove the "left "/"right " prefix from sock descriptions
        3. Create a function to extract only socks from a list of clothes
        4. Create a function to find the "other" sock (swap left/right)
        5. Create a deduplication function to avoid duplicate matches
        6. Combine all helpers to find matching pairs

        Common mistakes:
        - Not breaking the problem down into small enough pieces
        - Off-by-one errors in string indexing
        - Forgetting that "left " is 5 characters but "right " is 6 characters
        - Adding duplicate matches (e.g., finding "red socks" twice)
        - Not filtering for actual socks (items ending in " sock")
        - Missing edge cases like items starting with "left" but not being socks (e.g., "leftover fabric")

        Teaching strategy:
        - Strongly encourage students to write and test helper functions one at a time
        - Suggest using log statements to verify each helper works correctly
        - Remind students that they may have written some helpers in previous exercises
        - Emphasize that the final matchingSocks function should be relatively simple if helpers are well-designed
        - Guide students through the logical steps: extract socks -> combine lists -> find pairs -> format output

        Algorithm outline:
        1. Extract socks from clean basket
        2. Extract socks from dirty basket
        3. Combine both sock lists
        4. For each sock, find its pair (swap left/right)
        5. If pair exists in the combined list, add the sock type to results (without duplicates)
        6. Return the list of matched sock types (e.g., ["red socks", "blue socks"])
      `
    }
  }
};
