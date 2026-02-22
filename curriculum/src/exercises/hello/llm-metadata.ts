import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A simple introductory exercise for string concatenation.
    Students learn to build a greeting string from parts using concatenate().
  `,

  tasks: {
    "create-say-hello-function": {
      description: `
        Students need to use concatenate() to join "Hello, ", the name, and "!".

        Common mistakes:
        - Forgetting the comma and space after "Hello"
        - Forgetting the exclamation mark at the end
        - Trying to use + instead of concatenate()
      `
    }
  }
};
