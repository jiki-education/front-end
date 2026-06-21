import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student practise building a list inside a loop while
    growing a string with the \`+\` operator across iterations.
  `,

  tasks: {
    "create-stars-function": {
      description: `
        Common mistakes:
        - Off-by-one: pushing the star before concatenating (or vice versa)
        - Returning the star string instead of the result list
        - Worrying about count=0; a loop that repeats 0 times handles it automatically

        If stuck, trace count=3 step by step to show how the string grows each iteration.
      `
    }
  }
};
