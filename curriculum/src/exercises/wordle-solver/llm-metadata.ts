import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise builds a Wordle solver. Students must create a process_game function that
    automatically guesses words using knowledge accumulated from previous guesses. It combines
    string comparison, dictionary/knowledge tracking, and list filtering.
    Key concepts: dictionaries, knowledge representation, filtering, iterative refinement.
  `,

  tasks: {
    "first-word": {
      description: `
        Students start by guessing the first word from common_words() and checking it against
        the target. This establishes the basic loop: guess, check, add to board.
      `
    },
    "handle-wrong": {
      description: `
        When a guess is entirely wrong, students need to track absent letters and filter the
        word list to exclude words containing those letters.
      `
    },
    "handle-partial": {
      description: `
        Students need to track correct letter positions and ensure future guesses have those
        letters in the right places. This narrows down possibilities quickly.
      `
    },
    "handle-present": {
      description: `
        Present (yellow) letters must appear somewhere in the word but NOT at the position
        where they were found. Students need to track both where letters must be and where
        they can't be. This requires a more sophisticated knowledge representation.
      `
    },
    bonus: {
      description: `
        The bonus handles duplicate letters: if a letter appears twice in a guess but only
        once in the target, only one should be marked present. Students need to count letter
        frequencies and track how many have been accounted for. This is the hardest part.
      `
    }
  }
};
