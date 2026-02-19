import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-pangram" as const,
    name: "Check Pangram",
    description:
      "Write a function that checks if a sentence is a pangram (contains every letter of the alphabet at least once). The check should be case-insensitive.",
    hints: [
      "Write helper functions: contains(), indexOf(), toLower()",
      "Convert the sentence to lowercase first",
      "Iterate through 'abcdefghijklmnopqrstuvwxyz' and check each letter",
      "Return false immediately when you find a missing letter"
    ],
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
    name: "Empty sentence",
    description: "An empty sentence is not a pangram",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: [""],
    expected: false
  },
  {
    slug: "pangram-perfect-lowercase",
    name: "Perfect lowercase",
    description: "A perfect lowercase alphabet is a pangram",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["abcdefghijklmnopqrstuvwxyz"],
    expected: true
  },
  {
    slug: "pangram-only-lowercase",
    name: "Only lowercase",
    description: "A sentence with only lowercase letters covering all letters is a pangram",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["the quick brown fox jumps over the lazy dog"],
    expected: true
  },
  {
    slug: "pangram-missing-x",
    name: "Missing letter 'x'",
    description: "A sentence missing the letter 'x' is not a pangram",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["a quick movement of the enemy will jeopardize five gunboats"],
    expected: false
  },
  {
    slug: "pangram-missing-h",
    name: "Missing letter 'h'",
    description: "A sentence missing the letter 'h' is not a pangram",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["five boxing wizards jump quickly at it"],
    expected: false
  },
  {
    slug: "pangram-missing-a-m",
    name: "Missing letters beyond a-m",
    description: "A string with 'a' to 'm' in lowercase and uppercase is not a pangram",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["abcdefghijklm ABCDEFGHIJKLM"],
    expected: false
  },
  {
    slug: "pangram-with-underscores",
    name: "With underscores",
    description: "A pangram sentence with underscores",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["the_quick_brown_fox_jumps_over_the_lazy_dog"],
    expected: true
  },
  {
    slug: "pangram-with-numbers",
    name: "With numbers",
    description: "A pangram sentence with numbers included",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["the 1 quick brown fox jumps over the 2 lazy dogs"],
    expected: true
  },
  {
    slug: "pangram-numbers-replacing-letters",
    name: "Numbers replacing letters",
    description: "A sentence where letters are replaced by numbers is not a pangram",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["7h3 qu1ck brown fox jumps ov3r 7h3 lazy dog"],
    expected: false
  },
  {
    slug: "pangram-mixed-case-punctuation",
    name: "Mixed case and punctuation",
    description: "A pangram with mixed case and punctuation",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["Five quacking Zephyrs jolt my wax bed."],
    expected: true
  },
  {
    slug: "pangram-case-insensitive",
    name: "Case insensitive missing letters",
    description: "A case-insensitive sentence without all letters is not a pangram",
    taskId: "check-pangram",
    functionName: "is_pangram",
    args: ["the quick brown fox jumps over with lazy FX"],
    expected: false
  }
];
