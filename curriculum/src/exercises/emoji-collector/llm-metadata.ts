import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches dictionary manipulation within a maze navigation context.
    Students must navigate a maze, collect emojis scattered throughout, track them
    in a dictionary (counting occurrences), and announce their collection at the end.
    Key concepts: dictionaries, key existence checking with hasKey(), combining
    maze navigation with data collection, and the look("down") direction for
    inspecting the current cell.
  `,

  tasks: {
    "collect-emojis": {
      description: `
        Students need to:
        1. Use look("down") to check the emoji on the current square
        2. Distinguish between special emojis (star, flag, white square) and collectible ones
        3. Use a dictionary to track emoji counts, using hasKey() to check for existing keys
        4. Call removeEmoji() after collecting to avoid double-counting
        5. Call announceEmojis() with the dictionary after the maze loop ends

        Common mistakes:
        - Forgetting to call removeEmoji() (leads to counting same emoji multiple times)
        - Not checking if the emoji is a special one before collecting
        - Not using hasKey() to initialize the dictionary entry before incrementing
        - Forgetting to call announceEmojis() after the repeat loop
      `
    },
    "random-emojis": {
      description: `
        This bonus task uses the same logic but with random emojis that change each run.
        The student's solution from the main task should work without modification.
        This tests that the code is truly generic and doesn't hardcode specific emoji values.
      `
    }
  }
};
