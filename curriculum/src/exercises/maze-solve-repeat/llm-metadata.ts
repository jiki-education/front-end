import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches the repeat loop by having students refactor a working but
    verbose maze solution. The stub contains 28 lines of sequential move(), turnLeft(),
    and turnRight() calls. Students must replace consecutive move() groups with repeat
    blocks to get the code under 22 lines.

    The maze is a snake pattern with corridors of length 6, 2, 1, 1, 4, 3, and 5 moves.
    Groups of 3 or more moves should be wrapped in repeat blocks. The group of 2 and
    single moves should be left as individual calls since wrapping them would not save lines.
  `,

  tasks: {
    "solve-maze-with-repeat": {
      description: `
        Students need to:
        1. Identify groups of consecutive move() calls in the stub
        2. Count how many moves are in each group (6, 2, 1, 1, 4, 3, 5)
        3. Replace groups of 3+ with repeat(N) { move(); } blocks
        4. Leave single move() calls and the group of 2 as-is
        5. Keep the turn functions (turnRight, turnLeft) between the repeat blocks

        Common mistakes:
        - Putting turn functions inside the repeat block
        - Wrong count for the repeat (e.g., repeat(5) instead of repeat(6))
        - Wrapping the group of 2 in a repeat, which actually adds a line in JavaScript
        - Removing or reordering turn calls when refactoring

        Teaching strategy:
        - Point out the groups of consecutive move() calls
        - Ask: "How many times does move() repeat before the next turn?"
        - Show the repeat syntax: repeat(n) { ... }
        - Emphasize that turns stay outside the loops
        - Explain that repeat(2) is not shorter than two individual calls
      `
    }
  }
};
