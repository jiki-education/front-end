import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "transcribe-dna-to-rna" as const,
    name: "Transcribe DNA to RNA",
    description:
      "Write a function that takes a DNA strand and returns its RNA complement. Each nucleotide should be replaced with its complement: G->C, C->G, T->A, A->U.",
    hints: [
      "Create a helper function to convert a single nucleotide",
      "Use arrays to map DNA nucleotides to RNA nucleotides",
      "Iterate through each letter in the DNA string",
      "Build up the result string using concatenate()"
    ],
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
    name: "Empty RNA sequence",
    description: "An empty DNA sequence should return an empty RNA sequence.",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: [""],
    expected: ""
  },
  {
    slug: "rna-cytosine-to-guanine",
    name: "Cytosine to guanine",
    description: "The RNA complement of cytosine (C) is guanine (G).",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["C"],
    expected: "G"
  },
  {
    slug: "rna-guanine-to-cytosine",
    name: "Guanine to cytosine",
    description: "The RNA complement of guanine (G) is cytosine (C).",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["G"],
    expected: "C"
  },
  {
    slug: "rna-thymine-to-adenine",
    name: "Thymine to adenine",
    description: "The RNA complement of thymine (T) is adenine (A).",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["T"],
    expected: "A"
  },
  {
    slug: "rna-adenine-to-uracil",
    name: "Adenine to uracil",
    description: "The RNA complement of adenine (A) is uracil (U).",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["A"],
    expected: "U"
  },
  {
    slug: "rna-full-sequence",
    name: "Full RNA complement",
    description: "Convert a full DNA sequence to its RNA complement.",
    taskId: "transcribe-dna-to-rna",
    functionName: "dna_to_rna",
    args: ["ACGTGGTCTTAA"],
    expected: "UGCACCAGAAUU"
  }
];
