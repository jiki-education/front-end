import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "calculate-sign-price" as const,
    name: "tasks.calculateSignPrice.name",
    description: "tasks.calculateSignPrice.description",
    hints: [],
    requiredScenarios: ["simple-word", "single-letter", "two-words", "multiple-spaces", "long-text", "all-spaces"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "simple-word",
    name: "scenarios.simpleWord.name",
    description: "scenarios.simpleWord.description",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["Hello"],
    expected: "That will cost $60"
  },
  {
    slug: "single-letter",
    name: "scenarios.singleLetter.name",
    description: "scenarios.singleLetter.description",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["A"],
    expected: "That will cost $12"
  },
  {
    slug: "two-words",
    name: "scenarios.twoWords.name",
    description: "scenarios.twoWords.description",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["Hi There"],
    expected: "That will cost $84"
  },
  {
    slug: "multiple-spaces",
    name: "scenarios.multipleSpaces.name",
    description: "scenarios.multipleSpaces.description",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["Sale Now On"],
    expected: "That will cost $108"
  },
  {
    slug: "long-text",
    name: "scenarios.longText.name",
    description: "scenarios.longText.description",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["Open All Hours"],
    expected: "That will cost $144"
  },
  {
    slug: "all-spaces",
    name: "scenarios.allSpaces.name",
    description: "scenarios.allSpaces.description",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["   "],
    expected: "That will cost $0"
  }
];
