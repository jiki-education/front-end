import type { Task, IOScenario, CodeCheck } from "../types";

const threeLinesCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 2 : 3;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "create-acronym-function" as const,
    name: "tasks.createAcronymFunction.name",
    description: "tasks.createAcronymFunction.description",
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
    name: "scenarios.png.name",
    description: "scenarios.png.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable", "Network", "Graphics"],
    expected: "PNG"
  },
  {
    slug: "css",
    name: "scenarios.css.name",
    description: "scenarios.css.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Cascading", "Style", "Sheets"],
    expected: "CSS"
  },
  {
    slug: "www",
    name: "scenarios.www.name",
    description: "scenarios.www.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["World", "Wide", "Web"],
    expected: "WWW"
  },
  {
    slug: "lol",
    name: "scenarios.lol.name",
    description: "scenarios.lol.description",
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
