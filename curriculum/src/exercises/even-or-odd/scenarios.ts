import type { Task, IOScenario, CodeCheck } from "../types";

const sixLinesCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 4 : 6;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "identify-even-or-odd" as const,
    name: "tasks.identifyEvenOrOdd.name",
    description: "tasks.identifyEvenOrOdd.description",
    hints: [],
    requiredScenarios: ["number-14", "number-28", "number--1", "number-17", "number-0"],
    bonus: false
  },
  {
    id: "solve-in-six-lines" as const,
    name: "tasks.solveInSixLines.name",
    description: "tasks.solveInSixLines.description",
    hints: [],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "number-14",
    name: "scenarios.number14.name",
    description: "scenarios.number14.description",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [14],
    expected: "Even"
  },
  {
    slug: "number-28",
    name: "scenarios.number28.name",
    description: "scenarios.number28.description",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [28],
    expected: "Even"
  },
  {
    slug: "number--1",
    name: "scenarios.numberMinus1.name",
    description: "scenarios.numberMinus1.description",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [-1],
    expected: "Odd"
  },
  {
    slug: "number-17",
    name: "scenarios.number17.name",
    description: "scenarios.number17.description",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [17],
    expected: "Odd"
  },
  {
    slug: "number-0",
    name: "scenarios.number0.name",
    description: "scenarios.number0.description",
    taskId: "identify-even-or-odd",
    functionName: "even_or_odd",
    args: [0],
    expected: "Even"
  },
  {
    slug: "bonus-1",
    name: "scenarios.bonus1.name",
    description: "scenarios.bonus1.description",
    taskId: "solve-in-six-lines",
    functionName: "even_or_odd",
    args: [0],
    expected: "Even",
    codeChecks: sixLinesCheck
  }
];
