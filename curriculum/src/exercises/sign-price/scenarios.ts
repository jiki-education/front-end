import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "calculate-sign-price" as const,
    name: "Calculate Sign Price",
    description:
      "Write a function that calculates the price of a sign. Each letter costs $12. Spaces are free and should not be counted. Return the result as a formatted string.",
    hints: [
      "Start by creating a variable to count the number of letters",
      "Loop through each character and only count it if it is not a space",
      "Multiply the letter count by 12 to get the price",
      "Use concatenate and numberToString to build the result string"
    ],
    requiredScenarios: ["simple-word", "single-letter", "two-words", "multiple-spaces", "long-text", "all-spaces"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "simple-word",
    name: "Simple word",
    description: "A single word with no spaces",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["Hello"],
    expected: "That will cost $60"
  },
  {
    slug: "single-letter",
    name: "Single letter",
    description: "A sign with just one letter",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["A"],
    expected: "That will cost $12"
  },
  {
    slug: "two-words",
    name: "Two words",
    description: "Two words with a space that should be skipped",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["Hi There"],
    expected: "That will cost $84"
  },
  {
    slug: "multiple-spaces",
    name: "Multiple spaces",
    description: "Multiple words with several spaces to skip",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["Sale Now On"],
    expected: "That will cost $108"
  },
  {
    slug: "long-text",
    name: "Long text",
    description: "A longer sign with more letters",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["Open All Hours"],
    expected: "That will cost $144"
  },
  {
    slug: "all-spaces",
    name: "All spaces",
    description: "A sign with only spaces has no letters to charge for",
    taskId: "calculate-sign-price",
    functionName: "sign_price",
    args: ["   "],
    expected: "That will cost $0"
  }
];
