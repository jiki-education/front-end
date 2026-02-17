import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to use return values from functions and combine them
    with loops. Students build a skyscraper by calling num_floors() to determine height,
    then using a repeat loop to construct each floor. The key concepts are:
    storing a function's return value in a variable and using it to control a loop.
  `,

  tasks: {
    "build-skyscraper": {
      description: `
        Students need to:
        1. Call num_floors() and store the result, subtract 1 for upper floors
        2. Build the ground floor with wall/glass/entrance/glass/wall pattern
        3. Use a repeat loop for the upper floors (wall/glass/glass/glass/wall)
        4. Add the roof (all walls)

        Common mistakes:
        - Forgetting to subtract 1 from num_floors() for the repeat count
        - Building floors in wrong order (should go bottom to top)
        - Wrong pattern for ground floor vs upper floors (entrance vs glass at position 3)
        - Off-by-one on y coordinate (forgetting to increment before building)

        Teaching strategy:
        - Start with the ground floor pattern
        - Show how num_floors() returns a value you can store and use
        - Demonstrate the repeat loop for upper floors
        - Point out the y variable needs incrementing
      `
    }
  }
};
