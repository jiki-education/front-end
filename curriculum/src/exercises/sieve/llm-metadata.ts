import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise lets a student explore the Sieve of Eratosthenes: a marking/filtering algorithm rather than per-number divisibility testing.
  `,

  tasks: {
    "implement-sieve": {
      description: `
        The reference solution uses a boolean array indexed by number (isPrime[i]), marking composites false by stepping through multiples of each prime, then collecting the still-true indices.

        Common mistakes:
        - Not handling target < 2 (should return an empty array)
        - Off-by-one errors when generating multiples
        - Marking the prime itself rather than only its multiples
        - Testing divisibility instead of marking multiples (this exercise is specifically about the marking approach)

        Teaching strategy: encourage tracing the algorithm by hand first, and emphasise that it advances by adding/multiplying to reach multiples, not by dividing.
      `
    }
  }
};
