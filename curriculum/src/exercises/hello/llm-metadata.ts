import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A deliberately quick warm-up: the single task is the whole exercise, and it exists to set up the next, more involved string exercise.
  `,

  tasks: {
    "create-say-hello-function": {
      description: `
        Common mistakes:
        - Forgetting the comma and space after "Hello"
        - Forgetting the exclamation mark at the end
      `
    }
  }
};
