import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "count-nucleotide" as const,
    name: "tasks.countNucleotide.name",
    description: "tasks.countNucleotide.description",
    hints: [],
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
    name: "scenarios.nucleotideEmptyStrand.name",
    description: "scenarios.nucleotideEmptyStrand.description",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["", "A"],
    expected: 0
  },
  {
    slug: "nucleotide-single-match",
    name: "scenarios.nucleotideSingleMatch.name",
    description: "scenarios.nucleotideSingleMatch.description",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["G", "G"],
    expected: 1
  },
  {
    slug: "nucleotide-repeated",
    name: "scenarios.nucleotideRepeated.name",
    description: "scenarios.nucleotideRepeated.description",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["GGGGGGG", "G"],
    expected: 7
  },
  {
    slug: "nucleotide-mixed-strand-a",
    name: "scenarios.nucleotideMixedStrandA.name",
    description: "scenarios.nucleotideMixedStrandA.description",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["GATTACA", "A"],
    expected: 3
  },
  {
    slug: "nucleotide-mixed-strand-t",
    name: "scenarios.nucleotideMixedStrandT.name",
    description: "scenarios.nucleotideMixedStrandT.description",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["GATTACA", "T"],
    expected: 2
  },
  {
    slug: "nucleotide-invalid-nucleotide",
    name: "scenarios.nucleotideInvalidNucleotide.name",
    description: "scenarios.nucleotideInvalidNucleotide.description",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["GATTACA", "X"],
    expected: -1
  },
  {
    slug: "nucleotide-invalid-strand",
    name: "scenarios.nucleotideInvalidStrand.name",
    description: "scenarios.nucleotideInvalidStrand.description",
    taskId: "count-nucleotide",
    functionName: "count_nucleotide",
    args: ["AGXXACT", "A"],
    expected: -1
  }
];
