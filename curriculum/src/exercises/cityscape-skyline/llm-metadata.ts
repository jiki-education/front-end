import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise builds on the Skyscraper exercise by introducing random numbers,
    variable-width buildings, and nested loops. Students construct multiple buildings
    side by side on a city grid with a concrete floor. Each building has a random
    width (3, 5, or 7) and random number of floors (1-12). Key concepts: nested
    repeat loops, tracking multiple position variables, using return values from
    functions, and computing derived values like entrance offset.
  `,

  tasks: {
    "build-skyline": {
      description: `
        Students need to:
        1. Get the number of buildings with numBuildings()
        2. Track x position starting at 2 (1-column left margin)
        3. For each building:
           a. Get random width with randomWidth() — returns 3, 5, or 7
           b. Get random floors with randomNumFloors() — returns 1-12
           c. Compute entranceOffset = (width - 1) / 2 (always integer since widths are odd)
           d. Build ground floor at y=2 (above concrete floor):
              - Wall at x, glass up to entrance, entrance at x + entranceOffset,
                glass after entrance, wall at x + width - 1
              - Uses two repeat loops for glass on each side of entrance (entranceOffset - 1 each)
           e. Build upper floors (y=3 upward) with nested repeat:
              - Wall at x, glass across middle (width - 2 cells), wall at x + width - 1
           f. Build roof at final y: all walls across width
           g. Move x by width + 1 for the next building (1-column gap)

        The solution uses a col variable to track horizontal position within each row,
        resetting it for each new row.

        Common mistakes:
        - Not resetting y to 3 for each building
        - Forgetting the 1-column gap between buildings (x += width + 1, not x += width)
        - Wrong entrance position — must be centered using (width - 1) / 2
        - Asymmetric glass on ground floor — both sides need entranceOffset - 1 glass panels
        - Not resetting col for each row
        - Nested loop confusion: outer loop for buildings, inner loops for floors and columns
        - Using wrong variable in inner loop (using x instead of col, or y instead of col)
        - Off-by-one on ground floor wall position (x + width - 1, not x + width)

        Teaching strategy:
        - Build on Skyscraper knowledge: "now do it multiple times with variable sizes"
        - Start with a single building of fixed width to get the structure right
        - Then add the width variable and entrance offset calculation
        - Focus on variable scope: x tracks building position, col tracks within a row, y tracks floor
        - Show the pattern: outer loop moves right, inner loops build each row
        - Emphasize resetting y and col for each building/row
      `
    }
  }
};
