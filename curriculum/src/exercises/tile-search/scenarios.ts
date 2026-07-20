import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "search-for-tile" as const,
    name: "tasks.searchForTile.name",
    description: "tasks.searchForTile.description",
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
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "letter-found-at-start",
    name: "scenarios.letterFoundAtStart.name",
    description: "scenarios.letterFoundAtStart.description",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R"], "S"],
    expected: true
  },
  {
    slug: "letter-found-in-middle",
    name: "scenarios.letterFoundInMiddle.name",
    description: "scenarios.letterFoundInMiddle.description",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R", "A", "B"], "R"],
    expected: true
  },
  {
    slug: "letter-found-at-end",
    name: "scenarios.letterFoundAtEnd.name",
    description: "scenarios.letterFoundAtEnd.description",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R"], "R"],
    expected: true
  },
  {
    slug: "letter-not-found",
    name: "scenarios.letterNotFound.name",
    description: "scenarios.letterNotFound.description",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["S", "C", "R", "A", "B"], "Z"],
    expected: false
  },
  {
    slug: "empty-rack",
    name: "scenarios.emptyRack.name",
    description: "scenarios.emptyRack.description",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [[], "A"],
    expected: false
  },
  {
    slug: "duplicate-letters",
    name: "scenarios.duplicateLetters.name",
    description: "scenarios.duplicateLetters.description",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["A", "B", "A", "N", "A"], "N"],
    expected: true
  },
  {
    slug: "single-tile-found",
    name: "scenarios.singleTileFound.name",
    description: "scenarios.singleTileFound.description",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["Q"], "Q"],
    expected: true
  },
  {
    slug: "single-tile-not-found",
    name: "scenarios.singleTileNotFound.name",
    description: "scenarios.singleTileNotFound.description",
    taskId: "search-for-tile",
    functionName: "contains",
    args: [["Q"], "X"],
    expected: false
  }
];
