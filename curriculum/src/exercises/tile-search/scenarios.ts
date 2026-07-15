import type { Task, IOScenario, CodeCheck } from "../types";

const eightLinesCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 5 : 8;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorHtml: "Your solution has too many lines of code. Can you make it shorter?"
  }
];

export const tasks = [
  {
    id: "search-for-tile" as const,
    name: "Search for a Tile",
    description:
      "Write a function that checks whether a specific letter tile is in the rack. Return true if found, false if not.",
    hints: [],
    requiredScenarios: [
      "letter-found-at-start",
      "letter-found-in-middle",
      "letter-found-at-end",
      "letter-not-found",
      "empty-rack",
      "duplicate-letters",
      "single-tile-found",
      "single-tile-not-found"
    ],
    bonus: false
  },
  {
    id: "solve-in-eight-lines" as const,
    name: "Solve in 8 lines of code",
    description: "Can you solve this exercise with only 8 lines of code?",
    hints: [],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "letter-found-at-start",
    name: "Letter at the start",
    description: "The letter is the first tile in the rack.",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R"], "S"],
    expected: true
  },
  {
    slug: "letter-found-in-middle",
    name: "Letter in the middle",
    description: "The letter is in the middle of the rack.",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R", "A", "B"], "R"],
    expected: true
  },
  {
    slug: "letter-found-at-end",
    name: "Letter at the end",
    description: "The letter is the last tile in the rack.",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R"], "R"],
    expected: true
  },
  {
    slug: "letter-not-found",
    name: "Letter not found",
    description: "The letter isn't in the rack.",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R", "A", "B"], "Z"],
    expected: false
  },
  {
    slug: "empty-rack",
    name: "Empty rack",
    description: "An empty rack has no tiles to find.",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [[], "A"],
    expected: false
  },
  {
    slug: "duplicate-letters",
    name: "Rack with duplicates",
    description: "The letter appears among duplicate tiles.",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["A", "B", "A", "N", "A"], "N"],
    expected: true
  },
  {
    slug: "single-tile-found",
    name: "Single tile found",
    description: "A rack with one tile that matches.",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["Q"], "Q"],
    expected: true
  },
  {
    slug: "single-tile-not-found",
    name: "Single tile not found",
    description: "A rack with one tile that doesn't match.",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["Q"], "X"],
    expected: false
  },
  {
    slug: "bonus-1",
    name: "8 lines of code",
    description: "Solve the exercise with only 8 lines of code.",
    taskId: "solve-in-eight-lines",
    functionName: "contains",
    args: [["S", "C", "R", "A", "B"], "A"],
    expected: true,
    codeChecks: eightLinesCheck
  }
];
