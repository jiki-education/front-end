import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "calculate-hamming-distance" as const,
    name: "tasks.calculateHammingDistance.name",
    description: "tasks.calculateHammingDistance.description",
    hints: [],
    requiredScenarios: [
      "hamming-empty-strands",
      "hamming-single-letter-identical",
      "hamming-long-identical-strands",
      "hamming-single-letter-different",
      "hamming-long-different-strands"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "hamming-empty-strands",
    name: "scenarios.hammingEmptyStrands.name",
    description: "scenarios.hammingEmptyStrands.description",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["", ""],
    expected: 0
  },
  {
    slug: "hamming-single-letter-identical",
    name: "scenarios.hammingSingleLetterIdentical.name",
    description: "scenarios.hammingSingleLetterIdentical.description",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["A", "A"],
    expected: 0
  },
  {
    slug: "hamming-long-identical-strands",
    name: "scenarios.hammingLongIdenticalStrands.name",
    description: "scenarios.hammingLongIdenticalStrands.description",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["GGACTGAAATCTG", "GGACTGAAATCTG"],
    expected: 0
  },
  {
    slug: "hamming-single-letter-different",
    name: "scenarios.hammingSingleLetterDifferent.name",
    description: "scenarios.hammingSingleLetterDifferent.description",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["G", "T"],
    expected: 1
  },
  {
    slug: "hamming-long-different-strands",
    name: "scenarios.hammingLongDifferentStrands.name",
    description: "scenarios.hammingLongDifferentStrands.description",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["GGACGGATTCTG", "AGGACGGATTCT"],
    expected: 9
  }
];
