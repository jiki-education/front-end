import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "reverse-strings" as const,
    name: "tasks.reverseStrings.name",
    description: "tasks.reverseStrings.description",
    hints: [],
    requiredScenarios: [
      "reverse-empty-string",
      "reverse-word",
      "reverse-capitalized-word",
      "reverse-sentence-punctuation",
      "reverse-palindrome",
      "reverse-even-sized-word",
      "reverse-wide-characters",
      "reverse-emoji-family",
      "reverse-emoji-rainbow-flag"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "reverse-empty-string",
    name: "scenarios.reverseEmptyString.name",
    description: "scenarios.reverseEmptyString.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: [""],
    expected: ""
  },
  {
    slug: "reverse-word",
    name: "scenarios.reverseWord.name",
    description: "scenarios.reverseWord.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["robot"],
    expected: "tobor"
  },
  {
    slug: "reverse-capitalized-word",
    name: "scenarios.reverseCapitalizedWord.name",
    description: "scenarios.reverseCapitalizedWord.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["Ramen"],
    expected: "nemaR"
  },
  {
    slug: "reverse-sentence-punctuation",
    name: "scenarios.reverseSentencePunctuation.name",
    description: "scenarios.reverseSentencePunctuation.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["I'm hungry!"],
    expected: "!yrgnuh m'I"
  },
  {
    slug: "reverse-palindrome",
    name: "scenarios.reversePalindrome.name",
    description: "scenarios.reversePalindrome.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["racecar"],
    expected: "racecar"
  },
  {
    slug: "reverse-even-sized-word",
    name: "scenarios.reverseEvenSizedWord.name",
    description: "scenarios.reverseEvenSizedWord.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["drawer"],
    expected: "reward"
  },
  {
    slug: "reverse-wide-characters",
    name: "scenarios.reverseWideCharacters.name",
    description: "scenarios.reverseWideCharacters.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["子猫"],
    expected: "猫子"
  },
  {
    slug: "reverse-emoji-family",
    name: "scenarios.reverseEmojiFamily.name",
    description: "scenarios.reverseEmojiFamily.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["👩‍👩‍👧‍👦"],
    expected: "👦‍👧‍👩‍👩"
  },
  {
    slug: "reverse-emoji-rainbow-flag",
    name: "scenarios.reverseEmojiRainbowFlag.name",
    description: "scenarios.reverseEmojiRainbowFlag.description",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["️🌈‍️🏳"],
    expected: "🏳️‍🌈️"
  }
];
