import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Design intent: the tables are NAMED rather than numbered, and the required scenarios place the
    matching guest at the first, a middle, and the last position. There is therefore no way to fake
    the answer from the loop counter or from a fixed index - the student has to index the tables
    array with the position where the name matched.

    A plain for-of over names loses the index, and is the single most common dead end here. Any
    index-carrying loop is fine: an indexed for, entries(), a counter, or indexOf on the names array.

    Task mapping: task 1 requires the whole thing end to end, multi-word surnames included; task 2 is
    a bonus that adds no behaviour, only a line budget.
  `,

  tasks: {
    "find-guest-table": {
      description: `
        The partial-surname scenario (lookalike entries "Ada Spitt" and "Hugo Ross-Pitt", with an
        arriving "Mr Pitt") exists specifically to catch a bare "does this name end with the
        surname" check.

        The paired multi-word cases matter: lloyd-webber needs every word after the honorific kept,
        and the negative mark-webber checks they did not fix it by loosening the match to "ends with
        the last word". Passing lloyd-webber but failing mark-webber means that loosening happened.

        String methods (split, slice, join, endsWith, startsWith, includes) are all available at this
        level and are entirely fair game. There is no reason to hand-roll character loops here - the
        array work is what is being taught.
      `
    },
    "solve-tightly": {
      description: `
        Bonus, line-budget only - their code already works and returns the right answers. The budget
        fits the canonical solution exactly, so what overshoots is hand-rolling something the level
        already gives them: a manual loop to strip the honorific, or a character-by-character suffix
        comparison. Point at whichever of those they wrote and let them find the method that replaces
        it. Do not imply the working solution is wrong.
      `
    }
  }
};
