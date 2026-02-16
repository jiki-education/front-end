import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces calling the same function many times. Students call
    move_ball_right() 20 times to roll a golf ball into the hole. This sets up the
    motivation for learning loops later.
  `,

  tasks: {
    "roll-ball": {
      description: `
        Students must call move_ball_right() exactly 20 times to move the ball
        from position 28 to position 48.

        Key teaching points:
        - Each function call moves the ball one unit
        - Repetitive code is tedious — this motivates learning loops later
        - Sequential execution: each call happens in order

        Common mistakes:
        - Too few or too many calls
        - Trying to pass a number to move_ball_right (it takes no arguments)
      `
    }
  }
};
