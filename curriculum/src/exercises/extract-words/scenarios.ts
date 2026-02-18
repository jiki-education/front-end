import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "extract-words" as const,
    name: "Extract words",
    description:
      "Write an extract_words function that takes a sentence and returns a list of words. Words are separated by spaces, and periods should be ignored.",
    hints: [
      "Build each word character by character using concatenate()",
      "When you encounter a space, push the current word to the list and start a new word",
      "Skip periods - don't add them to the word",
      "After the loop, check if there's a remaining word to push"
    ],
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
    name: "Two words",
    description: "Extract two simple words separated by a space.",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["hello world"],
    expected: ["hello", "world"]
  },
  {
    slug: "sentence-with-period",
    name: "Sentence with period",
    description: "Extract words from a sentence that ends with a period.",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["I love cake."],
    expected: ["I", "love", "cake"]
  },
  {
    slug: "longer-sentence",
    name: "Longer sentence",
    description: "Extract words from a longer sentence with a period.",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["the quick brown fox."],
    expected: ["the", "quick", "brown", "fox"]
  },
  {
    slug: "single-word",
    name: "Single word",
    description: "Extract a single word with no spaces or periods.",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["hello"],
    expected: ["hello"]
  },
  {
    slug: "single-word-with-period",
    name: "Single word with period",
    description: "Extract a single word from a string ending with a period.",
    taskId: "extract-words",
    functionName: "extract_words",
    args: ["hello."],
    expected: ["hello"]
  }
];
