import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore parallel iteration over two strings: tracking a
    shared index, comparing the character at the same position in each string, and accumulating
    a count of differences. The two strands are guaranteed equal length.
  `,

  tasks: {
    "calculate-hamming-distance": {
      description: `
        The student loops one string by index and compares each character against the same index
        in the other string, counting mismatches to return.

        The non-obvious point worth surfacing: the loop iterates one string but the index is also
        used to reach into the second string. Off-by-one indexing and incrementing the index in the
        wrong place are the usual stumbles. Working through a short pair of strands by hand helps.
      `
    }
  }
};
