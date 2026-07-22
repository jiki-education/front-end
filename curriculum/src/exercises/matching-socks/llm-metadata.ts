import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore deep decomposition into helper functions plus
    string/list manipulation. It is the hardest exercise in the curriculum so far, and is best
    approached by writing and testing small helpers (length, startsWith, endsWith, prefix
    stripping, extracting socks, swapping left/right, deduping) one at a time before the main
    function. Some of these helpers may have been written in earlier exercises.
  `,

  tasks: {
    "find-matching-socks": {
      description: `
        Teaching strategy: encourage one-helper-at-a-time, verified with log statements, so the
        final matchingSocks function stays simple.

        Non-obvious traps in the test data:
        - "left " is 5 characters but "right " is 6 — a fixed strip length breaks one of them
        - Decoys that start with "left"/"right" or contain "sock" but aren't socks
          (e.g. "leftover fabric", "left brown shoe") must be filtered out; only items
          ending in " sock" count
        - The same pair can be discovered more than once, so results must be deduplicated
      `
    }
  }
};
