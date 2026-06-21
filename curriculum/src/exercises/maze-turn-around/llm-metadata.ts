import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore defining their own function by extracting the
    "turn left twice" logic of the previous exercise's maze solver into a turnAround() function.
    The first three tasks just re-establish the already-known solver; the real work is the final task.
  `,

  tasks: {
    "straight-path": {
      description: `
        First branch of the re-established solver: just move() repeatedly.
      `
    },
    "turn-left": {
      description: `
        Add the if canTurnLeft branch (turn left then move). Common mistake: forgetting to move().
      `
    },
    "turn-right": {
      description: `
        Add the else-if straight then else-if canTurnRight branches; forks tests left-priority.
      `
    },
    "turn-around-task": {
      description: `
        The key task: define a turnAround() function (no inputs, calls turnLeft() twice) and use it
        in the final else. A code check verifies the function is actually DEFINED, so using turnLeft()
        twice inline will fail even though it works. Common mistake: adding parameters when none are needed.
      `
    }
  }
};
