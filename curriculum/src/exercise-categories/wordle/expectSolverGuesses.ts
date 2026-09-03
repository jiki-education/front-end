import type { VisualTestExpect } from "../../exercises/types";
import type WordleExercise from "./WordleExercise";
import { COMMON_WORDS, scoreGuess } from "./WordleExercise";

// Checks a solver's guesses against the sequence a correct solver makes for the
// exercise's target word, and explains the first guess that goes wrong in terms
// of what the student had already learnt from their own earlier guesses. The
// row colours are a consequence of the word chosen, so "we expected row 3 to be
// present, absent, ..." told the student what they were looking at without
// telling them why their code chose the wrong word.
//
// The expected sequence is the one the task description asks for: always the
// first word in commonWords() that fits everything learnt so far.

interface Knowledge {
  absent: Set<string>;
  present: Set<string>;
  correct: (string | null)[];
  notAt: Set<string>[];
}

function emptyKnowledge(): Knowledge {
  return {
    absent: new Set(),
    present: new Set(),
    correct: [null, null, null, null, null],
    notAt: [new Set(), new Set(), new Set(), new Set(), new Set()]
  };
}

function learn(knowledge: Knowledge, word: string, states: string[]) {
  for (let idx = 0; idx < word.length; idx++) {
    const letter = word[idx];
    if (states[idx] === "correct") {
      knowledge.correct[idx] = letter;
    } else if (states[idx] === "present") {
      knowledge.present.add(letter);
      knowledge.notAt[idx].add(letter);
    } else if (!foundElsewhere(word, states, letter)) {
      knowledge.absent.add(letter);
    }
  }
}

// A grey letter only rules the letter out if no other copy of it in the same
// guess was coloured: a second copy of a letter the target holds once is grey.
function foundElsewhere(word: string, states: string[], letter: string): boolean {
  for (let idx = 0; idx < word.length; idx++) {
    if (word[idx] === letter && states[idx] !== "absent") return true;
  }
  return false;
}

// Returns the message key describing why `word` contradicts `knowledge`, or
// null if it is consistent with everything learnt so far.
function contradiction(knowledge: Knowledge, word: string): { key: string; params: Record<string, unknown> } | null {
  for (let idx = 0; idx < word.length; idx++) {
    const known = knowledge.correct[idx];
    if (known !== null && word[idx] !== known) {
      return { key: "checks.guessIgnoresCorrect", params: { letter: known.toUpperCase(), square: idx + 1 } };
    }
  }
  for (const letter of word) {
    if (knowledge.absent.has(letter)) {
      return { key: "checks.guessUsesAbsent", params: { letter: letter.toUpperCase() } };
    }
  }
  for (const letter of knowledge.present) {
    if (!word.includes(letter)) {
      return { key: "checks.guessMissesPresent", params: { letter: letter.toUpperCase() } };
    }
  }
  for (let idx = 0; idx < word.length; idx++) {
    if (knowledge.notAt[idx].has(word[idx])) {
      return { key: "checks.guessRepeatsPresentSquare", params: { letter: word[idx].toUpperCase(), square: idx + 1 } };
    }
  }
  return null;
}

function firstFittingWord(knowledge: Knowledge): string | undefined {
  return COMMON_WORDS.find((candidate) => contradiction(knowledge, candidate) === null);
}

function isSolved(states: string[]): boolean {
  return states.length === 5 && states.every((state) => state === "correct");
}

export function expectSolverGuesses(exercise: WordleExercise): VisualTestExpect {
  const target = exercise.currentTargetWord();
  const guesses = exercise.guessesMade();
  const knowledge = emptyKnowledge();

  for (let idx = 0; idx < guesses.length; idx++) {
    const row = idx + 1;
    const word = guesses[idx];
    const params: Record<string, unknown> = { row, word: word.toUpperCase() };

    if (idx > 0 && isSolved(scoreGuess(target, guesses[idx - 1]))) {
      return { pass: false, errorHtml: exercise.t("checks.guessAfterSolved", { row }) };
    }
    if (!COMMON_WORDS.includes(word)) {
      return { pass: false, errorHtml: exercise.t("checks.guessNotCommonWord", params) };
    }

    const reason = contradiction(knowledge, word);
    if (reason !== null) {
      return { pass: false, errorHtml: exercise.t(reason.key, { ...params, ...reason.params }) };
    }
    const expected = firstFittingWord(knowledge);
    if (word !== expected) {
      return {
        pass: false,
        errorHtml: exercise.t("checks.guessNotFirstFitting", { ...params, expected: expected?.toUpperCase() })
      };
    }

    learn(knowledge, word, scoreGuess(target, word));
  }

  const lastGuess = guesses[guesses.length - 1];
  if (lastGuess === undefined || !isSolved(scoreGuess(target, lastGuess))) {
    return { pass: false, errorHtml: exercise.t("checks.stoppedBeforeSolved", { guesses: guesses.length }) };
  }

  return { pass: true };
}
