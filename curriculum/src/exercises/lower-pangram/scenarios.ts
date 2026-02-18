import type { Task, IOScenario, CodeCheck } from "../types";

const codeChecks: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("includes"),
    errorHtml: "You should call your <code>includes</code> function inside <code>is_pangram</code>."
  }
];

export const tasks = [
  {
    id: "check-lower-pangram" as const,
    name: "Check Lower Pangram",
    description:
      "Write an includes function and an is_pangram function. The is_pangram function should use includes to check whether a lowercase sentence contains every letter of the alphabet.",
    hints: [
      "Write the includes function first — loop through each character and compare",
      "In is_pangram, loop through each letter of the alphabet and check if it's in the sentence",
      "Return false as soon as you find a missing letter"
    ],
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
    name: "Empty sentence",
    description: "An empty sentence is not a pangram",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: [""],
    expected: false,
    codeChecks
  },
  {
    slug: "lower-pangram-full-alphabet",
    name: "Full lowercase alphabet",
    description: "The complete lowercase alphabet is a pangram",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["abcdefghijklmnopqrstuvwxyz"],
    expected: true,
    codeChecks
  },
  {
    slug: "lower-pangram-classic",
    name: "Classic pangram",
    description: "The classic pangram sentence contains all 26 letters",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the quick brown fox jumps over the lazy dog"],
    expected: true,
    codeChecks
  },
  {
    slug: "lower-pangram-missing-x",
    name: "Missing letter 'x'",
    description: "A sentence missing the letter 'x' is not a pangram",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["a quick movement of the enemy will jeopardize five gunboats"],
    expected: false,
    codeChecks
  },
  {
    slug: "lower-pangram-missing-h",
    name: "Missing letter 'h'",
    description: "A sentence missing the letter 'h' is not a pangram",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["five boxing wizards jump quickly at it"],
    expected: false,
    codeChecks
  },
  {
    slug: "lower-pangram-with-underscores",
    name: "With underscores",
    description: "A pangram with underscores instead of spaces",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the_quick_brown_fox_jumps_over_the_lazy_dog"],
    expected: true,
    codeChecks
  },
  {
    slug: "lower-pangram-with-numbers",
    name: "With numbers",
    description: "A pangram with numbers included",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["the 1 quick brown fox jumps over the 2 lazy dogs"],
    expected: true,
    codeChecks
  },
  {
    slug: "lower-pangram-numbers-replacing-letters",
    name: "Numbers replacing letters",
    description: "A sentence where letters are replaced by numbers is not a pangram",
    taskId: "check-lower-pangram",
    functionName: "is_pangram",
    args: ["7h3 qu1ck brown fox jumps ov3r 7h3 lazy dog"],
    expected: false,
    codeChecks
  }
];
