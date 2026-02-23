import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-stars-function" as const,
    name: "Create stars function",
    description:
      'Write a stars function that takes a count and returns a list of strings, where each string has an increasing number of stars. For example, stars(3) returns ["*", "**", "***"].',
    hints: [
      "Start with an empty list and an empty string for building stars",
      "Use a repeat loop to iterate the right number of times",
      "Each iteration, concatenate a star onto your string, then push it to the list",
      "Use concatenate() and push() from the standard library"
    ],
    requiredScenarios: ["count-0", "count-1", "count-3", "count-5"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "count-0",
    name: "Count is 0",
    description: "Zero stars returns an empty list.",
    taskId: "create-stars-function",
    functionName: "stars",
    args: [0],
    expected: []
  },
  {
    slug: "count-1",
    name: "Count is 1",
    description: "One star returns a list with a single star string.",
    taskId: "create-stars-function",
    functionName: "stars",
    args: [1],
    expected: ["*"]
  },
  {
    slug: "count-3",
    name: "Count is 3",
    description: "Three stars returns three strings with increasing stars.",
    taskId: "create-stars-function",
    functionName: "stars",
    args: [3],
    expected: ["*", "**", "***"]
  },
  {
    slug: "count-5",
    name: "Count is 5",
    description: "Five stars returns five strings with increasing stars.",
    taskId: "create-stars-function",
    functionName: "stars",
    args: [5],
    expected: ["*", "**", "***", "****", "*****"]
  }
];
