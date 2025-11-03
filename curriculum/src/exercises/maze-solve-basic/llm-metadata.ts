// Task IDs for type-safe LLM metadata
type TaskId = "solve-maze";

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description:
    "This exercise teaches spatial reasoning and sequential function calling. " +
    "Students learn to navigate a grid by calling movement and direction functions.",

  tasks: {
    "solve-maze": {
      description:
        "Students need to navigate through a maze using move(), turnLeft(), and turnRight() functions. " +
        "Common mistakes: hitting walls, not planning the path ahead, confusing left/right directions."
    }
  }
};
