import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to track position while iterating through
    a string. It combines for-each loops with a counter variable, early
    return, and string concatenation with number-to-string conversion.

    Key concepts:
    - String iteration with for-each loops
    - Tracking position with a counter variable
    - Early return when a condition is met
    - Converting numbers to strings and concatenating to build result messages
    - Returning a descriptive error string for "not found"
  `,

  tasks: {
    "find-tile-position": {
      description: `
        Students need to:
        1. Initialize a position variable to 0
        2. Iterate through each character in the rack
        3. Compare each character to the target letter
        4. When found, convert position to string and return "Move to position X"
        5. Increment the position after each character
        6. Return "Error: Tile not on rack" if the loop finishes without finding the letter

        The key insight is combining a for-each loop (which doesn't give you
        an index) with a manually tracked counter variable, plus building
        a result string with number-to-string conversion.

        Common mistakes:
        - Forgetting to increment the position counter
        - Incrementing the position before the comparison (off-by-one)
        - Returning the error string inside the loop instead of after it
        - Forgetting to convert the position number to a string before concatenating
        - Returning the letter instead of the position
        - Using "change" instead of "set" for initial declaration (Jikiscript)

        Teaching strategy:
        - Walk through "ABCDE" looking for "C":
          - Start: position = 0
          - See 'A': not 'C', position becomes 1
          - See 'B': not 'C', position becomes 2
          - See 'C': match! return "Move to position 2"
        - Then walk through "ABCDE" looking for "Z" to show the error case
        - Emphasize that return exits the function immediately

        Language-specific notes:
        - Jikiscript: number_to_string() and concatenate() to build the result
        - JavaScript: String() and + operator for concatenation
        - Python: str() and + operator for concatenation
      `
    }
  }
};
