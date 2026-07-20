import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "basic-word-counting" as const,
    name: "tasks.basicWordCounting.name",
    description: "tasks.basicWordCounting.description",
    hints: [],
    requiredScenarios: [
      "word-count-single-word",
      "word-count-multiple-unique-words",
      "word-count-multiple-occurrences",
      "word-count-cramped-list",
      "word-count-ignore-punctuation",
      "word-count-include-numbers"
    ],
    bonus: false
  },
  {
    id: "case-normalization" as const,
    name: "tasks.caseNormalization.name",
    description: "tasks.caseNormalization.description",
    hints: [],
    requiredScenarios: ["word-count-normalize-case", "word-count-with-apostrophes", "word-count-multiple-spaces"],
    bonus: false
  },
  {
    id: "bonus-apostrophes" as const,
    name: "tasks.bonusApostrophes.name",
    description: "tasks.bonusApostrophes.description",
    hints: [],
    requiredScenarios: ["word-count-with-apostrophes-and-quotations", "word-count-apostrophe-word-variation"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  // Task 1: Basic cases
  {
    slug: "word-count-single-word",
    name: "scenarios.wordCountSingleWord.name",
    description: "scenarios.wordCountSingleWord.description",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["word"],
    expected: { word: 1 }
  },
  {
    slug: "word-count-multiple-unique-words",
    name: "scenarios.wordCountMultipleUniqueWords.name",
    description: "scenarios.wordCountMultipleUniqueWords.description",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["one of each"],
    expected: { one: 1, of: 1, each: 1 }
  },
  {
    slug: "word-count-multiple-occurrences",
    name: "scenarios.wordCountMultipleOccurrences.name",
    description: "scenarios.wordCountMultipleOccurrences.description",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["one fish two fish red fish blue fish"],
    expected: { one: 1, fish: 4, two: 1, red: 1, blue: 1 }
  },
  {
    slug: "word-count-cramped-list",
    name: "scenarios.wordCountCrampedList.name",
    description: "scenarios.wordCountCrampedList.description",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["one,two,three"],
    expected: { one: 1, two: 1, three: 1 }
  },
  {
    slug: "word-count-ignore-punctuation",
    name: "scenarios.wordCountIgnorePunctuation.name",
    description: "scenarios.wordCountIgnorePunctuation.description",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["car: carpet as java: javascript!!&@$%^&"],
    expected: { car: 1, carpet: 1, as: 1, java: 1, javascript: 1 }
  },
  {
    slug: "word-count-include-numbers",
    name: "scenarios.wordCountIncludeNumbers.name",
    description: "scenarios.wordCountIncludeNumbers.description",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["testing, 1, 2 testing"],
    expected: { testing: 2, "1": 1, "2": 1 }
  },

  // Task 2: Case normalization
  {
    slug: "word-count-normalize-case",
    name: "scenarios.wordCountNormalizeCase.name",
    description: "scenarios.wordCountNormalizeCase.description",
    taskId: "case-normalization",
    functionName: "count_words",
    args: ["go Go GO Stop stop"],
    expected: { go: 3, stop: 2 }
  },
  {
    slug: "word-count-with-apostrophes",
    name: "scenarios.wordCountWithApostrophes.name",
    description: "scenarios.wordCountWithApostrophes.description",
    taskId: "case-normalization",
    functionName: "count_words",
    args: ["First: don't laugh. Then: don't cry."],
    expected: { first: 1, "don't": 2, laugh: 1, then: 1, cry: 1 }
  },
  {
    slug: "word-count-multiple-spaces",
    name: "scenarios.wordCountMultipleSpaces.name",
    description: "scenarios.wordCountMultipleSpaces.description",
    taskId: "case-normalization",
    functionName: "count_words",
    args: [" multiple   whitespaces"],
    expected: { multiple: 1, whitespaces: 1 }
  },

  // Task 3: Bonus
  {
    slug: "word-count-with-apostrophes-and-quotations",
    name: "scenarios.wordCountWithApostrophesAndQuotations.name",
    description: "scenarios.wordCountWithApostrophesAndQuotations.description",
    taskId: "bonus-apostrophes",
    functionName: "count_words",
    args: ["Joe can't tell between 'large' and large."],
    expected: { joe: 1, "can't": 1, tell: 1, between: 1, large: 2, and: 1 }
  },
  {
    slug: "word-count-apostrophe-word-variation",
    name: "scenarios.wordCountApostropheWordVariation.name",
    description: "scenarios.wordCountApostropheWordVariation.description",
    taskId: "bonus-apostrophes",
    functionName: "count_words",
    args: ["can, can't, 'can't'"],
    expected: { can: 1, "can't": 2 }
  }
];
