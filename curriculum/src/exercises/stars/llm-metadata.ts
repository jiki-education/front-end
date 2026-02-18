import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches building lists using push() and string concatenation
    with concatenate(). Students use a repeat loop to iteratively build up
    a string and collect results into a list. It combines concepts from
    variables, repeat loops, string manipulation, and list operations.
  `,

  tasks: {
    "create-stars-function": {
      description: `
        Students need to:
        1. Initialize an empty list and an empty star string
        2. Use a repeat loop that runs 'count' times
        3. Each iteration, concatenate a "*" onto the star string
        4. Push the current star string onto the result list
        5. Return the result list

        Common mistakes:
        - Forgetting to initialize the star string as empty
        - Pushing the star before concatenating (off-by-one)
        - Using the wrong order of operations (push then concatenate)
        - Returning the star string instead of the result list
        - Not handling count=0 (the repeat loop naturally handles this)

        Teaching strategy:
        - Start with the simplest case: count=1 returns ["*"]
        - Trace through count=3 step by step showing how star grows
        - Emphasize that push() adds the current value of star, not a reference
        - The count=0 case works automatically since repeat 0 times does nothing
      `
    }
  }
};
