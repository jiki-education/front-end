import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "identify-even-or-odd" as const,
    name: "Identify even and odd numbers",
    description:
      "Write a function called even_or_odd that takes a number and returns \"Even\" if it's divisible by 2, or \"Odd\" otherwise. Zero is even.",
    hints: [
      "Use the remainder operator (%) to check if a number is divisible by 2",
      "If number % 2 equals 0, the number is even",
      "Otherwise, the number is odd"
    ],
    requiredScenarios: ["number-14", "number-28", "number--1", "number-17", "number-0"],
    bonus: false
  },
  {
    id: "solve-in-six-lines" as const,
    name: "Solve in 6 lines of code",
    description: "Can you solve this exercise with only 6 lines of code?",
    hints: ["You don't need an else statement if you return early"],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "number-14",
    name: "Number 14",
    description: "14 is even because 14 % 2 equals 0",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [14],
    expected: "Even"
  },
  {
    slug: "number-28",
    name: "Number 28",
    description: "28 is even because 28 % 2 equals 0",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [28],
    expected: "Even"
  },
  {
    slug: "number--1",
    name: "Number -1",
    description: "-1 is odd because -1 % 2 does not equal 0",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [-1],
    expected: "Odd"
  },
  {
    slug: "number-17",
    name: "Number 17",
    description: "17 is odd because 17 % 2 does not equal 0",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [17],
    expected: "Odd"
  },
  {
    slug: "number-0",
    name: "Number 0",
    description: "0 is even because 0 % 2 equals 0",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [0],
    expected: "Even"
  },
  {
    slug: "bonus-1",
    name: "6 lines of code",
    description: "Solve the exercise with only 6 lines of code",
    taskId: "solve-in-six-lines",
    functionName: "even_or_odd",
    args: [0],
    expected: "Even"
  }
];
