import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise extends the previous Wordle exercise to process a full game of multiple guesses.
    The key build-on is reusing the processGuess function from that exercise here, one row at a time.
  `,

  tasks: {
    "process-game": {
      description: `
        Students need to iterate through each guess using a loop with an index to get the row number,
        then call their processGuess function for each guess and pass the result to colorRow.
        Common mistakes: not using indexed iteration, off-by-one errors with row numbers,
        not reusing processGuess from the previous exercise.
      `
    },
    "duplicate-letters": {
      description: `
        Bonus task. The scoring in the main task is naive: it marks a letter present whenever the
        target contains it anywhere. The bonus requires counting, so a letter is only colored as
        many times as it actually occurs in the target, with greens claiming their occurrence first
        and leftover yellows resolving left to right. Students usually reach for a second pass over
        the states rather than trying to get it right in one. The common wrong answer looks correct
        on bonus-1 and fails the fourth row of bonus-2 ("swiss" against "swims").
      `
    }
  }
};
