import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "implement-sieve" as const,
    name: "tasks.implementSieve.name",
    description: "tasks.implementSieve.description",
    hints: [],
    requiredScenarios: [
      "sieve-no-primes-under-two",
      "sieve-first-prime",
      "sieve-primes-up-to-10",
      "sieve-limit-is-prime",
      "sieve-primes-up-to-100"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "sieve-no-primes-under-two",
    name: "scenarios.sieveNoPrimesUnderTwo.name",
    description: "scenarios.sieveNoPrimesUnderTwo.description",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [1],
    expected: []
  },
  {
    slug: "sieve-first-prime",
    name: "scenarios.sieveFirstPrime.name",
    description: "scenarios.sieveFirstPrime.description",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [2],
    expected: [2]
  },
  {
    slug: "sieve-primes-up-to-10",
    name: "scenarios.sievePrimesUpTo10.name",
    description: "scenarios.sievePrimesUpTo10.description",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [10],
    expected: [2, 3, 5, 7]
  },
  {
    slug: "sieve-limit-is-prime",
    name: "scenarios.sieveLimitIsPrime.name",
    description: "scenarios.sieveLimitIsPrime.description",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [13],
    expected: [2, 3, 5, 7, 11, 13]
  },
  {
    slug: "sieve-primes-up-to-100",
    name: "scenarios.sievePrimesUpTo100.name",
    description: "scenarios.sievePrimesUpTo100.description",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [100],
    expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  }
];
