import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches students to define their own functions by extracting repeated code.
    Students take the working maze-solving algorithm from the previous exercise and create a
    turnAround() function that encapsulates the "turn left twice" logic. Key concepts: function
    definition, code organization, abstraction, and reusability.
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
    "turn-around-task": {
      description: `
        This is the key task for this exercise. Students must define a turnAround() function at the top
        of their code that calls turnLeft() twice, then use it in the else block. The code check verifies
        they actually defined the function rather than just using turnLeft() twice inline.
        Common mistakes: forgetting to define the function before the loop, not calling the function
        in the else block, or adding parameters when none are needed.
      `
    }
  }
};
