import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces object-oriented programming. Students create a Ball
    instance using \`new Ball()\` and make it bounce off all four walls of a
    100x100 game area. The Ball has properties cx, cy, radius (read-only) and
    xVelocity, yVelocity (read/write). Students must detect wall collisions by
    checking boundary conditions and reverse the velocity, then call moveBall(ball)
    to update the ball's position. The ball starts near the bottom (cy=97) moving
    up-left, and must complete 376 moves (two full diamond cycles).
  `,

  tasks: {
    "bounce-ball": {
      description: `
        Students need to:
        1. Create a Ball instance with \`let ball = new Ball()\`
        2. Loop 376 times
        3. Check all four walls before each move:
           - Left wall: \`ball.cx - ball.radius <= 0\` → set xVelocity to 1
           - Right wall: \`ball.cx + ball.radius >= 100\` → set xVelocity to -1
           - Top wall: \`ball.cy - ball.radius <= 0\` → set yVelocity to 1
           - Bottom wall: \`ball.cy + ball.radius >= 100\` → set yVelocity to -1
        4. Call \`moveBall(ball)\` after the checks

        Common mistakes:
        - Forgetting to create the Ball instance first
        - Checking walls after moving instead of before
        - Using wrong comparison operators (< instead of <=, > instead of >=)
        - Setting velocity to 0 instead of reversing direction
        - Wrong loop count (must be exactly 376)

        Teaching strategy:
        - Start by explaining object creation with new Ball()
        - Show how to access properties like ball.cx
        - Explain the boundary detection logic for one wall first
        - Then extend to all four walls
        - Emphasize that velocity should only be 1 or -1
      `
    }
  }
};
