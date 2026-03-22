import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to use return values from functions and combine them
    with loops and variables. Students build a skyscraper centered at column 19 (columns 17-21)
    on a city grid with a concrete floor. The ground floor starts at y=2 (above the concrete).

    Key concepts: storing a function's return value in a variable, using variables as function
    arguments (literal numbers are not allowed), and using a repeat loop to build variable-height
    structures.

    Important constraint: a code check enforces that ALL function arguments must be variables
    or expressions — students cannot pass literal numbers like buildWall(17, 2). They must
    store values in variables first (e.g. let x1 = 17) and pass those.
  `,

  tasks: {
    "build-skyscraper": {
      description: `
        The skyscraper is 5 columns wide, centered at column 19 (columns 17-21).
        Buildings start at y=2 (row 1 is the concrete floor).

        Students need to:
        1. Define variables for the 5 column positions (e.g. let x1 = 17, let x2 = 18, etc.)
        2. Call numFloors() and store the result, subtract 1 for upper floors
        3. Build the ground floor at y=2: wall, glass, entrance, glass, wall (WGEGW)
        4. Use a repeat loop for the upper floors: wall, glass, glass, glass, wall (WGGGW)
        5. Add the roof after the loop: all walls (WWWWW)

        Structure for numFloors() = 5: 1 entrance floor + 4 glass floors + 1 roof = 7 rows total.
        The roof is in ADDITION to the floor count.

        Common mistakes:
        - Using literal numbers instead of variables (code check will reject this)
        - Forgetting to subtract 1 from numFloors() for the loop count
        - Building floors in wrong order (should go bottom to top, incrementing y)
        - Wrong pattern for ground floor vs upper floors (entrance vs glass in center)
        - Off-by-one on y coordinate (forgetting to increment before or after building)
        - Not centering the building at column 19

        Teaching strategy:
        - First help them set up variables for x positions and understand the variables-only rule
        - Then build the ground floor pattern using those variables
        - Show how numFloors() returns a value to store and use for the loop
        - Demonstrate the repeat loop for upper floors with y incrementing
        - Point out the roof goes after the loop at the final y position
      `
    }
  }
};
