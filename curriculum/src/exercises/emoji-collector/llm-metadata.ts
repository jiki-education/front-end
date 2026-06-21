import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student combine maze navigation with dictionary-based
    tallying: walk the maze, count the non-special emojis found, and announce the
    result at the end. It builds on prior maze exercises by adding the look("down")
    direction (inspects the current cell) and a collection step.

    Anchor steps:
    1. Inspect the current cell with look("down").
    2. Skip the special emojis (star/flag/white-square); they aren't collectibles.
    3. Tally each collectible in a dictionary, initialising the key on first sight.
    4. Call removeEmoji() once collected so the cell isn't counted again.
    5. After the maze loop, pass the dictionary to announceEmojis().
  `,

  tasks: {
    "collect-emojis": {
      description: `
        Non-obvious traps to watch for:
        - Without removeEmoji() the same cell gets re-counted on revisits.
        - The key must be initialised before incrementing, or the count is wrong.
        - announceEmojis() must run after the loop, not inside it.
      `
    },
    "random-emojis": {
      description: `
        Bonus: same task but the emojis are randomised each run, so a correct
        generic solution from the main task passes unchanged. The point is to
        catch solutions that hardcoded specific emoji values.
      `
    }
  }
};
