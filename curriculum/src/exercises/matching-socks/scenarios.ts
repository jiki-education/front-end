import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "find-matching-socks" as const,
    name: "tasks.findMatchingSocks.name",
    description: "tasks.findMatchingSocks.description",
    hints: [],
    requiredScenarios: [
      "empty-baskets",
      "nothing-clean",
      "nothing-dirty",
      "no-socks",
      "one-in-each",
      "a-big-mix",
      "some-added-pain"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-baskets",
    name: "scenarios.emptyBaskets.name",
    description: "scenarios.emptyBaskets.description",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [[], []],
    expected: []
  },
  {
    slug: "nothing-clean",
    name: "scenarios.nothingClean.name",
    description: "scenarios.nothingClean.description",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [[], ["sweater"]],
    expected: []
  },
  {
    slug: "nothing-dirty",
    name: "scenarios.nothingDirty.name",
    description: "scenarios.nothingDirty.description",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [["left spotty sock"], []],
    expected: []
  },
  {
    slug: "no-socks",
    name: "scenarios.noSocks.name",
    description: "scenarios.noSocks.description",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [["blue sweater"], ["green trousers"]],
    expected: []
  },
  {
    slug: "one-in-each",
    name: "scenarios.oneInEach.name",
    description: "scenarios.oneInEach.description",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [["left red sock"], ["right red sock"]],
    expected: ["red socks"]
  },
  {
    slug: "a-big-mix",
    name: "scenarios.aBigMix.name",
    description: "scenarios.aBigMix.description",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [
      ["left red sock", "right green sock", "sweater", "right red sock", "left blue sock"],
      ["right blue sock", "right red sock", "left spotty sock", "right spotty sock"]
    ],
    expected: ["red socks", "blue socks", "spotty socks"],
    matcher: "toEqual"
  },
  {
    slug: "some-added-pain",
    name: "scenarios.someAddedPain.name",
    description: "scenarios.someAddedPain.description",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [
      [
        "left red sock",
        "right pink sock",
        "left brown shoe",
        "sweater",
        "leftover fabric",
        "right blue sock",
        "left blue sock",
        "left green sock",
        "right spotty sock",
        "left spotty sock",
        "left green trainer"
      ],
      ["left blue sock", "right red sock", "right green trainer", "right brown shoe", "left green sock"]
    ],
    expected: ["red socks", "blue socks", "spotty socks"],
    matcher: "toEqual"
  }
];
