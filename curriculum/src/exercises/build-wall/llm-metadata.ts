import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches nested loops and conditional logic to build a brick wall pattern.
    Students create 55 bricks in 10 rows with alternating patterns.
    Key concepts: nested loops, conditionals, modulo operator, position calculations.
  `,

  tasks: {
    "build-wall": {
      description: `
        Students must build a complete wall of 55 bricks using nested loops.

        Key teaching points:
        1. Nested loops: Outer loop for rows (10), inner loop for bricks per row (5 or 6)
        2. Alternating pattern: Even rows (0,2,4...) have 5 bricks starting at x=0
           Odd rows (1,3,5...) have 6 bricks starting at x=-10
        3. Modulo operator: Use row % 2 to determine even/odd rows
        4. Position calculation: x = col * width, y = row * height
        5. Code efficiency: rectangle should only appear once (inside nested loops)

        Wall structure:
        - 10 rows total
        - Even rows: 5 bricks, starting at x=0
        - Odd rows: 6 bricks, starting at x=-10 (half brick offset)
        - Total: 5*5 + 6*5 = 55 bricks
        - Each brick: 20 wide, 10 tall

        Common mistakes:
        - Forgetting to alternate starting positions
        - Incorrect loop counts
        - Not using modulo for even/odd detection
        - Hard-coding positions instead of calculating

        Solution approach:
        1. Set up width (20) and height (10) variables
        2. Outer loop: iterate 10 times for rows
        3. Inside outer loop: check if row is even or odd
        4. Set starting column and iteration count based on row type
        5. Inner loop: draw bricks at calculated positions
      `
    }
  }
};
