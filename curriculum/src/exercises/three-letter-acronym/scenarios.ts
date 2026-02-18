import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-acronym-function" as const,
    name: "Create acronym function",
    description:
      "Write an acronym function that takes three words and returns a three-letter acronym formed by taking the first letter of each word.",
    hints: [
      "Use [1] to get the first character of each word",
      "Use concatenate() to join the three characters together"
    ],
    requiredScenarios: ["png", "css", "www", "lol"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "png",
    name: "Portable Network Graphics",
    description: "Create the acronym 'PNG' from 'Portable', 'Network', 'Graphics'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable", "Network", "Graphics"],
    expected: "PNG"
  },
  {
    slug: "css",
    name: "Cascading Style Sheets",
    description: "Create the acronym 'CSS' from 'Cascading', 'Style', 'Sheets'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Cascading", "Style", "Sheets"],
    expected: "CSS"
  },
  {
    slug: "www",
    name: "World Wide Web",
    description: "Create the acronym 'WWW' from 'World', 'Wide', 'Web'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["World", "Wide", "Web"],
    expected: "WWW"
  },
  {
    slug: "lol",
    name: "Lowercase words",
    description: "Create the acronym 'lol' from 'laugh', 'out', 'loud'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["laugh", "out", "loud"],
    expected: "lol"
  }
];
