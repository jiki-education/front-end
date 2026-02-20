import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "classify-string" as const,
    name: "Classify a string",
    description:
      "Write helper functions to check if a string is alpha, numeric, or alphanumeric, then use them to classify the input string.",
    hints: [
      "Write a contains() function that checks if a character appears in a given string",
      "Use contains() to write isAlpha() and isNumeric() — iterate through each character and return false if any character is not found in the allowed set",
      "For isAlphanumeric(), use isAlpha() and isNumeric() on each character — if neither matches, return false",
      "In whatAmI(), check isAlpha first, then isNumeric, then isAlphanumeric, and return \"Unknown\" as the default"
    ],
    requiredScenarios: ["duck", "number", "alphanumeric", "not-alphanumeric-1", "not-alphanumeric-2"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "duck",
    name: "Duck",
    description: "A purely alphabetic string should be classified as \"Alpha\"",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["Duck"],
    expected: "Alpha"
  },
  {
    slug: "number",
    name: "42",
    description: "A purely numeric string should be classified as \"Numeric\"",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["42"],
    expected: "Numeric"
  },
  {
    slug: "alphanumeric",
    name: "Duck42",
    description: "A string with both letters and numbers should be classified as \"Alphanumeric\"",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["Duck42"],
    expected: "Alphanumeric"
  },
  {
    slug: "not-alphanumeric-1",
    name: "It's not 42!",
    description: "A string with special characters should be classified as \"Unknown\"",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["It's not 42!"],
    expected: "Unknown"
  },
  {
    slug: "not-alphanumeric-2",
    name: "42 Rubber Duck!",
    description: "A string with spaces and special characters should be classified as \"Unknown\"",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["42 Rubber Duck!"],
    expected: "Unknown"
  }
];
