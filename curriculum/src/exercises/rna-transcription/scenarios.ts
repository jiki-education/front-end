import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "transcribe-dna-to-rna" as const,
    name: "tasks.transcribeDnaToRna.name",
    description: "tasks.transcribeDnaToRna.description",
    hints: [],
    requiredScenarios: [
      "rna-empty-sequence",
      "rna-cytosine-to-guanine",
      "rna-guanine-to-cytosine",
      "rna-thymine-to-adenine",
      "rna-adenine-to-uracil",
      "rna-full-sequence"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "rna-empty-sequence",
    name: "scenarios.rnaEmptySequence.name",
    description: "scenarios.rnaEmptySequence.description",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: [""],
    expected: ""
  },
  {
    slug: "rna-cytosine-to-guanine",
    name: "scenarios.rnaCytosineToGuanine.name",
    description: "scenarios.rnaCytosineToGuanine.description",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["C"],
    expected: "G"
  },
  {
    slug: "rna-guanine-to-cytosine",
    name: "scenarios.rnaGuanineToCytosine.name",
    description: "scenarios.rnaGuanineToCytosine.description",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["G"],
    expected: "C"
  },
  {
    slug: "rna-thymine-to-adenine",
    name: "scenarios.rnaThymineToAdenine.name",
    description: "scenarios.rnaThymineToAdenine.description",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["T"],
    expected: "A"
  },
  {
    slug: "rna-adenine-to-uracil",
    name: "scenarios.rnaAdenineToUracil.name",
    description: "scenarios.rnaAdenineToUracil.description",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["A"],
    expected: "U"
  },
  {
    slug: "rna-full-sequence",
    name: "scenarios.rnaFullSequence.name",
    description: "scenarios.rnaFullSequence.description",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["ACGTGGTCTTAA"],
    expected: "UGCACCAGAAUU"
  }
];
