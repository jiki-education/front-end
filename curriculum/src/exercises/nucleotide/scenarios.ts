import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "count-nucleotide" as const,
    name: "Count a Nucleotide",
    description:
      "Write a function that counts how many times a specific nucleotide (A, C, G, or T) appears in a DNA strand. Return -1 if the nucleotide or any character in the strand is invalid.",
    hints: [
      "Write a helper function to check if a character is in a string",
      "First validate that the nucleotide itself is valid",
      "Then iterate through the strand, validating each character and counting matches",
      "Return -1 immediately if you find an invalid character"
    ],
    requiredScenarios: [
      "nucleotide-empty-strand",
      "nucleotide-single-match",
      "nucleotide-repeated",
      "nucleotide-mixed-strand-a",
      "nucleotide-mixed-strand-t",
      "nucleotide-invalid-nucleotide",
      "nucleotide-invalid-strand"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "nucleotide-empty-strand",
    name: "Empty strand",
    description: "An empty strand should return 0 for any valid nucleotide",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["", "A"],
    expected: 0
  },
  {
    slug: "nucleotide-single-match",
    name: "Single nucleotide strand",
    description: "A single-character strand matching the target should return 1",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["G", "G"],
    expected: 1
  },
  {
    slug: "nucleotide-repeated",
    name: "Repeated nucleotide",
    description: "A strand of repeated nucleotides should count all of them",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["GGGGGGG", "G"],
    expected: 7
  },
  {
    slug: "nucleotide-mixed-strand-a",
    name: "Count A in mixed strand",
    description: "Count a specific nucleotide in a mixed strand",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["GATTACA", "A"],
    expected: 3
  },
  {
    slug: "nucleotide-mixed-strand-t",
    name: "Count T in mixed strand",
    description: "Count a different nucleotide in the same strand",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["GATTACA", "T"],
    expected: 2
  },
  {
    slug: "nucleotide-invalid-nucleotide",
    name: "Invalid nucleotide",
    description: "An invalid nucleotide character should return -1",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["GATTACA", "X"],
    expected: -1
  },
  {
    slug: "nucleotide-invalid-strand",
    name: "Invalid strand",
    description: "A strand containing invalid characters should return -1",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["AGXXACT", "A"],
    expected: -1
  }
];
