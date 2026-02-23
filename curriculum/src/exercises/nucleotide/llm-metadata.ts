import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches string iteration, helper functions, and input validation.
    Students learn to iterate through a string character by character, write a reusable
    helper function to check membership, and handle invalid input with early returns.

    Key concepts:
    - Writing a helper function (contains) to check if a character is in a string
    - String iteration with for-each loops
    - Input validation with early return (-1)
    - Counting occurrences with a counter variable
  `,

  tasks: {
    "count-nucleotide": {
      description: `
        Students need to:
        1. Write a contains helper function that iterates through a string to find a character
        2. Validate the nucleotide parameter is one of A, C, G, T using contains
        3. Iterate through each character in the strand
        4. For each character, validate it's a valid nucleotide; return -1 if not
        5. Count matches where the character equals the target nucleotide
        6. Return the final count

        Common mistakes:
        - Forgetting to write the contains helper function
        - Not validating the nucleotide parameter before iterating
        - Not validating each character in the strand
        - Returning 0 instead of -1 for invalid input
        - Forgetting to increment the counter

        Teaching strategy:
        - Start with the contains helper function - it's a useful pattern
        - Emphasize validation before processing (check nucleotide first)
        - Walk through the iteration logic: validate each character, then check for match
        - Point out that early returns simplify the logic
      `
    }
  }
};
