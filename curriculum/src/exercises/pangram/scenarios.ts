import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-pangram" as const,
    name: "tasks.checkPangram.name",
    description: "tasks.checkPangram.description",
    hints: [],
    requiredScenarios: [
      "pangram-empty-sentence",
      "pangram-perfect-lowercase",
      "pangram-only-lowercase",
      "pangram-missing-x",
      "pangram-missing-h",
      "pangram-missing-a-m",
      "pangram-with-underscores",
      "pangram-with-numbers",
      "pangram-numbers-replacing-letters",
      "pangram-mixed-case-punctuation",
      "pangram-case-insensitive"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "pangram-empty-sentence",
    name: "scenarios.pangramEmptySentence.name",
    description: "scenarios.pangramEmptySentence.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: [""],
    expected: false
  },
  {
    slug: "pangram-perfect-lowercase",
    name: "scenarios.pangramPerfectLowercase.name",
    description: "scenarios.pangramPerfectLowercase.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["abcdefghijklmnopqrstuvwxyz"],
    expected: true
  },
  {
    slug: "pangram-only-lowercase",
    name: "scenarios.pangramOnlyLowercase.name",
    description: "scenarios.pangramOnlyLowercase.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["the quick brown fox jumps over the lazy dog"],
    expected: true
  },
  {
    slug: "pangram-missing-x",
    name: "scenarios.pangramMissingX.name",
    description: "scenarios.pangramMissingX.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["a quick movement of the enemy will jeopardize five gunboats"],
    expected: false
  },
  {
    slug: "pangram-missing-h",
    name: "scenarios.pangramMissingH.name",
    description: "scenarios.pangramMissingH.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["five boxing wizards jump quickly at it"],
    expected: false
  },
  {
    slug: "pangram-missing-a-m",
    name: "scenarios.pangramMissingAM.name",
    description: "scenarios.pangramMissingAM.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["abcdefghijklm ABCDEFGHIJKLM"],
    expected: false
  },
  {
    slug: "pangram-with-underscores",
    name: "scenarios.pangramWithUnderscores.name",
    description: "scenarios.pangramWithUnderscores.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["the_quick_brown_fox_jumps_over_the_lazy_dog"],
    expected: true
  },
  {
    slug: "pangram-with-numbers",
    name: "scenarios.pangramWithNumbers.name",
    description: "scenarios.pangramWithNumbers.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["the 1 quick brown fox jumps over the 2 lazy dogs"],
    expected: true
  },
  {
    slug: "pangram-numbers-replacing-letters",
    name: "scenarios.pangramNumbersReplacingLetters.name",
    description: "scenarios.pangramNumbersReplacingLetters.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["7h3 qu1ck brown fox jumps ov3r 7h3 lazy dog"],
    expected: false
  },
  {
    slug: "pangram-mixed-case-punctuation",
    name: "scenarios.pangramMixedCasePunctuation.name",
    description: "scenarios.pangramMixedCasePunctuation.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["Five quacking Zephyrs jolt my wax bed."],
    expected: true
  },
  {
    slug: "pangram-case-insensitive",
    name: "scenarios.pangramCaseInsensitive.name",
    description: "scenarios.pangramCaseInsensitive.description",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["the quick brown fox jumps over with lazy FX"],
    expected: false
  }
];
