import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to iterate through a string, filter characters
    using a conditional, accumulate a count, and build a formatted return string.
    It combines string iteration with an if-statement inside the loop, which is
    a key progression from the previous tile-rack exercise.

    Key concepts:
    - String iteration with for-each loops
    - Conditional filtering inside a loop (skipping spaces)
    - Counter variable for accumulation
    - Arithmetic with the counter result
    - String building with concatenate and numberToString
  `,

  tasks: {
    "calculate-sign-price": {
      description: `
        Students need to:
        1. Initialize a counter variable (numLetters) to 0
        2. Loop through each character in the sign text
        3. Check if the character is not a space
        4. If not a space, increment the counter
        5. After the loop, multiply the counter by 12
        6. Return concatenate("That will cost $", numberToString(price))

        The key insight is combining iteration with conditional filtering --
        not every character should be counted, so students need an if-statement
        inside their loop body.

        Common mistakes:
        - Counting all characters including spaces
        - Forgetting the if-statement to skip spaces
        - Using == " " instead of != " " (counting spaces instead of non-spaces)
        - Forgetting to use numberToString() when building the result
        - Returning just the number instead of the formatted string
        - Multiplying before the loop is finished (putting multiply inside the loop)

        Teaching strategy:
        - Walk through "Hi There":
          - Start: numLetters = 0
          - See 'H': not a space, numLetters becomes 1
          - See 'i': not a space, numLetters becomes 2
          - See ' ': is a space, skip it
          - See 'T': not a space, numLetters becomes 3
          - ... and so on until numLetters = 7
          - price = 7 * 12 = 84
          - Return "That will cost $84"
        - Emphasize this builds on tile-rack by adding a conditional inside the loop

        Language-specific notes:
        - JavaScript: can use template literals or concatenate() and numberToString()
        - Python: uses string concatenation with str()
      `
    }
  }
};
