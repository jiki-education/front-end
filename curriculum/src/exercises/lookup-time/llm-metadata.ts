import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore working with dictionaries by parsing
    a dictionary response from an API function into a formatted string.

    Anchor steps:
    1. Call fetch and store the response dictionary
    2. Read the "dayOfWeek" and "time" keys and concatenate them with the city into the formatted string
    3. Detect the "error" key in the response and return data["error"] instead of the time string

    Teaching note: the response only contains an "error" key on failure (the other keys are
    absent), so the error check needs a key-presence test rather than reading the key directly.
  `,

  tasks: {
    "fetch-and-format-time": {
      description: `
        The student needs to complete steps 1-3. Note: the student does not see these steps broken down.
      `
    },
    "handle-errors": {
      description: `
        The student has got steps 1-3 working. They now need to complete steps 4-5. Note: the student does not see these steps broken down.
      `
    }
  }
};
