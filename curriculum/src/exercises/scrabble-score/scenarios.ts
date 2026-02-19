import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-letter-values-function" as const,
    name: "Create the letterValues function",
    description:
      "Write a letterValues function that returns a dictionary mapping each uppercase letter to its Scrabble point value. Start with the provided list of letter groups and their values, and convert it into a dictionary.",
    hints: [
      "Loop through each pair in the values list",
      "For each pair, loop through each letter in the string",
      "Set each letter as a key in the dictionary with its point value"
    ],
    requiredScenarios: ["letter-values"],
    bonus: false
  },
  {
    id: "single-letters" as const,
    name: "Score single letters",
    description:
      "Write a scrabbleScore function that takes a word and returns its total Scrabble score. Start by getting it working for single letters.",
    hints: [
      "Use letterValues() to get the scores dictionary",
      "Convert each letter to uppercase before looking it up",
      "Sum the values for each letter in the word"
    ],
    requiredScenarios: ["scrabble-lowercase-letter", "scrabble-uppercase-letter", "scrabble-valuable-letter"],
    bonus: false
  },
  {
    id: "words" as const,
    name: "Score words",
    description: "Now get scrabbleScore working with full words of different lengths.",
    hints: ["Iterate through each letter of the word", "Look up each letter's value and add it to a running total"],
    requiredScenarios: [
      "scrabble-short-word",
      "scrabble-short-valuable-word",
      "scrabble-medium-word",
      "scrabble-medium-valuable-word",
      "scrabble-long-mixed-case-word",
      "scrabble-english-like-word"
    ],
    bonus: false
  },
  {
    id: "edge-cases" as const,
    name: "Handle edge cases",
    description: "Finally, make sure your function handles edge cases like empty strings and the full alphabet.",
    hints: [
      "An empty string should return a score of 0",
      "Your loop should naturally handle this if score starts at 0"
    ],
    requiredScenarios: ["scrabble-empty-input", "scrabble-entire-alphabet"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "letter-values",
    name: "The letterValues function",
    description: "The letterValues function should return a complete dictionary of letter scores.",
    taskId: "create-letter-values-function",
    functionName: "letter_values",
    args: [],
    expected: {
      A: 1,
      E: 1,
      I: 1,
      O: 1,
      U: 1,
      L: 1,
      N: 1,
      R: 1,
      S: 1,
      T: 1,
      D: 2,
      G: 2,
      B: 3,
      C: 3,
      M: 3,
      P: 3,
      F: 4,
      H: 4,
      V: 4,
      W: 4,
      Y: 4,
      K: 5,
      J: 8,
      X: 8,
      Q: 10,
      Z: 10
    }
  },
  {
    slug: "scrabble-lowercase-letter",
    name: "Lowercase letter",
    description: "Calculate the score for a single lowercase letter.",
    taskId: "single-letters",
    functionName: "scrabble_score",
    args: ["a"],
    expected: 1
  },
  {
    slug: "scrabble-uppercase-letter",
    name: "Uppercase letter",
    description: "Calculate the score for a single uppercase letter.",
    taskId: "single-letters",
    functionName: "scrabble_score",
    args: ["A"],
    expected: 1
  },
  {
    slug: "scrabble-valuable-letter",
    name: "Valuable letter",
    description: "Calculate the score for a valuable letter.",
    taskId: "single-letters",
    functionName: "scrabble_score",
    args: ["f"],
    expected: 4
  },
  {
    slug: "scrabble-short-word",
    name: "Short word",
    description: "Calculate the score for a short word.",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["at"],
    expected: 2
  },
  {
    slug: "scrabble-short-valuable-word",
    name: "Short, valuable word",
    description: "Calculate the score for a short word with valuable letters.",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["zoo"],
    expected: 12
  },
  {
    slug: "scrabble-medium-word",
    name: "Medium word",
    description: "Calculate the score for a medium-length word.",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["street"],
    expected: 6
  },
  {
    slug: "scrabble-medium-valuable-word",
    name: "Medium, valuable word",
    description: "Calculate the score for a medium-length word with valuable letters.",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["quirky"],
    expected: 22
  },
  {
    slug: "scrabble-long-mixed-case-word",
    name: "Long, mixed-case word",
    description: "Calculate the score for a long word with mixed case letters.",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["OxyphenButazone"],
    expected: 41
  },
  {
    slug: "scrabble-english-like-word",
    name: "English-like word",
    description: "Calculate the score for an English-like word.",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["pinata"],
    expected: 8
  },
  {
    slug: "scrabble-empty-input",
    name: "Empty input",
    description: "Calculate the score for an empty string.",
    taskId: "edge-cases",
    functionName: "scrabble_score",
    args: [""],
    expected: 0
  },
  {
    slug: "scrabble-entire-alphabet",
    name: "Entire alphabet",
    description: "Calculate the score for a string with every letter of the alphabet.",
    taskId: "edge-cases",
    functionName: "scrabble_score",
    args: ["abcdefghijklmnopqrstuvwxyz"],
    expected: 87
  }
];
