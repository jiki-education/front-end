import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-acronym-function" as const,
    name: "tasks.createAcronymFunction.name",
    description: "tasks.createAcronymFunction.description",
    hints: [],
    requiredScenarios: ["png", "ror", "first-word-only", "hyphenated"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "png",
    name: "scenarios.png.name",
    description: "scenarios.png.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable Network Graphics"],
    expected: "PNG"
  },
  {
    slug: "ror",
    name: "scenarios.ror.name",
    description: "scenarios.ror.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Ruby on Rails"],
    expected: "ROR"
  },
  {
    slug: "first-word-only",
    name: "scenarios.firstWordOnly.name",
    description: "scenarios.firstWordOnly.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["HyperText"],
    expected: "H"
  },
  {
    slug: "hyphenated",
    name: "scenarios.hyphenated.name",
    description: "scenarios.hyphenated.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Complementary metal-oxide semiconductor"],
    expected: "CMOS"
  },
  {
    slug: "punctuation",
    name: "scenarios.punctuation.name",
    description: "scenarios.punctuation.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable, HyperText, Transmitter"],
    expected: "PHT"
  }
];
