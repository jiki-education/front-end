import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise extends the previous Wordle exercise to process a full game of multiple guesses.
    Students learn to iterate through a list of guesses and process each one, building on their
    processGuess logic. Key concepts: iterating with index, function composition, reusing code.
  `,

  tasks: {
    "process-game": {
      description: `
        Students need to iterate through each guess using a loop with an index to get the row number,
        then call their processGuess function for each guess and pass the result to colorRow.
        Common mistakes: not using indexed iteration, off-by-one errors with row numbers,
        not reusing processGuess from the previous exercise.
      `
    }
  }
};
