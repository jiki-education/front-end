import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "count-nucleotides" as const,
    name: "tasks.countNucleotides.name",
    description: "tasks.countNucleotides.description",
    hints: [],
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
    name: "scenarios.nucleotideCountEmptyStrand.name",
    description: "scenarios.nucleotideCountEmptyStrand.description",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: [""],
    expected: { A: 0, C: 0, G: 0, T: 0 }
  },
  {
    slug: "nucleotide-count-single-nucleotide",
    name: "scenarios.nucleotideCountSingleNucleotide.name",
    description: "scenarios.nucleotideCountSingleNucleotide.description",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: ["G"],
    expected: { A: 0, C: 0, G: 1, T: 0 }
  },
  {
    slug: "nucleotide-count-repeated-nucleotide",
    name: "scenarios.nucleotideCountRepeatedNucleotide.name",
    description: "scenarios.nucleotideCountRepeatedNucleotide.description",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: ["GGGGGGG"],
    expected: { A: 0, C: 0, G: 7, T: 0 }
  },
  {
    slug: "nucleotide-count-mixed-strand",
    name: "scenarios.nucleotideCountMixedStrand.name",
    description: "scenarios.nucleotideCountMixedStrand.description",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: ["AGCTTTTCATTCTGACTGCAACGGGCAATATGTCTCTGTGTGGATTAAAAAAAGAGTGTCTGATAGCAGC"],
    expected: { A: 20, C: 12, G: 17, T: 21 }
  },
  {
    slug: "nucleotide-count-invalid-nucleotide",
    name: "scenarios.nucleotideCountInvalidNucleotide.name",
    description: "scenarios.nucleotideCountInvalidNucleotide.description",
    taskId: "count-nucleotides",
    functionName: "count_nucleotides",
    args: ["AGXXACT"],
    expected: false
  }
];
