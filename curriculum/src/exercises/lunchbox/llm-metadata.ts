import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Greedy "fit as many as possible under a size budget" over an array of [name, size] pairs,
    partitioning every item into either the lunchbox or the backpack.

    Non-obvious context: the input arrives largest-first, and the expected outputs are the
    MAX-COUNT packing with BOTH result arrays ordered smallest-to-largest. So a student who
    walks the array as given (largest-first) fails "pack-the-most" — they grab a big item early
    and fit fewer. The intended insight is to go smallest-first (reverse the array), which both
    maximises the count AND produces the required smallest-to-largest ordering for free in both
    arrays. Because iteration is smallest-first, once an item is rejected every later item is
    bigger and also rejected, so the backpack naturally comes out sorted too.
  `,

  tasks: {
    "pack-lunchbox": {
      description: `
        Anchor steps:
        1. Read each pair: item[0] is the name, item[1] is the size.
        2. Turn the largest-first array into smallest-first (toReversed(), or otherwise).
        3. Loop smallest-first with a running total; if total + size stays within capacity, push
           the name onto the lunchbox and add the size, else push the name onto the backpack.
        4. Return [lunchbox, backpack] — an array of the two arrays, names only (not the pairs).

        Traps worth watching:
        - Forgetting to reverse: passes edge cases but fails "pack-the-most", and yields the
          wrong (largest-first) ordering in both arrays.
        - Using > / < instead of <= on the boundary (an item whose size exactly hits the
          remaining room must still fit).
        - Returning just the lunchbox, or returning the [name, size] pairs instead of the names.
      `
    },
    "solve-in-sixteen-lines": {
      description: `
        Bonus (conciseness): same logic, but within 16 lines of code (JS). The line to save is
        the intermediate reversed-array variable — inline items.toReversed() directly into the
        for-loop header instead of storing it first. Don't push toward cramped one-liners; the
        intended tightening is just dropping that one variable.
      `
    }
  }
};
