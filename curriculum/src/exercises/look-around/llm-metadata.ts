import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore writing functions that return values, by
    implementing the three sensing functions (canMove, canTurnLeft, canTurnRight) themselves on
    top of look(direction). The payoff concept is factoring the shared check into one helper that
    the three functions delegate to, instead of duplicating the logic three times.
  `,

  tasks: {
    "straight-path": {
      description: `
        First sensing function: canMove() via look("ahead"), returning true only when the space is
        safe. The easy miss is checking only for "wall" and forgetting the other unsafe values.
      `
    },
    "turn-left": {
      description: `
        Second sensing function: canTurnLeft() via look("left"), same safety logic as canMove().
        This is the moment to nudge toward a shared helper rather than copy-pasting the check.
      `
    },
    "turn-right": {
      description: `
        Third sensing function: canTurnRight() via look("right"). By now the helper pattern should
        be clear. The forks scenario relies on the navigation loop preferring left turns over right.
      `
    },
    "turn-around": {
      description: `
        All three sensing functions now exist, so the provided navigation loop should solve the
        mazes. This task just stresses the complete algorithm on harder mazes (fire, poop,
        backtracking); no new code is expected.
      `
    },
    "bonus-challenges": {
      description: `
        Two constraints that both reward the helper approach: call look() in only one place in the
        whole program, and add no more than 13 lines. Both fall out of one checkDirection(direction)
        plus three one-line delegating functions.
      `
    }
  }
};
