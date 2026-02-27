import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "reverse-strings" as const,
    name: "Reverse Strings",
    description: "Reverse a string so that it reads from right to left instead of left to right.",
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
    name: "Empty string",
    description: "An empty string should return an empty string when reversed",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: [""],
    expected: ""
  },
  {
    slug: "reverse-word",
    name: "A word",
    description: "Reverse the word 'robot'",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["robot"],
    expected: "tobor"
  },
  {
    slug: "reverse-capitalized-word",
    name: "A capitalized word",
    description: "Reverse a capitalized word 'Ramen'",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["Ramen"],
    expected: "nemaR"
  },
  {
    slug: "reverse-sentence-punctuation",
    name: "Sentence with punctuation",
    description: "Reverse a sentence with punctuation 'I'm hungry!'",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["I'm hungry!"],
    expected: "!yrgnuh m'I"
  },
  {
    slug: "reverse-palindrome",
    name: "Palindrome",
    description: "A palindrome remains the same when reversed",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["racecar"],
    expected: "racecar"
  },
  {
    slug: "reverse-even-sized-word",
    name: "Even-sized word",
    description: "Reverse an even-sized word 'drawer'",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["drawer"],
    expected: "reward"
  },
  {
    slug: "reverse-wide-characters",
    name: "Wide characters",
    description: "Reverse wide Unicode characters '子猫'",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["子猫"],
    expected: "猫子"
  },
  {
    slug: "reverse-emoji-family",
    name: "Emoji Family",
    description: "Reverse an emoji family",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["👩‍👩‍👧‍👦"],
    expected: "👦‍👧‍👩‍👩"
  },
  {
    slug: "reverse-emoji-rainbow-flag",
    name: "Rainbow Flag",
    description: "Make a rainbow flag by reversing",
    taskId: "reverse-strings",
    functionName: "reverse",
    args: ["️🌈‍️🏳"],
    expected: "🏳️‍🌈️"
  }
];
