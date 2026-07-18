import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "fetch-and-format-time" as const,
    name: "tasks.fetchAndFormatTime.name",
    description: "tasks.fetchAndFormatTime.description",
    hints: [],
    requiredScenarios: ["amsterdam", "tokyo", "lima"],
    bonus: false
  },
  {
    id: "handle-errors" as const,
    name: "tasks.handleErrors.name",
    description: "tasks.handleErrors.description",
    hints: [],
    requiredScenarios: ["error"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "amsterdam",
    name: "scenarios.amsterdam.name",
    description: "scenarios.amsterdam.description",
    taskId: "fetch-and-format-time",
    functionName: "get_time",
    args: ["Amsterdam"],
    expected: "The time on this Monday in Amsterdam is 00:28"
  },
  {
    slug: "tokyo",
    name: "scenarios.tokyo.name",
    description: "scenarios.tokyo.description",
    taskId: "fetch-and-format-time",
    functionName: "get_time",
    args: ["Tokyo"],
    expected: "The time on this Monday in Tokyo is 08:39"
  },
  {
    slug: "lima",
    name: "scenarios.lima.name",
    description: "scenarios.lima.description",
    taskId: "fetch-and-format-time",
    functionName: "get_time",
    args: ["Lima"],
    expected: "The time on this Sunday in Lima is 18:39"
  },
  {
    slug: "error",
    name: "scenarios.error.name",
    description: "scenarios.error.description",
    taskId: "handle-errors",
    functionName: "get_time",
    args: ["London"],
    expected: "Could not determine the time."
  }
];
