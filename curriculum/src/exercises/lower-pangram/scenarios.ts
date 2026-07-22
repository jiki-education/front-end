import type { Task, IOScenario, CodeCheck } from "../types";

const codeChecks: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("includes"),
    errorKey: "checks.callIncludesInside"
  }
];

export const tasks = [
  {
    id: "check-lower-pangram" as const,
    name: "tasks.checkLowerPangram.name",
    description: "tasks.checkLowerPangram.description",
    hints: [],
    requiredScenarios: [
      "lower-pangram-empty",
      "lower-pangram-full-alphabet",
      "lower-pangram-classic",
      "lower-pangram-missing-x",
      "lower-pangram-missing-h",
      "lower-pangram-with-underscores",
      "lower-pangram-with-numbers",
      "lower-pangram-numbers-replacing-letters"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "lower-pangram-empty",
    name: "scenarios.lowerPangramEmpty.name",
    description: "scenarios.lowerPangramEmpty.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: [""],
    expected: false,
    codeChecks
  },
  {
    slug: "lower-pangram-full-alphabet",
    name: "scenarios.lowerPangramFullAlphabet.name",
    description: "scenarios.lowerPangramFullAlphabet.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["abcdefghijklmnopqrstuvwxyz"],
    expected: true,
    codeChecks
  },
  {
    slug: "lower-pangram-classic",
    name: "scenarios.lowerPangramClassic.name",
    description: "scenarios.lowerPangramClassic.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the quick brown fox jumps over the lazy dog"],
    expected: true,
    codeChecks
  },
  {
    slug: "lower-pangram-missing-x",
    name: "scenarios.lowerPangramMissingX.name",
    description: "scenarios.lowerPangramMissingX.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["a quick movement of the enemy will jeopardize five gunboats"],
    expected: false,
    codeChecks
  },
  {
    slug: "lower-pangram-missing-h",
    name: "scenarios.lowerPangramMissingH.name",
    description: "scenarios.lowerPangramMissingH.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["five boxing wizards jump quickly at it"],
    expected: false,
    codeChecks
  },
  {
    slug: "lower-pangram-with-underscores",
    name: "scenarios.lowerPangramWithUnderscores.name",
    description: "scenarios.lowerPangramWithUnderscores.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the_quick_brown_fox_jumps_over_the_lazy_dog"],
    expected: true,
    codeChecks
  },
  {
    slug: "lower-pangram-with-numbers",
    name: "scenarios.lowerPangramWithNumbers.name",
    description: "scenarios.lowerPangramWithNumbers.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the 1 quick brown fox jumps over the 2 lazy dogs"],
    expected: true,
    codeChecks
  },
  {
    slug: "lower-pangram-numbers-replacing-letters",
    name: "scenarios.lowerPangramNumbersReplacingLetters.name",
    description: "scenarios.lowerPangramNumbersReplacingLetters.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["7h3 qu1ck brown fox jumps ov3r 7h3 lazy dog"],
    expected: false,
    codeChecks
  }
];
