import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore the "canonical form" pattern: detecting anagrams by
    comparing sorted-letter signatures rather than the words themselves.
  `,

  tasks: {
    "find-anagrams": {
      description: `
        The core idea is sorting each word's letters (after lowercasing) so anagrams share an identical
        signature. Several subtle constraints trip students up at once: comparison is case-insensitive,
        but results must keep the possibility's ORIGINAL casing; a word is never its own anagram (check
        this case-insensitively, so "banana" excludes "BANANA"); and subsets/different lengths must not
        match (the signature comparison handles this naturally if letters aren't deduped).
      `
    },
    "sorted-results": {
      description: `
        Bonus: the returned list must be in alphabetical order. If the student already sorts before
        returning, this passes; otherwise it's just adding a final sort of the result list. Note: the
        student does not see these steps broken down.
      `
    }
  }
};
