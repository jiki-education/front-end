import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches guard clauses: using continue to abandon an iteration
    early, and break to leave the loop entirely, instead of wrapping the body of
    a loop in a condition. Logical operators are banned so that the student
    cannot collapse the skip conditions into one wrapping if.

    Anchor steps, in the order a student should get them working:
    1. A loop that calls move() and stops at the checkered flag.
    2. Skipping bare grass, so empty squares add nothing.
    3. Skipping scenery with isEmoji(), placed AFTER the flag check.
    4. Joining words with a space, without a leading space on the first word.
    5. Apostrophe and comma squares, which need a flag variable carried between
       iterations to control the spacing.
    6. Stopping at seven words as a second exit, with recite() after the loop.
  `,

  tasks: {
    "collect-the-poem": {
      description: `
        Diagnosing where a student is stuck:

        - Poet never stops: the isEmoji() check is running before the flag check,
          so the flag is being treated as scenery. This is the single most common
          failure and produces an "walked off the end of the path" error.
        - Scenery or blanks appearing in the poem: the student handled the square
          but then fell through to the line that appends it. They need to leave
          the iteration, not just choose not to act.
        - Leading space on the poem: they are adding a space after every word
          rather than deciding whether one is needed before the next.
        - "heart ' s": the apostrophe is being treated as an ordinary word. It
          needs its own branch that writes to the poem and then leaves the
          iteration.
        - recite() called inside the loop: there are two ways the walk can end,
          and both have to reach the same single recite() afterwards.

        Do not hand over the guard-clause shape. Ask what should happen to the
        rest of the loop body once a square has been dealt with.
      `
    }
  }
};
