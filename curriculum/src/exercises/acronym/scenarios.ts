import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-acronym-function" as const,
    name: "Create acronym function",
    description:
      "Write a function that takes a phrase and returns an acronym. The acronym should be formed by taking the first letter of each word and converting it to uppercase.",
    hints: [
      "Split the phrase into words using spaces as the delimiter",
      "Get the first character of each word",
      "Convert each character to uppercase",
      "Join the characters together"
    ],
    requiredScenarios: ["png", "ror", "first-word-only", "hyphenated"],
    bonus: false
  }
] as const satisfies readonly Task[];

// Export type-safe task IDs for LLM metadata
export type TaskId = (typeof tasks)[number]["id"];

export const scenarios: IOScenario[] = [
  {
    slug: "png",
    name: "Basic acronym: PNG",
    description: "Convert 'Portable Network Graphics' to 'PNG'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable Network Graphics"],
    expected: "PNG"
  },
  {
    slug: "ror",
    name: "Lowercase words: ROR",
    description: "Convert 'Ruby on Rails' to 'ROR'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Ruby on Rails"],
    expected: "ROR"
  },
  {
    slug: "first-word-only",
    name: "Single word: H",
    description: "Convert 'HyperText' to 'H'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["HyperText"],
    expected: "H"
  },
  {
    slug: "hyphenated",
    name: "Hyphenated phrase: CMOS",
    description: "Convert 'Complementary metal-oxide semiconductor' to 'CMOS'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Complementary metal-oxide semiconductor"],
    expected: "CMOS"
  },
  {
    slug: "punctuation",
    name: "With punctuation: PHT",
    description: "Convert 'Portable, HyperText, Transmitter' to 'PHT'",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable, HyperText, Transmitter"],
    expected: "PHT"
  }
];
