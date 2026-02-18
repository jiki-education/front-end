import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to track position while iterating through
    a string. It combines for-each loops with a counter variable and early
    return, which is a very common programming pattern.

    Key concepts:
    - String iteration with for-each loops
    - Tracking position with a counter variable
    - Early return when a condition is met
    - Returning a sentinel value (-1) for "not found"
  `,

  tasks: {
    "find-tile-position": {
      description: `
        Students need to:
        1. Initialize a position variable to 0
        2. Iterate through each character in the rack
        3. Compare each character to the target letter
        4. Return the position immediately when found
        5. Increment the position after each character
        6. Return -1 if the loop finishes without finding the letter

        The key insight is combining a for-each loop (which doesn't give you
        an index) with a manually tracked counter variable.

        Common mistakes:
        - Forgetting to increment the position counter
        - Incrementing the position before the comparison (off-by-one)
        - Not returning -1 at the end (outside the loop)
        - Returning the letter instead of the position
        - Using "change" instead of "set" for initial declaration (Jikiscript)

        Teaching strategy:
        - Walk through "ABCDE" looking for "C":
          - Start: position = 0
          - See 'A': not 'C', position becomes 1
          - See 'B': not 'C', position becomes 2
          - See 'C': match! return 2
        - Then walk through "ABCDE" looking for "Z" to show the -1 case
        - Emphasize that return exits the function immediately

        Language-specific notes:
        - Jikiscript: set/change for variables, == for comparison
        - JavaScript: let for variable, === for comparison
        - Python: simple assignment, == for comparison
      `
    }
  }
};
