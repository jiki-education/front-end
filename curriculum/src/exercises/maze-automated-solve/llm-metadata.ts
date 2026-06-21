import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore algorithmic thinking by building the left-hand-rule
    maze solver incrementally, one branch of the if/else-if/else at a time across the four tasks.
    The instructions reveal the full algorithm, but the intent is for the student to reason it out.
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
