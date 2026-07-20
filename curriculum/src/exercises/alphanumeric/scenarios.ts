import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "classify-string" as const,
    name: "tasks.classifyString.name",
    description: "tasks.classifyString.description",
    hints: [],
    requiredScenarios: ["duck", "number", "alphanumeric", "not-alphanumeric-1", "not-alphanumeric-2"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "duck",
    name: "scenarios.duck.name",
    description: "scenarios.duck.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["Duck"],
    expected: "Alpha"
  },
  {
    slug: "number",
    name: "scenarios.number.name",
    description: "scenarios.number.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["42"],
    expected: "Numeric"
  },
  {
    slug: "alphanumeric",
    name: "scenarios.alphanumeric.name",
    description: "scenarios.alphanumeric.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["Duck42"],
    expected: "Alphanumeric"
  },
  {
    slug: "not-alphanumeric-1",
    name: "scenarios.notAlphanumeric1.name",
    description: "scenarios.notAlphanumeric1.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["It's not 42!"],
    expected: "Unknown"
  },
  {
    slug: "not-alphanumeric-2",
    name: "scenarios.notAlphanumeric2.name",
    description: "scenarios.notAlphanumeric2.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["42 Rubber Duck!"],
    expected: "Unknown"
  }
];
