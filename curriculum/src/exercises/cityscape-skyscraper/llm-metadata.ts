import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore consuming a function's return value
    (numFloors()) and feeding it into a repeat loop to build a variable-height structure.
    It is the lead-in to the Skyline project.

    Key non-obvious constraint: a code check (assertAllArgumentsAreVariables) rejects literal
    numbers as function arguments. Students must store values in variables or use expressions
    (e.g. let x = 19; buildWall(x - 2, y)), never buildWall(17, 2).
  `,

  tasks: {
    "build-skyscraper": {
      description: `
        Anchor steps: ground floor (WGEGW), a repeat loop for the upper floors (WGGGW),
        then a roof (WWWWW). Centered at column 19; ground floor at y=2.

        Trap: the roof is IN ADDITION to numFloors(), so the upper-floor loop runs
        numFloors() - 1 times. A building with N floors is N+1 rows tall.

        First thing to get right with a struggling student is the variables-only rule,
        since the code check fails confusingly if they pass literals.
      `
    }
  }
};
