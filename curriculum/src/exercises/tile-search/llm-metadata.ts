import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches the fundamental linear search pattern: iterating
    through a list to check if a specific element exists. It returns a boolean
    result, reinforcing the early-return pattern and the concept of a default
    return value after exhausting the collection.

    Key concepts:
    - List iteration with for-each loops
    - Element comparison
    - Early return when a condition is met
    - Returning a default value (false) after the loop
    - Boolean return values
  `,

  tasks: {
    "search-for-tile": {
      description: `
        Students need to:
        1. Iterate through each element in the haystack list
        2. Compare each element to the needle
        3. Return true immediately when a match is found
        4. Return false after the loop if no match was found

        Common mistakes:
        - Returning false inside the loop (should only return false AFTER the loop)
        - Not returning anything (function returns undefined/None)
        - Using assignment instead of comparison
        - Forgetting the return statements

        Teaching strategy:
        - Walk through ["S","C","R","A","B"] looking for "R":
          - See "S": not "R", keep going
          - See "C": not "R", keep going
          - See "R": match! return true
        - Then walk through looking for "Z" to show the false case
        - Emphasize that return exits the function immediately
        - Ask: "Why can't we return false inside the loop?"

        Language-specific notes:
        - Jikiscript: for each / end syntax, == for comparison
        - JavaScript: for...of syntax, === for strict equality
        - Python: for...in syntax, == for comparison, True/False capitalized
      `
    }
  }
};
