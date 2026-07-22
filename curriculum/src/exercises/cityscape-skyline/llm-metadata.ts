import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise builds directly on the Skyscraper exercise: now do it multiple times
    with random, variable widths. It allows a student to explore nested loops while
    juggling several position variables (building x, in-row col, floor y) and consuming
    return values from the random helpers.
  `,

  tasks: {
    "build-skyline": {
      description: `
        Anchor steps: get numBuildings(), then per building draw the entrance ground
        floor, the upper floors, the roof cap, and advance x to the next building.

        Non-obvious traps worth knowing (the rest is derivable from the solution):
        - Floor count off-by-one: randomNumFloors() is the TOTAL floors including the
          ground floor, and the roof is a cap not a floor. So the upper-floor loop runs
          floors - 1 times, and a building with N floors is N+1 rows tall.
        - Entrance column is (width - 1) / 2, NOT width / 2. Widths are always odd, so
          width / 2 is fractional and triggers a "must use whole numbers" logic error.
        - Drawing two cells on the same square raises "The builders are stuck..." — almost
          always a forgotten 1-column gap between buildings, or rows that overlap.

        A good first step is one fixed-width building to nail the row structure before
        introducing the width variable and entrance offset.
      `
    }
  }
};
