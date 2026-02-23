import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches using loops (repeat) to draw multiple shapes efficiently.
    Students complete a wall by adding 5 bricks using a single rectangle call inside a loop.
    Key concepts: loops, variables, calculating positions, code efficiency.
  `,

  tasks: {
    "finish-wall": {
      description: `
        Students must use a repeat loop to draw 5 bricks across the top of a wall.

        Key teaching points:
        1. Loop usage: Use a for loop that runs 5 times
        2. Position calculation: x position increases by 20 each iteration (0, 20, 40, 60, 80)
        3. Code efficiency: rectangle should only appear once (inside the loop)
        4. Variable tracking: Use a counter variable to calculate x position

        Brick specifications:
        - Width: 20, Height: 10
        - Y position: 0 (top of canvas)
        - X positions: 0, 20, 40, 60, 80

        Common mistakes:
        - Writing rectangle 5 times instead of using a loop
        - Incorrect position calculation (off by one errors)
        - Forgetting to update the position variable in the loop

        Solution approach:
        1. Set the fill color
        2. Initialize a counter variable (starting at -1 or 0 depending on approach)
        3. Use repeat 5 times
        4. Inside loop: increment counter, then draw rectangle at (counter * 20, 0, 20, 10)
      `
    }
  }
};
