import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches basic string manipulation and the concept of prepending
    vs appending. It's a straightforward exercise with an elegant solution that
    also naturally handles Unicode characters including emojis.

    Key concepts:
    - String iteration with for-each loops
    - Building strings character by character
    - Prepending vs appending (the key insight for reversal)
    - Unicode handling (comes naturally with the right approach)
  `,

  tasks: {
    "reverse-strings": {
      description: `
        Students need to:
        1. Initialize an empty result string
        2. Iterate through each character in the input
        3. Prepend each character to the result (not append!)
        4. Return the result

        The key insight is using concatenate(letter, result) instead of
        concatenate(result, letter). By prepending each new character,
        the string naturally reverses.

        Common mistakes:
        - Appending instead of prepending (gives the same string, not reversed)
        - Trying to use array indexing from the end (more complex, error-prone)
        - Overthinking the solution (the elegant solution is just 4 lines)

        Teaching strategy:
        - Walk through a simple example on paper: "cat"
          - Start: result = ""
          - See 'c': result = "c" + "" = "c"
          - See 'a': result = "a" + "c" = "ac"
          - See 't': result = "t" + "ac" = "tac"
        - Point out that this approach naturally handles Unicode/emojis
        - Emphasize the simplicity of the solution

        Language-specific notes:
        - Jikiscript: Use concatenate(letter, result)
        - JavaScript: Use letter + result
        - Python: Use letter + result
      `
    }
  }
};
