import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches using functions that return values combined with variables and loops.
    Students call getShotLength() to get a number, then use it to control a loop that rolls
    a golf ball across the screen. Four scenarios test different shot lengths.
  `,

  tasks: {
    "roll-and-celebrate": {
      description: `
        Students need to:
        1. Call getShotLength() and store the result in a variable
        2. Track x position starting at 29
        3. Use a loop (shotLength + 1 times) to roll the ball right
        4. Fire fireworks at the end

        Key functions:
        - rollTo(x): rolls the ball to position x
        - getShotLength(): returns the shot length
        - fireFireworks(): fires celebratory fireworks

        Common mistakes:
        - Forgetting to store the shot length in a variable
        - Hardcoding the loop count instead of using the shot length variable
        - Not incrementing x before calling rollTo
        - Forgetting to call fireFireworks() at the end

        Teaching strategy:
        - Focus on the return value concept: getShotLength() gives you a number
        - Emphasize storing return values in variables for later use
        - The multiple scenarios prove the code works for any shot length
      `
    }
  }
};
