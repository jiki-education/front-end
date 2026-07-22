import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore an if/else if/else chain that classifies a value into one
    of several ranges. It builds on the single if from the bouncer exercise.
  `,

  tasks: {
    "assign-wristband": {
      description: `
        Two non-obvious traps. (1) Boundaries are inclusive at the lower edge: 13 is a teen, 18 an adult,
        65 a senior, so conditions must be < 13, < 18, < 65 (the hidden boundary-13/18/65 scenarios catch
        an off-by-one like <= 13). (2) The branches must be a single else if chain, not separate ifs, since
        separate ifs can issue more than one wristband and the exercise errors if a person gets more than one.
      `
    }
  }
};
