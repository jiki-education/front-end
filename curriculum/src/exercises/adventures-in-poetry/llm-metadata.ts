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
    a loop in a condition. && and ! are banned so the skip conditions cannot be
    collapsed into one wrapping if, and so De Morgan cannot hand the ban back.
    || is allowed, and the flat guard list is the shortest correct shape.

    Anchor steps, in the order a student should get them working:
    1. A loop that calls move() and breaks at the checkered flag, checked first.
    2. Skipping squares that are not part of the poem, both bare grass and
       scenery. The flag is an emoji too, so this must come after the flag check.
    3. Joining words with a space, without a leading space on the first word.
    4. Apostrophe and comma squares, which need a flag variable carried between
       iterations to control the spacing.
    5. Stopping at seven words as a second exit, with recite() after the loop.
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
    },

    "solve-tightly": {
      description: `
        Bonus task. The behaviour is identical to collect-the-poem, and the only
        extra requirement is a line limit matching the canonical solution. A
        student failing only this already has a working walk, so diagnose length,
        not logic. The saving is usually the two skip guards: an empty square and
        a piece of scenery are both "not part of the poem", so one guard with ||
        covers both. Do not suggest merging the apostrophe and comma branches
        into one - it fits the limit, but it duplicates the comma test and
        smears one rule across two places.
      `
    }
  }
};
