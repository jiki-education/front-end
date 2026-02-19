import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches algorithmic thinking through the left-hand rule maze-solving algorithm.
    Students learn to combine conditionals (if/else if/else), boolean-returning functions, and loops
    to solve any maze programmatically. Key concepts: algorithmic problem-solving, conditional logic,
    sensing functions that return booleans, and iterative refinement of a solution.
  `,

  tasks: {
    "straight-path": {
      description: `
        Students just need to move forward repeatedly. This is the simplest case — no turning needed.
        The repeat loop handles running the code until the maze is solved.
        Common mistake: overcomplicating it — just move() is enough for this task.
      `
    },
    "turn-left": {
      description: `
        Students add the first conditional: if canTurnLeft() is true, turn left then move.
        This introduces the priority system — always check left first.
        Common mistake: forgetting to move() after turning.
      `
    },
    "turn-right": {
      description: `
        Students add else if branches for canMove() (go straight) and canTurnRight() (turn right).
        The forks scenario tests that left is prioritized over right.
        Common mistake: checking right before straight, or not using else if (checking all independently).
      `
    },
    "turn-around": {
      description: `
        Students handle the dead-end case in the else block: turn left twice (180 degrees) then move.
        This completes the full algorithm. The forks-2 scenario is a complex maze testing everything together.
        Common mistake: turning right twice instead of left twice, or forgetting to move after turning around.
      `
    }
  }
};
