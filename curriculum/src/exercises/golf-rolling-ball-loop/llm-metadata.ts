import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the repeat loop in a golf context. Students need to
    move a ball 60 units to the right using a repeat loop rather than writing
    60 individual roll_right() calls.

    The key insight is that a single repeated action (roll_right) needs to
    happen a specific number of times, making this a perfect use case for a loop.
  `,

  tasks: {
    "roll-ball": {
      description: `
        Students need to use a repeat loop to call roll_right() 60 times.
        The solution is just 3 lines: repeat 60 times do / roll_right() / end

        Common mistakes:
        - Writing roll_right() many times without a loop
        - Wrong repeat count (the ball moves from 28 to 88, which is 60 steps)

        Teaching strategy:
        - Ask how many times the ball needs to move (88 - 28 = 60)
        - Show the repeat loop syntax
        - Emphasize that loops save writing the same code many times
      `
    }
  }
};
