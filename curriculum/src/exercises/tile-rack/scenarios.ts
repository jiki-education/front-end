import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "find-tile-position" as const,
    name: "Find Tile Position",
    description:
      "Write a function that finds the position of a specific letter tile in the rack. Return -1 if the tile isn't there.",
    hints: [
      "Track your position with a variable that starts at 0",
      "Loop through each tile and compare it to the letter you're looking for",
      "Return the position as soon as you find a match",
      "Increment the position after checking each tile"
    ],
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
    name: "Tile at start",
    description: "The letter is the first tile in the rack",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["ABCDE", "A"],
    expected: 0
  },
  {
    slug: "tile-in-middle",
    name: "Tile in middle",
    description: "The letter is in the middle of the rack",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["ABCDE", "C"],
    expected: 2
  },
  {
    slug: "tile-at-end",
    name: "Tile at end",
    description: "The letter is the last tile in the rack",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["ABCDE", "E"],
    expected: 4
  },
  {
    slug: "tile-not-found",
    name: "Tile not found",
    description: "The letter isn't in the rack",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["ABCDE", "Z"],
    expected: -1
  },
  {
    slug: "empty-rack",
    name: "Empty rack",
    description: "An empty rack has no tiles to find",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["", "A"],
    expected: -1
  },
  {
    slug: "first-of-duplicates",
    name: "First of duplicates",
    description: "When the letter appears multiple times, return the first position",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["BANANA", "A"],
    expected: 1
  },
  {
    slug: "longer-rack",
    name: "Longer rack",
    description: "Finding a tile in a longer rack",
    taskId: "find-tile-position",
    functionName: "find_tile",
    args: ["SCRABBLE", "B"],
    expected: 4
  }
];
