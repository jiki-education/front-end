import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "basic-translations" as const,
    name: "tasks.basicTranslations.name",
    description: "tasks.basicTranslations.description",
    hints: [],
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
    name: "tasks.multipleCodons.name",
    description: "tasks.multipleCodons.description",
    hints: [],
    requiredScenarios: ["sequence-two-proteins", "sequence-different-codons", "sequence-three-proteins"],
    bonus: false
  },
  {
    id: "stop-codon-behavior" as const,
    name: "tasks.stopCodonBehavior.name",
    description: "tasks.stopCodonBehavior.description",
    hints: [],
    requiredScenarios: ["stop-codon-at-start", "stop-codon-at-end", "stop-codon-in-middle"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  // Basic translations
  {
    slug: "empty-rna-sequence",
    name: "scenarios.emptyRnaSequence.name",
    description: "scenarios.emptyRnaSequence.description",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: [""],
    expected: []
  },
  {
    slug: "methionine-sequence",
    name: "scenarios.methionineSequence.name",
    description: "scenarios.methionineSequence.description",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["AUG"],
    expected: ["Methionine"]
  },
  {
    slug: "phenylalanine-sequence-1",
    name: "scenarios.phenylalanineSequence1.name",
    description: "scenarios.phenylalanineSequence1.description",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["UUU"],
    expected: ["Phenylalanine"]
  },
  {
    slug: "phenylalanine-sequence-2",
    name: "scenarios.phenylalanineSequence2.name",
    description: "scenarios.phenylalanineSequence2.description",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["UUC"],
    expected: ["Phenylalanine"]
  },
  {
    slug: "leucine-sequence-1",
    name: "scenarios.leucineSequence1.name",
    description: "scenarios.leucineSequence1.description",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["UUA"],
    expected: ["Leucine"]
  },
  {
    slug: "leucine-sequence-2",
    name: "scenarios.leucineSequence2.name",
    description: "scenarios.leucineSequence2.description",
    taskId: "basic-translations",
    functionName: "translate_rna",
    args: ["UUG"],
    expected: ["Leucine"]
  },
  // Multiple codons
  {
    slug: "sequence-two-proteins",
    name: "scenarios.sequenceTwoProteins.name",
    description: "scenarios.sequenceTwoProteins.description",
    taskId: "multiple-codons",
    functionName: "translate_rna",
    args: ["UUUUUU"],
    expected: ["Phenylalanine", "Phenylalanine"]
  },
  {
    slug: "sequence-different-codons",
    name: "scenarios.sequenceDifferentCodons.name",
    description: "scenarios.sequenceDifferentCodons.description",
    taskId: "multiple-codons",
    functionName: "translate_rna",
    args: ["UUAUUG"],
    expected: ["Leucine", "Leucine"]
  },
  {
    slug: "sequence-three-proteins",
    name: "scenarios.sequenceThreeProteins.name",
    description: "scenarios.sequenceThreeProteins.description",
    taskId: "multiple-codons",
    functionName: "translate_rna",
    args: ["AUGUUUUGG"],
    expected: ["Methionine", "Phenylalanine", "Tryptophan"]
  },
  // Stop codon behavior
  {
    slug: "stop-codon-at-start",
    name: "scenarios.stopCodonAtStart.name",
    description: "scenarios.stopCodonAtStart.description",
    taskId: "stop-codon-behavior",
    functionName: "translate_rna",
    args: ["UAGUGG"],
    expected: []
  },
  {
    slug: "stop-codon-at-end",
    name: "scenarios.stopCodonAtEnd.name",
    description: "scenarios.stopCodonAtEnd.description",
    taskId: "stop-codon-behavior",
    functionName: "translate_rna",
    args: ["UGGUAG"],
    expected: ["Tryptophan"]
  },
  {
    slug: "stop-codon-in-middle",
    name: "scenarios.stopCodonInMiddle.name",
    description: "scenarios.stopCodonInMiddle.description",
    taskId: "stop-codon-behavior",
    functionName: "translate_rna",
    args: ["UGGUAGUGG"],
    expected: ["Tryptophan"]
  }
];
