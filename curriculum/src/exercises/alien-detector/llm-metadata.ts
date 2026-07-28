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

    The hard part (not stated in the instructions): there is no isAlienAbove() helper, so the student must
    build their own model of the world from getStartingAliensInRow() and keep it in sync as they shoot.
    Anchor steps:
    1. Fetch the three rows (indices 0, 1, 2 from the bottom) and set up position/direction/shot state
    2. Sweep left/right, reversing at the column boundaries (0 and 10)
    3. Use position to index into each row, shoot the lowest alive alien in that column, and mark it false

    Winning is automatic: the exercise finishes the instant the final alien is shot, so there is no
    end-of-game action for the student to perform.
  `,

  tasks: {
    "shoot-the-aliens": {
      description: `
        The one task: fetch the rows, sweep across reversing at the boundaries, and shoot/clear the alien
        at the current position, until every alien is down. Helper functions are optional; the logic can
        be inlined.
      `
    }
  }
};
