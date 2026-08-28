import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    A single-task exercise combining string methods with array building. The solution
    decomposes into three small helpers (is-it-a-sock, what-would-its-partner-be-called,
    what-should-the-pair-be-called) plus one loop over both baskets combined.
  `,

  tasks: {
    "find-matching-socks": {
      description: `
        There is only one task, so the whole solution must be working before anything passes.
        The scenarios build up in difficulty though, so use them to locate where a student is
        stuck: empty-baskets/nothing-clean/nothing-dirty/no-socks pass as soon as the function
        returns an empty array, one-in-each needs the core matching logic, a-big-mix adds
        deduplication, and some-added-pain adds the decoys.

        Non-obvious traps in the test data:
        - Decoys that start with "left"/"right" or look sock-adjacent but aren't socks
          (e.g. "leftover fabric", "left brown shoe", "left green trainer") must be filtered
          out. Checking only the prefix is not enough; only items ending in " sock" count.
        - Every pair is discovered twice, once from each sock, so results must be deduplicated.
        - Both a-big-mix and some-added-pain use toEqual, so order matters. Iterating the
          combined clean-then-dirty array in order produces the expected order naturally,
          but a student who processes the baskets separately or reverses them will fail
          on ordering alone despite otherwise-correct logic.
      `
    },
    "solve-tightly": {
      description: `
        A bonus task, only meaningful once the main task passes. It reruns the same logic
        against a smaller basket and adds a line-count check: 29 lines or fewer in JavaScript.
        The route to it is extracting the repeated work into small named helpers rather than
        golfing statements onto one line, since the count ignores blank lines and comments but
        counts closing braces.
      `
    }
  }
};
