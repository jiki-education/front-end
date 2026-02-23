import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "find-matching-socks" as const,
    name: "Find Matching Socks",
    description:
      "Write a function that takes two baskets of clothes (as lists of strings) and returns a list of all the pairs of socks found across both baskets. Items that are socks end with ' sock' and always start with 'left ' or 'right '.",
    hints: [
      "Build helper functions first: length(), startsWith(), endsWith()",
      "Create a function to extract only socks from a list",
      "Create a function to switch 'left' and 'right' in a description",
      "Create a function to add an element only if it's not already in the list",
      "Combine all socks from both baskets, then look for matching pairs"
    ],
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
    name: "Empty baskets",
    description: "Both baskets are empty",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [[], []],
    expected: []
  },
  {
    slug: "nothing-clean",
    name: "Nothing clean",
    description: "There's nothing clean",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [[], ["sweater"]],
    expected: []
  },
  {
    slug: "nothing-dirty",
    name: "Nothing dirty",
    description: "There's nothing dirty",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [["left spotty sock"], []],
    expected: []
  },
  {
    slug: "no-socks",
    name: "No socks",
    description: "There are no socks anywhere",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [["blue sweater"], ["green trousers"]],
    expected: []
  },
  {
    slug: "one-in-each",
    name: "One in each",
    description: "There's a matching sock in each basket",
    taskId: "find-matching-socks",
    functionName: "matching_socks",
    args: [["left red sock"], ["right red sock"]],
    expected: ["red socks"]
  },
  {
    slug: "a-big-mix",
    name: "A big mix!",
    description: "A mix of clothes with multiple matching pairs",
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
    name: "Odds and ends",
    description: "A few oddities snuck in",
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
