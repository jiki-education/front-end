import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-two-fer-function" as const,
    name: "tasks.createTwoFerFunction.name",
    description: "tasks.createTwoFerFunction.description",
    hints: [],
    requiredScenarios: ["two-fer-default", "two-fer-alice", "two-fer-tom"],
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
    slug: "two-fer-default",
    name: "scenarios.twoFerDefault.name",
    description: "scenarios.twoFerDefault.description",
    taskId: "create-two-fer-function",
    functionName: "two_fer",
    args: [""],
    expected: "One for you, one for me."
  },
  {
    slug: "two-fer-alice",
    name: "scenarios.twoFerAlice.name",
    description: "scenarios.twoFerAlice.description",
    taskId: "create-two-fer-function",
    functionName: "two_fer",
    args: ["Alice"],
    expected: "One for Alice, one for me."
  },
  {
    slug: "two-fer-tom",
    name: "scenarios.twoFerTom.name",
    description: "scenarios.twoFerTom.description",
    taskId: "create-two-fer-function",
    functionName: "two_fer",
    args: ["Tom"],
    expected: "One for Tom, one for me."
  },
  {
    slug: "bonus-1",
    name: "scenarios.bonus1.name",
    description: "scenarios.bonus1.description",
    taskId: "solve-in-six-lines",
    functionName: "two_fer",
    args: ["Alice"],
    expected: "One for Alice, one for me.",
    codeChecks: [
      {
        pass: (result) => result.assertors.assertMaxLinesOfCode(6),
        errorKey: "checks.moreThanSixLines"
      }
    ]
  }
];
