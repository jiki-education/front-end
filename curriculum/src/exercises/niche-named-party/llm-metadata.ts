import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches building a starts_with function from scratch.
    Students need to compare two strings character by character to determine
    if one string begins with another. They also need to implement a length
    function. The bouncer/party framing provides a fun visual context for
    the string comparison logic.
  `,

  tasks: {
    "check-the-name": {
      description: `
        Students need to:
        1. Call askName() and getAllowedStart() to get the two strings
        2. Write a getLength helper function (iterate through string, count characters)
        3. Write a startsWith helper function that:
           - Checks if the prefix is longer than the name (return false if so)
           - Iterates through each character of the prefix
           - Compares each character against the corresponding position in the name
           - Returns false on first mismatch, true if all match
        4. Use the result to call letIn() or turnAway()

        Key concepts:
        - Building utility functions from scratch (getLength, startsWith)
        - Character-by-character string comparison using indexing
        - Early return pattern (return false as soon as a mismatch is found)
        - Edge case handling (empty string, prefix longer than name, exact match)

        Common mistakes:
        - Forgetting to handle the case where the prefix is longer than the name
        - Off-by-one errors with counter variables
        - Not implementing a length function and trying to use .length or len()
        - Forgetting to increment the counter variable
        - Using == instead of != in the comparison (inverting the logic)

        Teaching strategy:
        - Guide students toward breaking the problem into two helper functions
        - Reference Sign Painter Price for the length calculation pattern
        - Emphasize the early return pattern: return false immediately on mismatch
        - Use the silence (empty string) scenario to highlight the length guard
      `
    }
  }
};
