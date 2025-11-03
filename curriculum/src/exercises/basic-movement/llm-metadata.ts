// Task IDs for type-safe LLM metadata
type TaskId = "move-character" | "bonus-challenges";

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description:
    "This exercise teaches function calling and repetition. " +
    "Students learn to call functions multiple times to achieve a goal.",

  tasks: {
    "move-character": {
      description:
        "Students need to call move() function 5 times. " +
        "Common mistakes: calling it too few or too many times, or not calling it at all."
    },
    "bonus-challenges": {
      description:
        "Students need to call move() function 10 times. " + "This reinforces the pattern from the previous task."
    }
  }
};
