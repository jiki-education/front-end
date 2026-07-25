import type { Task, IOScenario, CodeCheck } from "../types";

// Enforces the decomposition. Checking every alphabet letter against every
// character is inherently a double iteration; the only way to do it with no
// loop nested inside another loop (anywhere in the program) is to split the two
// loops across two functions — the alphabet loop in isPangram, the character
// search in a helper. So "max loop nesting depth 1" forces the extraction, and
// no decoy call or wrapper can satisfy it while inlining the search.
const noNestedLoopsCheck: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertMaxLoopNestingDepth(1),
    errorKey: "checks.noNestedLoops"
  }
];

// Bonus: reward keeping the decomposed solution tight.
const lineCountCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 10 : 16;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
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
  },
  {
    id: "decompose-tightly" as const,
    name: "tasks.decomposeTightly.name",
    description: "tasks.decomposeTightly.description",
    hints: [],
    requiredScenarios: ["lower-pangram-bonus-line-count"],
    bonus: true
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
    expected: false
  },
  {
    slug: "lower-pangram-full-alphabet",
    name: "scenarios.lowerPangramFullAlphabet.name",
    description: "scenarios.lowerPangramFullAlphabet.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["abcdefghijklmnopqrstuvwxyz"],
    expected: true
  },
  {
    slug: "lower-pangram-classic",
    name: "scenarios.lowerPangramClassic.name",
    description: "scenarios.lowerPangramClassic.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the quick brown fox jumps over the lazy dog"],
    expected: true
  },
  {
    slug: "lower-pangram-missing-x",
    name: "scenarios.lowerPangramMissingX.name",
    description: "scenarios.lowerPangramMissingX.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["a quick movement of the enemy will jeopardize five gunboats"],
    expected: false
  },
  {
    slug: "lower-pangram-missing-h",
    name: "scenarios.lowerPangramMissingH.name",
    description: "scenarios.lowerPangramMissingH.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["five boxing wizards jump quickly at it"],
    expected: false
  },
  {
    slug: "lower-pangram-with-underscores",
    name: "scenarios.lowerPangramWithUnderscores.name",
    description: "scenarios.lowerPangramWithUnderscores.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the_quick_brown_fox_jumps_over_the_lazy_dog"],
    expected: true
  },
  {
    slug: "lower-pangram-with-numbers",
    name: "scenarios.lowerPangramWithNumbers.name",
    description: "scenarios.lowerPangramWithNumbers.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the 1 quick brown fox jumps over the 2 lazy dogs"],
    expected: true
  },
  {
    // The decomposition check rides on this final normal scenario so a student
    // who inlined everything sees exactly one failure ("extract the search")
    // rather than all eight scenarios reddening as if their logic were wrong.
    slug: "lower-pangram-numbers-replacing-letters",
    name: "scenarios.lowerPangramNumbersReplacingLetters.name",
    description: "scenarios.lowerPangramNumbersReplacingLetters.description",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["7h3 qu1ck brown fox jumps ov3r 7h3 lazy dog"],
    expected: false,
    codeChecks: noNestedLoopsCheck
  },
  {
    slug: "lower-pangram-bonus-line-count",
    name: "scenarios.lowerPangramBonusLineCount.name",
    description: "scenarios.lowerPangramBonusLineCount.description",
    taskId: "decompose-tightly",
    functionName: "is_pangram",
    args: ["the quick brown fox jumps over the lazy dog"],
    expected: true,
    codeChecks: lineCountCheck
  }
];
