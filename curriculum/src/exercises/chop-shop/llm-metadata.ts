import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches data lookup patterns, list iteration, and time-based calculations.
    Students learn to create lookup tables (mapping names to values), iterate through lists
    to accumulate totals, and make decisions based on computed results.

    Key concepts:
    - Creating and using lookup tables (list of [name, value] pairs)
    - Iterating through lists and accumulating values
    - Comparing computed totals against thresholds
    - Helper function decomposition
  `,

  tasks: {
    "can-fit-in": {
      description: `
        Students need to:
        1. Create a helper function that maps haircut names to their duration
        2. Use a list of [name, time] pairs as a simple lookup table
        3. Loop through the queue, looking up each haircut's time
        4. Subtract each time from the remaining minutes
        5. Check if there's enough time left for the requested haircut

        Common mistakes:
        - Forgetting to include all haircut types in the lookup
        - Off-by-one errors in list indexing (Jikiscript uses 1-based indexing)
        - Not handling the case where the queue is empty
        - Comparing with < instead of >= (exact time should still fit)

        Teaching strategy:
        - Start by creating the lookup helper function
        - Test the helper independently before using it
        - Then build the main function using the helper
        - Emphasize that data-driven approaches (lookup tables) are cleaner than long if/else chains

        Language-specific notes:
        - Jikiscript: Uses 1-based indexing, cut[1] is name, cut[2] is time
        - JavaScript: Uses 0-based indexing, cut[0] is name, cut[1] is time
        - Python: Same as JavaScript with 0-based indexing
      `
    }
  }
};
