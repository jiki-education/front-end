import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore extracting logic into a named function. It builds directly
    on the earlier scroll-and-shoot exercise; the student already knows the move-and-shoot algorithm, and
    the only new step is pulling the shooting check out into shootIfAlienAbove().
  `,

  tasks: {
    "battle-procedures": {
      description: `
        The grader requires a function literally named shootIfAlienAbove to be defined and used. The
        movement/direction logic from scroll-and-shoot stays inline in the loop. The extracted function
        only needs to call other functions, not read outer variables. Note: the student does not see these
        steps broken down.
      `
    }
  }
};
