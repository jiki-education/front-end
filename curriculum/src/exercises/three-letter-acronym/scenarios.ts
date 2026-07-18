import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-acronym-function" as const,
    name: "tasks.createAcronymFunction.name",
    description: "tasks.createAcronymFunction.description",
    hints: [],
    requiredScenarios: ["png", "css", "www", "lol"],
    bonus: false
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
  }
];
