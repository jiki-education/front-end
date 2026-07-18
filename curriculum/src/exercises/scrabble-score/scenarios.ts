import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-letter-values-function" as const,
    name: "tasks.createLetterValuesFunction.name",
    description: "tasks.createLetterValuesFunction.description",
    hints: [],
    requiredScenarios: ["letter-values"],
    bonus: false
  },
  {
    id: "single-letters" as const,
    name: "tasks.singleLetters.name",
    description: "tasks.singleLetters.description",
    hints: [],
    requiredScenarios: ["scrabble-lowercase-letter", "scrabble-uppercase-letter", "scrabble-valuable-letter"],
    bonus: false
  },
  {
    id: "words" as const,
    name: "tasks.words.name",
    description: "tasks.words.description",
    hints: [],
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
    name: "tasks.edgeCases.name",
    description: "tasks.edgeCases.description",
    hints: [],
    requiredScenarios: ["scrabble-empty-input", "scrabble-entire-alphabet"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "letter-values",
    name: "scenarios.letterValues.name",
    description: "scenarios.letterValues.description",
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
    name: "scenarios.scrabbleLowercaseLetter.name",
    description: "scenarios.scrabbleLowercaseLetter.description",
    taskId: "single-letters",
    functionName: "scrabble_score",
    args: ["a"],
    expected: 1
  },
  {
    slug: "scrabble-uppercase-letter",
    name: "scenarios.scrabbleUppercaseLetter.name",
    description: "scenarios.scrabbleUppercaseLetter.description",
    taskId: "single-letters",
    functionName: "scrabble_score",
    args: ["A"],
    expected: 1
  },
  {
    slug: "scrabble-valuable-letter",
    name: "scenarios.scrabbleValuableLetter.name",
    description: "scenarios.scrabbleValuableLetter.description",
    taskId: "single-letters",
    functionName: "scrabble_score",
    args: ["f"],
    expected: 4
  },
  {
    slug: "scrabble-short-word",
    name: "scenarios.scrabbleShortWord.name",
    description: "scenarios.scrabbleShortWord.description",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["at"],
    expected: 2
  },
  {
    slug: "scrabble-short-valuable-word",
    name: "scenarios.scrabbleShortValuableWord.name",
    description: "scenarios.scrabbleShortValuableWord.description",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["zoo"],
    expected: 12
  },
  {
    slug: "scrabble-medium-word",
    name: "scenarios.scrabbleMediumWord.name",
    description: "scenarios.scrabbleMediumWord.description",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["street"],
    expected: 6
  },
  {
    slug: "scrabble-medium-valuable-word",
    name: "scenarios.scrabbleMediumValuableWord.name",
    description: "scenarios.scrabbleMediumValuableWord.description",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["quirky"],
    expected: 22
  },
  {
    slug: "scrabble-long-mixed-case-word",
    name: "scenarios.scrabbleLongMixedCaseWord.name",
    description: "scenarios.scrabbleLongMixedCaseWord.description",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["OxyphenButazone"],
    expected: 41
  },
  {
    slug: "scrabble-english-like-word",
    name: "scenarios.scrabbleEnglishLikeWord.name",
    description: "scenarios.scrabbleEnglishLikeWord.description",
    taskId: "words",
    functionName: "scrabble_score",
    args: ["pinata"],
    expected: 8
  },
  {
    slug: "scrabble-empty-input",
    name: "scenarios.scrabbleEmptyInput.name",
    description: "scenarios.scrabbleEmptyInput.description",
    taskId: "edge-cases",
    functionName: "scrabble_score",
    args: [""],
    expected: 0
  },
  {
    slug: "scrabble-entire-alphabet",
    name: "scenarios.scrabbleEntireAlphabet.name",
    description: "scenarios.scrabbleEntireAlphabet.description",
    taskId: "edge-cases",
    functionName: "scrabble_score",
    args: ["abcdefghijklmnopqrstuvwxyz"],
    expected: 87
  }
];
