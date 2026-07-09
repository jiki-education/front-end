import type { Task, IOScenario, CodeCheck } from "../types";

const sixLinesCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 4 : 6;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorHtml: "Your solution has too many lines of code. Can you make it shorter?"
  }
];

export const tasks = [
  {
    id: "identify-even-or-odd" as const,
    name: "Identify even and odd numbers",
    description:
      'Write a function called evenOrOdd that takes a number and returns "Even" if it\'s divisible by 2, or "Odd" otherwise. Zero is even.',
    hints: [],
    requiredScenarios: ["number-14", "number-28", "number--1", "number-17", "number-0"],
    bonus: false
  },
  {
    id: "solve-in-six-lines" as const,
    name: "Solve in 6 lines of code",
    description: "Can you solve this exercise with only 6 lines of code?",
    hints: [],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "number-14",
    name: "Number 14",
    description: "14 is an even number.",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [14],
    expected: "Even"
  },
  {
    slug: "number-28",
    name: "Number 28",
    description: "28 is an even number.",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [28],
    expected: "Even"
  },
  {
    slug: "number--1",
    name: "Number -1",
    description: "-1 is an odd number.",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [-1],
    expected: "Odd"
  },
  {
    slug: "number-17",
    name: "Number 17",
    description: "17 is an odd number.",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [17],
    expected: "Odd"
  },
  {
    slug: "number-0",
    name: "Number 0",
    description: "Zero counts as even.",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [0],
    expected: "Even"
  },
  {
    slug: "bonus-1",
    name: "6 lines of code",
    description: "Solve the exercise with only 6 lines of code.",
    taskId: "solve-in-six-lines",
    functionName: "even_or_odd",
    args: [0],
    expected: "Even",
    codeChecks: sixLinesCheck
  }
];
