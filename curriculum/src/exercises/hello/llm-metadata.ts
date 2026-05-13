import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A simple introductory exercise for string concatenation.
    Students learn to build a greeting string from parts using concatenation (the \`+\` operator) or a template string.
  `,

  tasks: {
    "create-say-hello-function": {
      description: `
        Students need to join "Hello, ", the name, and "!" using concatenation (the \`+\` operator) or a template string.

        Common mistakes:
        - Forgetting the comma and space after "Hello"
        - Forgetting the exclamation mark at the end
      `
    }
  }
};
