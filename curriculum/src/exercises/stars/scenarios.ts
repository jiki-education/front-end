import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-stars-function" as const,
    name: "tasks.createStarsFunction.name",
    description: "tasks.createStarsFunction.description",
    hints: [],
    requiredScenarios: ["count-0", "count-1", "count-3", "count-5"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "count-0",
    name: "scenarios.count0.name",
    description: "scenarios.count0.description",
    taskId: "create-stars-function",
    functionName: "stars",
    args: [0],
    expected: []
  },
  {
    slug: "count-1",
    name: "scenarios.count1.name",
    description: "scenarios.count1.description",
    taskId: "create-stars-function",
    functionName: "stars",
    args: [1],
    expected: ["*"]
  },
  {
    slug: "count-3",
    name: "scenarios.count3.name",
    description: "scenarios.count3.description",
    taskId: "create-stars-function",
    functionName: "stars",
    args: [3],
    expected: ["*", "**", "***"]
  },
  {
    slug: "count-5",
    name: "scenarios.count5.name",
    description: "scenarios.count5.description",
    taskId: "create-stars-function",
    functionName: "stars",
    args: [5],
    expected: ["*", "**", "***", "****", "*****"]
  }
];
