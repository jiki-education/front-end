import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise builds on the Skyscraper exercise by introducing random numbers
    and nested loops. Students construct multiple buildings side by side, each with
    a random number of floors. The key concepts are: nested repeat loops, tracking
    multiple position variables (x for building, y for floor), and using random numbers.
  `,

  tasks: {
    "build-skyline": {
      description: `
        Students need to:
        1. Get the number of buildings with num_buildings()
        2. Track x position starting at 1
        3. For each building:
           a. Generate random floors with random_number(0, 6)
           b. Build ground floor at y=1 with entrance pattern
           c. Use nested repeat for upper floors, incrementing y
           d. Build roof at final y
           e. Move x by 5 for the next building

        Common mistakes:
        - Not resetting y for each building (y starts at 2 for upper floors each time)
        - Forgetting to move x by 5 between buildings
        - Nested loop confusion: outer loop for buildings, inner for floors
        - Using wrong variable in inner loop (using x instead of y)
        - Not incrementing y inside the inner loop

        Teaching strategy:
        - Build on Skyscraper knowledge: "now do it multiple times"
        - Focus on variable scope: x tracks horizontal, y tracks vertical
        - Show the pattern: outer loop moves right, inner loop moves up
        - Emphasize resetting y for each building
      `
    }
  }
};
