import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise has the student extract the "turn left twice" logic from the previous exercise's
    maze solver into their own turnAround() function. They already know the left-priority solver
    (if canTurnLeft -> turn left + move, else if canMove -> move, else if canTurnRight -> turn right
    + move, else -> turn around); the new work is defining turnAround() and calling it in the final
    else. All three mazes contain dead ends that force that else branch to run.
  `,

  tasks: {
    "turn-around": {
      description: `
        Define turnAround() at the top of the code (no inputs, no return, just two turnLeft() calls),
        then call it in the final else block. Diagnose in order: (1) is turnAround defined at all?
        (2) does its body call turnLeft() twice? (3) is it actually CALLED in the else, rather than
        two inline turnLeft() calls? Two code checks enforce this: turnAround must be DEFINED and must
        be CALLED outside its own definition, so inlining turnLeft() twice fails even though it would
        otherwise solve the maze. Common mistakes: leaving the body empty, adding parameters when none
        are needed, or forgetting to replace the inline turns with the new call.
      `
    }
  }
};
