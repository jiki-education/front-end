import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Objective: define a function that takes an input and uses it as a loop count. This is the student's
    first function-with-a-parameter, following maze-turn-around (a parameterless function).
  `,

  tasks: {
    "write-walk": {
      description: `
        Only the body of walk(numSteps) is editable — the signature, the closing brace, and the
        navigation calls (walk/turnLeft/turnRight) are locked, so the student's whole job is filling in
        the body. Watch for: using the numSteps parameter as the repeat count (not a hard-coded number),
        and not shadowing/renaming the parameter.
      `
    }
  }
};
