import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "calculate-scrabble-score" as const,
    name: "Calculate Scrabble score",
    description:
      "Write a scrabble_score function that takes a word and returns its total Scrabble score. You'll also need a letter_values function to build a dictionary of letter scores.",
    hints: [
      "Create a helper function to build the letter values dictionary",
      "Use a list of pairs: letter groups and their point values",
      "Convert letters to uppercase before looking them up",
      "Sum up the values for each letter in the word"
    ],
    requiredScenarios: [
      "scrabble-lowercase-letter",
      "scrabble-uppercase-letter",
      "scrabble-valuable-letter",
      "scrabble-short-word",
      "scrabble-short-valuable-word",
      "scrabble-medium-word",
      "scrabble-medium-valuable-word",
      "scrabble-long-mixed-case-word",
      "scrabble-english-like-word",
      "scrabble-empty-input",
      "scrabble-entire-alphabet"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "scrabble-lowercase-letter",
    name: "Lowercase letter",
    description: "Calculate the score for a single lowercase letter.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["a"],
    expected: 1
  },
  {
    slug: "scrabble-uppercase-letter",
    name: "Uppercase letter",
    description: "Calculate the score for a single uppercase letter.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["A"],
    expected: 1
  },
  {
    slug: "scrabble-valuable-letter",
    name: "Valuable letter",
    description: "Calculate the score for a valuable letter.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["f"],
    expected: 4
  },
  {
    slug: "scrabble-short-word",
    name: "Short word",
    description: "Calculate the score for a short word.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["at"],
    expected: 2
  },
  {
    slug: "scrabble-short-valuable-word",
    name: "Short, valuable word",
    description: "Calculate the score for a short word with valuable letters.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["zoo"],
    expected: 12
  },
  {
    slug: "scrabble-medium-word",
    name: "Medium word",
    description: "Calculate the score for a medium-length word.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["street"],
    expected: 6
  },
  {
    slug: "scrabble-medium-valuable-word",
    name: "Medium, valuable word",
    description: "Calculate the score for a medium-length word with valuable letters.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["quirky"],
    expected: 22
  },
  {
    slug: "scrabble-long-mixed-case-word",
    name: "Long, mixed-case word",
    description: "Calculate the score for a long word with mixed case letters.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["OxyphenButazone"],
    expected: 41
  },
  {
    slug: "scrabble-english-like-word",
    name: "English-like word",
    description: "Calculate the score for an English-like word.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["pinata"],
    expected: 8
  },
  {
    slug: "scrabble-empty-input",
    name: "Empty input",
    description: "Calculate the score for an empty string.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: [""],
    expected: 0
  },
  {
    slug: "scrabble-entire-alphabet",
    name: "Entire alphabet",
    description: "Calculate the score for a string with every letter of the alphabet.",
    taskId: "calculate-scrabble-score",
    functionName: "scrabble_score",
    args: ["abcdefghijklmnopqrstuvwxyz"],
    expected: 87
  }
];
