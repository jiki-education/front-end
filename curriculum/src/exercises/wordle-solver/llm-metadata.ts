import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    The target word never reaches the student's code. guess(word) scores a word internally, draws it,
    and returns only the array of states, so every deduction has to come from those states.
    That is the whole difficulty: accumulating knowledge across guesses and filtering commonWords()
    down with it. The scenarios chunk that progression, and the student is graded on the exact rows
    they produce, so an inefficient-but-correct solver still fails.

    Solution shape:
    1. Knowledge held outside the guessing loop: absent letters, present letters, and per-position
       (known letter, ruled-out letters).
    2. chooseWord() walks commonWords() in order and returns the first word consistent with that knowledge.
    3. After each guess, record what the returned states taught you.
    4. Stop when every state is "correct", or after 6 rows.

    Non-obvious trap: because guess() applies the duplicate-letter rule, a letter can come back "absent"
    while still being in the target (a second "s" in "swiss" against "swims"). Recording that letter as
    globally absent excludes a letter that is actually in the word and the solver stops converging.
  `,

  tasks: {
    "first-word": {
      description: `
        Step 1 only, and deliberately trivial: guess commonWords()[0] ("which") and stop.
        The target is "which", so the loop and the stop condition are all that is being tested.
      `
    },
    "handle-wrong": {
      description: `
        Adds step 2 in its simplest form. The first guess is entirely absent, so the student needs
        to move to the next candidate. Filtering on absent letters alone is enough here.
      `
    },
    "handle-partial": {
      description: `
        Steps 2 and 3 for "correct" and "absent" letters. The student must pin correct letters to their
        positions and exclude absent ones. Common mistake: excluding a letter from the whole word when
        it was only wrong in one position.
      `
    },
    "handle-present": {
      description: `
        The hardest task. "present" carries two facts at once: the letter IS in the word, and it is NOT
        at that position. Students routinely record only the first and then re-guess the letter in the
        same slot, so the solver stalls and overruns 6 rows.
      `
    }
  }
};
