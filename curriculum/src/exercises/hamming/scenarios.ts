import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "calculate-hamming-distance" as const,
    name: "Calculate the Hamming Distance",
    description:
      "Write a function that calculates the Hamming distance between two DNA strands of equal length. The Hamming distance is the number of positions where the corresponding characters differ.",
    hints: [
      "Loop through each character in the first string",
      "Keep a counter for your position in the string",
      "Compare each character with the character at the same position in the second string",
      "Keep a running count of differences"
    ],
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
    name: "Empty strands",
    description: "Empty strands have a Hamming distance of 0",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["", ""],
    expected: 0
  },
  {
    slug: "hamming-single-letter-identical",
    name: "Single letter identical strands",
    description: "Single-letter identical strands have a Hamming distance of 0",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["A", "A"],
    expected: 0
  },
  {
    slug: "hamming-long-identical-strands",
    name: "Long identical strands",
    description: "Long identical strands have a Hamming distance of 0",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["GGACTGAAATCTG", "GGACTGAAATCTG"],
    expected: 0
  },
  {
    slug: "hamming-single-letter-different",
    name: "Single letter different strands",
    description: "Single-letter different strands have a Hamming distance of 1",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["G", "T"],
    expected: 1
  },
  {
    slug: "hamming-long-different-strands",
    name: "Long different strands",
    description: "Long strands with differences have a calculated Hamming distance",
    taskId: "calculate-hamming-distance",
    functionName: "hamming_distance",
    args: ["GGACGGATTCTG", "AGGACGGATTCT"],
    expected: 9
  }
];
