import type { Task, IOScenario, CodeCheck } from "../types";

const threeLinesCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 2 : 3;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorHtml: "Your solution has too many lines of code. Can you make it shorter?"
  }
];

export const tasks = [
  {
    id: "create-acronym-function" as const,
    name: "Create acronym function",
    description:
      "Write an acronym function that takes three words and returns a three-letter acronym formed by taking the first letter of each word.",
    hints: [],
    requiredScenarios: ["png", "css", "www", "lol"],
    bonus: false
  },
  {
    id: "solve-in-three-lines" as const,
    name: "Solve in 3 lines of code",
    description: "Can you solve this exercise with only 3 lines of code?",
    hints: [],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "png",
    name: "Portable Network Graphics",
    description: "Create the acronym 'PNG' from 'Portable', 'Network', 'Graphics'.",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable", "Network", "Graphics"],
    expected: "PNG"
  },
  {
    slug: "css",
    name: "Cascading Style Sheets",
    description: "Create the acronym 'CSS' from 'Cascading', 'Style', 'Sheets'.",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Cascading", "Style", "Sheets"],
    expected: "CSS"
  },
  {
    slug: "www",
    name: "World Wide Web",
    description: "Create the acronym 'WWW' from 'World', 'Wide', 'Web'.",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["World", "Wide", "Web"],
    expected: "WWW"
  },
  {
    slug: "lol",
    name: "Lowercase words",
    description: "Create the acronym 'lol' from 'laugh', 'out', 'loud'.",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["laugh", "out", "loud"],
    expected: "lol"
  },
  {
    slug: "bonus-1",
    name: "3 lines of code",
    description: "Solve the exercise with only 3 lines of code.",
    taskId: "solve-in-three-lines",
    functionName: "acronym",
    args: ["Portable", "Network", "Graphics"],
    expected: "PNG",
    codeChecks: threeLinesCheck
  }
];
