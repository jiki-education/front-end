import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Iterate a list of day-descriptions and draw each into its own box. The
    provided draw(box, day, elements) renders the artwork internally: box is
    the box number, day is the weekday label, elements is a list of symbols
    (NOT a description). Note the unusual arg order - the symbols come LAST.
  `,

  tasks: {
    "draw-forecast": {
      description: `
        The whole exercise is this one loop: walk the days list with a counter i,
        turn each description into its symbol list, and call
        draw(i, weekdays[i], symbols).

        The student needs a second, parallel array of weekday names
        ["Monday" ... "Saturday"] that they index with the SAME i as the box.
        That parallel-array-by-shared-index idea is the main new thing here.

        The solution extracts a descriptionToElements helper, but that is an
        optional tidy-up (un-inlining) - inlining the if/else-if directly in the
        loop is equally valid. Don't push the helper as required.

        Where students get stuck: passing the raw description to draw instead of
        the mapped symbol list; getting the three draw args in the wrong order
        (box, then weekday, then symbols); a weekdays array that's out of order
        or the wrong length; using for...of, which gives the value but not the
        index needed for both the box and weekdays[i].
      `
    }
  }
};
