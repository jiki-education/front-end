import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "search-for-tile" as const,
    name: "Search for a Tile",
    description:
      "Write a function that checks whether a specific letter tile is in the rack. Return true if found, false if not.",
    hints: [
      "Loop through each element in the haystack",
      "Compare each element to the needle",
      "Return true as soon as you find a match",
      "Only return false after checking every element"
    ],
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
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "letter-found-at-start",
    name: "Letter at the start",
    description: "The letter is the first tile in the rack",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R"], "S"],
    expected: true
  },
  {
    slug: "letter-found-in-middle",
    name: "Letter in the middle",
    description: "The letter is in the middle of the rack",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R", "A", "B"], "R"],
    expected: true
  },
  {
    slug: "letter-found-at-end",
    name: "Letter at the end",
    description: "The letter is the last tile in the rack",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R"], "R"],
    expected: true
  },
  {
    slug: "letter-not-found",
    name: "Letter not found",
    description: "The letter isn't in the rack",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R", "A", "B"], "Z"],
    expected: false
  },
  {
    slug: "empty-rack",
    name: "Empty rack",
    description: "An empty rack has no tiles to find",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [[], "A"],
    expected: false
  },
  {
    slug: "duplicate-letters",
    name: "Rack with duplicates",
    description: "The letter appears among duplicate tiles",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["A", "B", "A", "N", "A"], "N"],
    expected: true
  },
  {
    slug: "single-tile-found",
    name: "Single tile found",
    description: "A rack with one tile that matches",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["Q"], "Q"],
    expected: true
  },
  {
    slug: "single-tile-not-found",
    name: "Single tile not found",
    description: "A rack with one tile that doesn't match",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["Q"], "X"],
    expected: false
  }
];
