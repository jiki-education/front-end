import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches the Sieve of Eratosthenes algorithm for finding prime numbers.
    Students learn to work with lists of dictionaries, nested loops, and algorithmic thinking.
    Key concepts: prime numbers, marking/filtering patterns, building result lists with push().
  `,

  tasks: {
    "implement-sieve": {
      description: `
        Students need to implement the Sieve of Eratosthenes:
        1. Create a list of number objects tracking each number and whether it's been crossed off
        2. Iterate through the list, marking multiples of each uncrossed number
        3. Collect all uncrossed numbers (excluding 1) into the result

        Common mistakes:
        - Forgetting to exclude 1 from the results
        - Off-by-one errors when generating multiples
        - Not handling the edge case where target < 2
        - Marking the prime itself as not prime (should only mark its multiples)

        Teaching strategy:
        - Encourage students to trace through the algorithm by hand first
        - Emphasize that this is about marking multiples, not testing divisibility
        - The dictionary/object approach helps track crossed-off state per number
        - push() is used to build the initial number list and the final primes list
      `
    }
  }
};
