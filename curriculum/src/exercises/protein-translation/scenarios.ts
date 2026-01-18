import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "basic-translations" as const,
    name: "Basic Translations",
    description: "Translate single codons to their corresponding amino acids.",
    hints: [
      "Create a dictionary mapping codons to amino acids",
      "Each codon is exactly 3 characters",
      "Use the dictionary lookup to get the protein name"
    ],
    requiredScenarios: [
      "empty-rna-sequence",
      "methionine-sequence",
      "phenylalanine-sequence-1",
      "phenylalanine-sequence-2",
      "leucine-sequence-1",
      "leucine-sequence-2"
    ],
    bonus: false
  },
  {
    id: "multiple-codons" as const,
    name: "Multiple Codons",
    description: "Translate RNA sequences containing multiple codons.",
    hints: [
      "Split the RNA string into 3-character chunks",
      "Use the modulo operator (%) to detect every 3rd character",
      "Build up each codon character by character"
    ],
    requiredScenarios: ["sequence-two-proteins", "sequence-different-codons", "sequence-three-proteins"],
    bonus: false
  },
  {
    id: "stop-codon-behavior" as const,
    name: "Stop Codon Behavior",
    description: "Handle STOP codons correctly - translation should stop when a STOP codon is encountered.",
    hints: [
      "Check if a codon maps to 'STOP'",
      "Use the 'break' statement to exit the loop early",
      "Don't add STOP to the protein list"
    ],
    requiredScenarios: ["stop-codon-at-start", "stop-codon-at-end", "stop-codon-in-middle"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  // Basic translations
  {
    slug: "empty-rna-sequence",
    name: "Empty RNA sequence",
    description: "An empty RNA sequence should result in an empty protein list",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: [""],
    expected: []
  },
  {
    slug: "methionine-sequence",
    name: "Methionine RNA sequence",
    description: "The RNA sequence 'AUG' should translate to 'Methionine'",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["AUG"],
    expected: ["Methionine"]
  },
  {
    slug: "phenylalanine-sequence-1",
    name: "Phenylalanine RNA sequence 1",
    description: "The RNA sequence 'UUU' should translate to 'Phenylalanine'",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["UUU"],
    expected: ["Phenylalanine"]
  },
  {
    slug: "phenylalanine-sequence-2",
    name: "Phenylalanine RNA sequence 2",
    description: "The RNA sequence 'UUC' should translate to 'Phenylalanine'",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["UUC"],
    expected: ["Phenylalanine"]
  },
  {
    slug: "leucine-sequence-1",
    name: "Leucine RNA sequence 1",
    description: "The RNA sequence 'UUA' should translate to 'Leucine'",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["UUA"],
    expected: ["Leucine"]
  },
  {
    slug: "leucine-sequence-2",
    name: "Leucine RNA sequence 2",
    description: "The RNA sequence 'UUG' should translate to 'Leucine'",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["UUG"],
    expected: ["Leucine"]
  },
  // Multiple codons
  {
    slug: "sequence-two-proteins",
    name: "Sequence of two protein codons",
    description: "The RNA sequence 'UUUUUU' should translate to ['Phenylalanine', 'Phenylalanine']",
    taskId: "multiple-codons",
    functionName: "translate_rna",
    args: ["UUUUUU"],
    expected: ["Phenylalanine", "Phenylalanine"]
  },
  {
    slug: "sequence-different-codons",
    name: "Sequence of two different protein codons",
    description: "The RNA sequence 'UUAUUG' should translate to ['Leucine', 'Leucine']",
    taskId: "multiple-codons",
    functionName: "translate_rna",
    args: ["UUAUUG"],
    expected: ["Leucine", "Leucine"]
  },
  {
    slug: "sequence-three-proteins",
    name: "Sequence of three proteins",
    description: "The RNA sequence 'AUGUUUUGG' should translate to ['Methionine', 'Phenylalanine', 'Tryptophan']",
    taskId: "multiple-codons",
    functionName: "translate_rna",
    args: ["AUGUUUUGG"],
    expected: ["Methionine", "Phenylalanine", "Tryptophan"]
  },
  // Stop codon behavior
  {
    slug: "stop-codon-at-start",
    name: "Stop codon at start",
    description: "Translation should stop if a stop codon is at the beginning of the sequence",
    taskId: "stop-codon-behavior",
    functionName: "translate_rna",
    args: ["UAGUGG"],
    expected: []
  },
  {
    slug: "stop-codon-at-end",
    name: "Stop codon at end",
    description: "Translation should stop if a stop codon is at the end of the sequence",
    taskId: "stop-codon-behavior",
    functionName: "translate_rna",
    args: ["UGGUAG"],
    expected: ["Tryptophan"]
  },
  {
    slug: "stop-codon-in-middle",
    name: "Stop codon in middle",
    description: "Translation should stop if a stop codon is in the middle of the sequence",
    taskId: "stop-codon-behavior",
    functionName: "translate_rna",
    args: ["UGGUAGUGG"],
    expected: ["Tryptophan"]
  }
];
