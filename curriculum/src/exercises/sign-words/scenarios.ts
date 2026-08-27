import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "sign-words" as const,
    name: "tasks.signWords.name",
    description: "tasks.signWords.description",
    hints: [],
    requiredScenarios: ["single-word", "two-words", "longer-name", "double-space"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "single-word",
    name: "scenarios.singleWord.name",
    description: "scenarios.singleWord.description",
    taskId: "sign-words",
    functionName: "sign_words",
    args: ["Burgers"],
    expected: ["Burgers"]
  },
  {
    slug: "two-words",
    name: "scenarios.twoWords.name",
    description: "scenarios.twoWords.description",
    taskId: "sign-words",
    functionName: "sign_words",
    args: ["Frank's Hotdogs"],
    expected: ["Frank's", "Hotdogs"]
  },
  {
    slug: "longer-name",
    name: "scenarios.longerName.name",
    description: "scenarios.longerName.description",
    taskId: "sign-words",
    functionName: "sign_words",
    args: ["Best Coffee In Town"],
    expected: ["Best", "Coffee", "In", "Town"]
  },
  {
    slug: "double-space",
    name: "scenarios.doubleSpace.name",
    description: "scenarios.doubleSpace.description",
    taskId: "sign-words",
    functionName: "sign_words",
    args: ["Fresh  Bread"],
    expected: ["Fresh", "Bread"]
  }
];
