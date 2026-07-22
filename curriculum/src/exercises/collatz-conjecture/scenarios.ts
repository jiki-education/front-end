import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "calculate-collatz-steps" as const,
    name: "tasks.calculateCollatzSteps.name",
    description: "tasks.calculateCollatzSteps.description",
    hints: [],
    requiredScenarios: ["number-1", "number-16", "number-12", "number-1000000"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "number-1",
    name: "scenarios.number1.name",
    description: "scenarios.number1.description",
    taskId: "calculate-collatz-steps",
    functionName: "collatz_steps",
    args: [1],
    expected: 0
  },
  {
    slug: "number-16",
    name: "scenarios.number16.name",
    description: "scenarios.number16.description",
    taskId: "calculate-collatz-steps",
    functionName: "collatz_steps",
    args: [16],
    expected: 4
  },
  {
    slug: "number-12",
    name: "scenarios.number12.name",
    description: "scenarios.number12.description",
    taskId: "calculate-collatz-steps",
    functionName: "collatz_steps",
    args: [12],
    expected: 9
  },
  {
    slug: "number-1000000",
    name: "scenarios.number1000000.name",
    description: "scenarios.number1000000.description",
    taskId: "calculate-collatz-steps",
    functionName: "collatz_steps",
    args: [1000000],
    expected: 152
  }
];
