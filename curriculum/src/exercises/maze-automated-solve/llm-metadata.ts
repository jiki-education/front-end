import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Build a left-hand-rule maze solver, one if/else-if/else branch per task across the four tasks.
    The task entries below map each task to the branch it adds (the solution file is monolithic).
  `,

  tasks: {
    "straight-path": {
      description: `
        First task: just move() repeatedly. Common mistake: overcomplicating it.
      `
    },
    "turn-left": {
      description: `
        Builds on straight-path: add the first branch (if canTurnLeft, turn left then move).
        Common mistake: forgetting to move() after turning.
      `
    },
    "turn-right": {
      description: `
        Builds on turn-left: add else-if branches for canMove (straight) then canTurnRight.
        The forks scenario specifically tests that left is prioritised over right.
        Common mistake: using independent ifs instead of else-if, or checking right before straight.
      `
    },
    "turn-around": {
      description: `
        Final branch: the else handles dead ends with turn left twice, then move.
        Common mistake: turning right twice instead of left twice.
      `
    }
  }
};
