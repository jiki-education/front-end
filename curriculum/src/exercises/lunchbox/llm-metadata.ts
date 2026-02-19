import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches list creation, push usage, and conditional logic combined.
    Students learn to build a list incrementally using push() and conditionally skip
    an item based on a string comparison.

    Key concepts:
    - Creating an empty list
    - Adding items to a list using push()
    - Using an if statement to conditionally add an item
    - Returning a list from a function
  `,

  tasks: {
    "pack-a-lunch": {
      description: `
        Students need to:
        1. Create an empty list (lunchbox)
        2. Push the sandwich into the list
        3. Check if the drink is NOT "milkshake"
        4. If not a milkshake, push the drink into the list
        5. Push the snack into the list
        6. Return the list

        Common mistakes:
        - Creating multiple lists instead of one
        - Forgetting to reassign the result of push() (push returns a new list)
        - Using string concatenation or other approaches instead of push
        - Putting the if check around the wrong items (should only affect the drink)
        - Checking for equality with "milkshake" instead of inequality

        Teaching strategy:
        - Start with the simple case first (no milkshake) to get the basic structure right
        - Then add the conditional for the milkshake case
        - Emphasize that push() returns a new list so you must reassign
        - In JavaScript, .push() mutates the list in place; in Python, .append() mutates in place
      `
    }
  }
};
