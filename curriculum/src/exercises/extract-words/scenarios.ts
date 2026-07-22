import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "extract-words" as const,
    name: "tasks.extractWords.name",
    description: "tasks.extractWords.description",
    hints: [],
    requiredScenarios: [
      "simple-two-words",
      "sentence-with-period",
      "longer-sentence",
      "single-word",
      "single-word-with-period"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "simple-two-words",
    name: "scenarios.simpleTwoWords.name",
    description: "scenarios.simpleTwoWords.description",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["hello world"],
    expected: ["hello", "world"]
  },
  {
    slug: "sentence-with-period",
    name: "scenarios.sentenceWithPeriod.name",
    description: "scenarios.sentenceWithPeriod.description",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["I love cake."],
    expected: ["I", "love", "cake"]
  },
  {
    slug: "longer-sentence",
    name: "scenarios.longerSentence.name",
    description: "scenarios.longerSentence.description",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["the quick brown fox."],
    expected: ["the", "quick", "brown", "fox"]
  },
  {
    slug: "single-word",
    name: "scenarios.singleWord.name",
    description: "scenarios.singleWord.description",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["hello"],
    expected: ["hello"]
  },
  {
    slug: "single-word-with-period",
    name: "scenarios.singleWordWithPeriod.name",
    description: "scenarios.singleWordWithPeriod.description",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["hello."],
    expected: ["hello"]
  }
];
