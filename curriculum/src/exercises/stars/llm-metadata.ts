import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    The student writes layoutStars(numRows), which builds an array of star strings
    that gets SHORTER each row (layoutStars(3) produces ["***", "**", "*"]) then
    passes it to drawStars(array) to render it. drawStars draws the first (longest)
    string at the BOTTOM and stacks the shorter rows above it, forming an upward
    pyramid. The canvas shows a faint outline of the target; the student's gold
    stars must fill it exactly.

    Solution shape:
    1. Loop the row length down from numRows to 1 (a for loop counting down is the
       natural fit at this level).
    2. For each length, build a string of that many stars (start empty, add "*").
    3. push each string onto the result array.
    4. Call drawStars(result) at the end to draw the whole pyramid.
  `,

  tasks: {
    "draw-stars": {
      description: `
        Non-obvious traps (invisible from the instructions/solution alone):
        - Building ASCENDING (["*", "**", "***"]) instead of descending. That draws
          an upside-down triangle that won't match the outline.
        - Forgetting to call drawStars at the end, so nothing is drawn at all.
        - Off-by-one in the countdown: starting at numRows-1 (misses the longest
          row) or ending at 0 (draws an empty extra row).

        If stuck, have them trace numRows=3: first string "***", then "**", then "*".
      `
    }
  }
};
