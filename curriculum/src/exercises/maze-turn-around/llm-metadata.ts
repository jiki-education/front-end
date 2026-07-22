import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise has the student extract the "turn left twice" logic from the previous exercise's
    maze solver into their own turnAround() function. The stub is the student's own solver carried
    forward from maze-automated-solve (via a placeholder), so its exact shape varies per student.
    Every maze (two in the main task, one in the bonus) contains dead ends that force the final
    else branch to run.
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
    },
    "bonus-short-solution": {
      description: `
        Same code as the main task, but a code check caps the program at 17 lines. The reference
        solution is exactly 17: the 15-line solver, plus the 4-line turnAround() function, minus the
        2 lines saved by replacing the 3-line inline else body (turnLeft/turnLeft/move) with a single
        turnAround() call. If a student is over the limit, look for leftover inline turns alongside
        the new function, or an unnecessary move() left in the else block.
      `
    }
  }
};
