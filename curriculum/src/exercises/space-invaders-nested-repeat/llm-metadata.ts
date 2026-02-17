import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces nested repeat loops by adding a fourth row of aliens.
    Students already know how to use a single repeat loop from the previous exercise.
    Now they must put a repeat(4) { shoot() } inside the outer repeat(5) loop,
    creating a "loop in a loop" pattern. The 7-line limit forces them to use nesting
    rather than writing shoot() four times.
  `,

  tasks: {
    "nested-repeat-shoot": {
      description: `
        Students need to:
        1. Recognize the same column pattern: aliens at every other column (1, 3, 5, 7, 9)
        2. Notice there are now 4 rows instead of 3
        3. Use an inner repeat(4) for the 4 shots per column
        4. Wrap it in an outer repeat(5) for the 5 columns
        5. The full pattern: repeat(5) { move(); repeat(4) { shoot(); } move(); }

        Common mistakes:
        - Writing shoot() 4 times instead of using an inner loop (hits LOC limit)
        - Wrong inner repeat count (3 instead of 4 — they may assume same as previous exercise)
        - Wrong outer repeat count
        - Putting both move() calls together instead of around the inner loop
        - Forgetting the second move() after the inner loop

        Teaching strategy:
        - Start by asking what's different from the previous exercise (4 rows, not 3)
        - Ask: "Can you use a repeat loop for the 4 shots?"
        - Then: "Now can you put that inside another repeat loop for the columns?"
        - Emphasize the pattern: move to column, shoot all rows, move past
      `
    }
  }
};
