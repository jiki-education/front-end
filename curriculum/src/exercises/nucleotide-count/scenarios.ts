import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "count-nucleotides" as const,
    name: "Count Nucleotides",
    description:
      "Write a function that counts the occurrences of each nucleotide (A, C, G, T) in a DNA strand and returns a dictionary with the counts. Return false if the strand contains invalid characters.",
    hints: [
      "Initialize a dictionary with all four nucleotides set to 0",
      "Use keys() to get the list of valid nucleotides",
      "Iterate through each character and check if it's valid",
      "Return false immediately if an invalid character is found"
    ],
    requiredScenarios: [
      "nucleotide-count-empty-strand",
      "nucleotide-count-single-nucleotide",
      "nucleotide-count-repeated-nucleotide",
      "nucleotide-count-mixed-strand",
      "nucleotide-count-invalid-nucleotide"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "nucleotide-count-empty-strand",
    name: "Empty strand",
    description: "An empty strand should result in all counts being zero",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: [""],
    expected: { A: 0, C: 0, G: 0, T: 0 }
  },
  {
    slug: "nucleotide-count-single-nucleotide",
    name: "Single nucleotide",
    description: "A single-character strand should correctly count the nucleotide",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: ["G"],
    expected: { A: 0, C: 0, G: 1, T: 0 }
  },
  {
    slug: "nucleotide-count-repeated-nucleotide",
    name: "Repeated nucleotide",
    description: "A strand with repeated nucleotides should correctly count occurrences",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: ["GGGGGGG"],
    expected: { A: 0, C: 0, G: 7, T: 0 }
  },
  {
    slug: "nucleotide-count-mixed-strand",
    name: "Mixed nucleotide strand",
    description: "A strand with multiple nucleotides should correctly count each nucleotide",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: ["AGCTTTTCATTCTGACTGCAACGGGCAATATGTCTCTGTGTGGATTAAAAAAAGAGTGTCTGATAGCAGC"],
    expected: { A: 20, C: 12, G: 17, T: 21 }
  },
  {
    slug: "nucleotide-count-invalid-nucleotide",
    name: "Invalid nucleotide",
    description: "A strand with invalid nucleotides should return false",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: ["AGXXACT"],
    expected: false
  }
];
