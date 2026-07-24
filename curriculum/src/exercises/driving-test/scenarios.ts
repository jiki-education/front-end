import type { Task, IOScenario, CodeCheck } from "../types";

const elevenLinesCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 8 : 11;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "did-they-pass" as const,
    name: "tasks.didTheyPass.name",
    description: "tasks.didTheyPass.description",
    hints: [],
    requiredScenarios: ["perfect-marks", "dangerous", "one-big-mistake", "scraped-through", "one-mistake-too-many"],
    bonus: false
  },
  {
    id: "solve-in-eleven-lines" as const,
    name: "tasks.solveInElevenLines.name",
    description: "tasks.solveInElevenLines.description",
    hints: [],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "perfect-marks",
    name: "scenarios.perfectMarks.name",
    description: "scenarios.perfectMarks.description",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅"],
    expected: true
  },
  {
    slug: "dangerous",
    name: "scenarios.dangerous.name",
    description: "scenarios.dangerous.description",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅💥💥✅✅✅💥💥✅✅✅❌✅❌✅✅❌❌✅"],
    expected: false
  },
  {
    slug: "one-big-mistake",
    name: "scenarios.oneBigMistake.name",
    description: "scenarios.oneBigMistake.description",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅✅✅✅✅✅✅✅💥✅✅✅✅✅✅✅✅✅✅"],
    expected: false
  },
  {
    slug: "scraped-through",
    name: "scenarios.scrapedThrough.name",
    description: "scenarios.scrapedThrough.description",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅✅❌✅✅✅❌✅✅✅❌✅✅✅✅✅❌✅✅"],
    expected: true
  },
  {
    slug: "one-mistake-too-many",
    name: "scenarios.oneMistakeTooMany.name",
    description: "scenarios.oneMistakeTooMany.description",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅✅❌✅✅✅❌✅✅✅❌✅✅✅✅✅❌❌✅"],
    expected: false
  },
  {
    slug: "bonus-1",
    name: "scenarios.bonus1.name",
    description: "scenarios.bonus1.description",
    taskId: "solve-in-eleven-lines",
    functionName: "did_they_pass",
    args: ["✅✅✅❌✅✅✅❌✅✅✅❌✅✅✅✅✅❌✅✅"],
    expected: true,
    codeChecks: elevenLinesCheck
  }
];
