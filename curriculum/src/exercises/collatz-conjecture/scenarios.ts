import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "calculate-collatz-steps" as const,
    name: "Calculate Collatz steps",
    description:
      "Write a function that takes a number and returns how many steps it takes to reach 1 following the Collatz Conjecture rules: if even, divide by 2; if odd, multiply by 3 and add 1.",
    hints: [
      "Use a loop that keeps running until the number reaches 1",
      "Check if a number is even using modulo: number % 2 == 0",
      "Keep a counter variable and increment it each step",
      "Return the counter when the number equals 1"
    ],
    requiredScenarios: ["number-1", "number-16", "number-12", "number-1000000"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "number-1",
    name: "Number 1",
    description: "Zero steps for one.",
    taskId: "calculate-collatz-steps",
    functionName: "collatz_steps",
    args: [1],
    expected: 0
  },
  {
    slug: "number-16",
    name: "Number 16",
    description: "Divide if even.",
    taskId: "calculate-collatz-steps",
    functionName: "collatz_steps",
    args: [16],
    expected: 4
  },
  {
    slug: "number-12",
    name: "Number 12",
    description: "Even and odd steps.",
    taskId: "calculate-collatz-steps",
    functionName: "collatz_steps",
    args: [12],
    expected: 9
  },
  {
    slug: "number-1000000",
    name: "Number 1000000",
    description: "Large number of even and odd steps.",
    taskId: "calculate-collatz-steps",
    functionName: "collatz_steps",
    args: [1000000],
    expected: 152
  }
];
