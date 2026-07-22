import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore creating an object instance (new Ball()), reading and
    writing its properties, and using collision logic to keep it inside bounds.
  `,

  tasks: {
    "bounce-ball": {
      description: `
        Non-obvious points: collision tests must account for the radius (ball.cx - radius <= 0 and
        ball.cx + radius >= 100, same for cy) so the ball never overlaps the edge; the checks must run
        BEFORE moveBall() each iteration; and velocities must be reversed to exactly 1 or -1, never 0.
        The grader requires exactly 376 moves (two full diamond cycles) so the ball returns to its start.
      `
    }
  }
};
