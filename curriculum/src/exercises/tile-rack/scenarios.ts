import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "find-tile-position" as const,
    name: "tasks.findTilePosition.name",
    description: "tasks.findTilePosition.description",
    hints: [],
    requiredScenarios: [
      "tile-at-start",
      "tile-in-middle",
      "tile-at-end",
      "tile-not-found",
      "empty-rack",
      "first-of-duplicates",
      "longer-rack"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "tile-at-start",
    name: "scenarios.tileAtStart.name",
    description: "scenarios.tileAtStart.description",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["ABCDE", "A"],
    expected: "Move to position 0"
  },
  {
    slug: "tile-in-middle",
    name: "scenarios.tileInMiddle.name",
    description: "scenarios.tileInMiddle.description",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["ABCDE", "C"],
    expected: "Move to position 2"
  },
  {
    slug: "tile-at-end",
    name: "scenarios.tileAtEnd.name",
    description: "scenarios.tileAtEnd.description",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["ABCDE", "E"],
    expected: "Move to position 4"
  },
  {
    slug: "tile-not-found",
    name: "scenarios.tileNotFound.name",
    description: "scenarios.tileNotFound.description",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["ABCDE", "Z"],
    expected: "Error: Tile not on rack"
  },
  {
    slug: "empty-rack",
    name: "scenarios.emptyRack.name",
    description: "scenarios.emptyRack.description",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["", "A"],
    expected: "Error: Tile not on rack"
  },
  {
    slug: "first-of-duplicates",
    name: "scenarios.firstOfDuplicates.name",
    description: "scenarios.firstOfDuplicates.description",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["BANANA", "A"],
    expected: "Move to position 1"
  },
  {
    slug: "longer-rack",
    name: "scenarios.longerRack.name",
    description: "scenarios.longerRack.description",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["SCRABBLE", "B"],
    expected: "Move to position 4"
  }
];
