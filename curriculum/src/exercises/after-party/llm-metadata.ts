import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This follows guest-list and meal-prep, where the student learned to scan a list and answer "does it contain
    this?". The jump here is to "where is it, and what sits at that same place in the other list?".

    Despite this being the lists level, string methods are unlocked: startsWith, includes, split and friends are
    all fair game. The string handling is a means to an end, not the point - do not push a student towards
    hand-rolling character-by-character comparison.
  `,

  tasks: {
    "look-up-plus-ones": {
      description: `
        Ordered build progression. Each step should run and be observable before moving on:

        1. Loop over the names by position and confirm they can observe names[i] and plusOnes[i] together for
           each guest. This is the whole lesson in miniature; do not let them skip it.
        2. Return plusOnes[i] on an exact match of names[i] against person. Passes nothing yet, but establishes
           the return-from-inside-the-loop shape.
        3. Widen the match so a first name matches the start of a full name. name-present and double-barrelled
           pass.
        4. Tighten it so "Brad" doesn't match "Bradley Cooper". similar-name passes. There is more than one
           reasonable way to do this (a boundary check, or splitting off the first word) - accept either.
        5. Return "Not on the list!" after the loop. empty-list and name-missing pass.

        Diagnosing the next broken sub-step, in the order you should check:

        - Right answers for the first guest, wrong for everyone else: they're reading a fixed index, usually
          plusOnes[0], instead of the index they matched at. This is the classic parallel-arrays slip and the
          scenarios are built to catch it.
        - similar-name failing: the match has no boundary at the end of the first name. Ask them to compare
          "Brad Pitt" and "Bradley Cooper" and say where those two first differ from each other after "Brad".
        - two-brads failing: they're carrying on past a match instead of answering with the first one found.
        - allowed-nobody failing while name-present passes: they're only returning plusOnes[i] when it's
          non-zero, or otherwise treating 0 as "no match", so Brad falls through to the end and gets the
          not-on-the-list string instead of his real answer of 0.
        - cher failing: they've assumed every entry has a space in it, so an entry that is only a first name
          never matches.
        - cheryl failing: their comparison is running in the wrong direction - they're asking whether the given
          name starts with the list entry rather than the other way round. Ask which of the two strings is the
          one on the clipboard.
      `
    }
  }
};
