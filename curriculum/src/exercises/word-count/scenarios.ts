import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "basic-word-counting" as const,
    name: "Basic cases",
    description:
      "Write a count_words function that takes a sentence and returns a dictionary with each word as a key and its frequency as the value. Handle spaces, commas, punctuation, and numbers.",
    hints: [
      "Convert the sentence to lowercase first",
      "Iterate through each character to extract words",
      "Letters, numbers, and apostrophes are part of words - everything else separates words",
      "Use a dictionary to track how many times each word appears"
    ],
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
    name: "Case normalization",
    description:
      "Ensure your function handles mixed case words correctly, treats apostrophes as part of words, and handles multiple spaces.",
    hints: [
      "Converting to lowercase at the start handles case normalization",
      "Apostrophes should be kept as part of contractions like don't",
      "Multiple spaces between words should not create empty words"
    ],
    requiredScenarios: ["word-count-normalize-case", "word-count-with-apostrophes", "word-count-multiple-spaces"],
    bonus: false
  },
  {
    id: "bonus-apostrophes" as const,
    name: "Bonus: Apostrophes and quotations",
    description:
      "Handle edge cases where apostrophes are used as quotation marks around words, not as part of contractions. Only apostrophes in the middle of a word should be kept.",
    hints: [
      "An apostrophe at the start or end of a word is a quotation mark, not part of the word",
      "Strip leading and trailing apostrophes from each extracted word"
    ],
    requiredScenarios: ["word-count-with-apostrophes-and-quotations", "word-count-apostrophe-word-variation"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  // Task 1: Basic cases
  {
    slug: "word-count-single-word",
    name: "Count one word",
    description: "Count a single word.",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["word"],
    expected: { word: 1 }
  },
  {
    slug: "word-count-multiple-unique-words",
    name: "Count one of each word",
    description: "Count one of each word in a sentence.",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["one of each"],
    expected: { one: 1, of: 1, each: 1 }
  },
  {
    slug: "word-count-multiple-occurrences",
    name: "Multiple occurrences",
    description: "Count multiple occurrences of a word.",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["one fish two fish red fish blue fish"],
    expected: { one: 1, fish: 4, two: 1, red: 1, blue: 1 }
  },
  {
    slug: "word-count-cramped-list",
    name: "Cramped list",
    description: "Handle lists with cramped formatting.",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["one,two,three"],
    expected: { one: 1, two: 1, three: 1 }
  },
  {
    slug: "word-count-ignore-punctuation",
    name: "Ignore punctuation",
    description: "Ignore punctuation while counting words.",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["car: carpet as java: javascript!!&@$%^&"],
    expected: { car: 1, carpet: 1, as: 1, java: 1, javascript: 1 }
  },
  {
    slug: "word-count-include-numbers",
    name: "Include numbers",
    description: "Count words and include numbers.",
    taskId: "basic-word-counting",
    functionName: "count_words",
    args: ["testing, 1, 2 testing"],
    expected: { testing: 2, "1": 1, "2": 1 }
  },

  // Task 2: Case normalization
  {
    slug: "word-count-normalize-case",
    name: "Normalize case",
    description: "Count words regardless of case.",
    taskId: "case-normalization",
    functionName: "count_words",
    args: ["go Go GO Stop stop"],
    expected: { go: 3, stop: 2 }
  },
  {
    slug: "word-count-with-apostrophes",
    name: "Words with apostrophes",
    description: "Correctly handle words with apostrophes.",
    taskId: "case-normalization",
    functionName: "count_words",
    args: ["First: don't laugh. Then: don't cry."],
    expected: { first: 1, "don't": 2, laugh: 1, then: 1, cry: 1 }
  },
  {
    slug: "word-count-multiple-spaces",
    name: "Multiple spaces",
    description: "Handle multiple spaces correctly.",
    taskId: "case-normalization",
    functionName: "count_words",
    args: [" multiple   whitespaces"],
    expected: { multiple: 1, whitespaces: 1 }
  },

  // Task 3: Bonus
  {
    slug: "word-count-with-apostrophes-and-quotations",
    name: "Words with apostrophes and quotations",
    description: "Handle words with apostrophes and quotations.",
    taskId: "bonus-apostrophes",
    functionName: "count_words",
    args: ["Joe can't tell between 'large' and large."],
    expected: { joe: 1, "can't": 1, tell: 1, between: 1, large: 2, and: 1 }
  },
  {
    slug: "word-count-apostrophe-word-variation",
    name: "Apostrophe word variation",
    description: "Correctly count variations of words with apostrophes.",
    taskId: "bonus-apostrophes",
    functionName: "count_words",
    args: ["can, can't, 'can't'"],
    expected: { can: 1, "can't": 2 }
  }
];
