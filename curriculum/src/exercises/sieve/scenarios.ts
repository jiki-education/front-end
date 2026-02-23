import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "implement-sieve" as const,
    name: "Implement the Sieve",
    description:
      "Write a function called sieve that takes a number and returns a list of all prime numbers up to and including that number, using the Sieve of Eratosthenes algorithm.",
    hints: [
      "Create a list of objects tracking each number and whether it's been crossed off",
      "Loop through the list, and for each uncrossed number, cross off all its multiples",
      "At the end, collect all uncrossed numbers (excluding 1) into the result"
    ],
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
    name: "No primes under two",
    description: "There are no prime numbers less than 2.",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [1],
    expected: []
  },
  {
    slug: "sieve-first-prime",
    name: "Find first prime",
    description: "The first prime number is 2.",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [2],
    expected: [2]
  },
  {
    slug: "sieve-primes-up-to-10",
    name: "Find primes up to 10",
    description: "Find prime numbers up to 10.",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [10],
    expected: [2, 3, 5, 7]
  },
  {
    slug: "sieve-limit-is-prime",
    name: "Limit is prime",
    description: "Find prime numbers up to a limit that is itself prime.",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [13],
    expected: [2, 3, 5, 7, 11, 13]
  },
  {
    slug: "sieve-primes-up-to-100",
    name: "Find primes up to 100",
    description: "Find all prime numbers up to 100.",
    taskId: "implement-sieve",
    functionName: "sieve",
    args: [100],
    expected: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
  }
];
