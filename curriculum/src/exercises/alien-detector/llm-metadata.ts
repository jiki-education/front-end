import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore tracking state in lists, indexing into a list with a
    variable, and mutating list elements as the world changes.

    The hard part (not in the instructions): there is no isAlienAbove() helper, so the student must build
    their own model of the world from getStartingAliensInRow() and keep it in sync as they shoot. Anchor steps:
    1. Fetch the three rows and set up position/direction/shot state
    2. Sweep left/right, reversing at the column boundaries (0 and 10)
    3. Use position to index into each row, shoot the lowest alive alien in that column, and mark it false
    4. Detect when every element of every row is false, then fire the fireworks
  `,

  tasks: {
    "shoot-the-aliens": {
      description: `
        The student needs anchor steps 1-3 working: fetch the rows, sweep across reversing at the
        boundaries, and shoot/clear the alien at the current position. Helper functions are optional
        here; the logic can be inlined. Note: the student does not see these steps broken down.
      `
    },
    "fire-the-fireworks": {
      description: `
        The student has steps 1-3 working. They now need step 4: detect that all three rows are fully
        cleared after a shooting pass and call fireFireworks() instead of moving. Note: the student
        does not see these steps broken down.
      `
    },
    "fireworks-inside-loop": {
      description: `
        Bonus: ensure fireFireworks() fires inside the repeat loop, not after it. The natural solution
        already does this, so most students pass automatically. Note: the student does not see these
        steps broken down.
      `
    }
  }
};
