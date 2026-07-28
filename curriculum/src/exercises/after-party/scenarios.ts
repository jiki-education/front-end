import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "look-up-plus-ones" as const,
    name: "tasks.lookUpPlusOnes.name",
    description: "tasks.lookUpPlusOnes.description",
    hints: [],
    requiredScenarios: [
      "empty-list",
      "name-missing",
      "name-present",
      "similar-name",
      "double-barrelled",
      "allowed-nobody",
      "two-brads",
      "cher",
      "cheryl"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-list",
    name: "scenarios.emptyList.name",
    description: "scenarios.emptyList.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [[], [], "Brad"],
    expected: "Not on the list!"
  },
  {
    slug: "name-missing",
    name: "scenarios.nameMissing.name",
    description: "scenarios.nameMissing.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [["Brian May", "Bryn Harrison", "Albert Einstein"], [3, 1, 2], "Brad"],
    expected: "Not on the list!"
  },
  {
    slug: "name-present",
    name: "scenarios.namePresent.name",
    description: "scenarios.namePresent.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [["Brian May", "Brad Pitt", "Albert Einstein"], [3, 5, 1], "Brad"],
    expected: 5
  },
  {
    slug: "similar-name",
    name: "scenarios.similarName.name",
    description: "scenarios.similarName.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [["Brian May", "Bradley Cooper", "Albert Einstein"], [3, 5, 1], "Brad"],
    expected: "Not on the list!"
  },
  {
    slug: "double-barrelled",
    name: "scenarios.doubleBarrelled.name",
    description: "scenarios.doubleBarrelled.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [["Brian May", "Brad Pitt", "Derk-Jan Karrenbeld", "Albert Einstein"], [3, 5, 4, 1], "Derk-Jan"],
    expected: 4
  },
  {
    slug: "allowed-nobody",
    name: "scenarios.allowedNobody.name",
    description: "scenarios.allowedNobody.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [["Brian May", "Brad Pitt", "Albert Einstein"], [3, 0, 1], "Brad"],
    expected: 0
  },
  {
    slug: "two-brads",
    name: "scenarios.twoBrads.name",
    description: "scenarios.twoBrads.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [["Brian May", "Brad Pitt", "Brad Garrett", "Albert Einstein"], [3, 5, 2, 1], "Brad"],
    expected: 5
  },
  {
    slug: "cher",
    name: "scenarios.cher.name",
    description: "scenarios.cher.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [["Brian May", "Brad Pitt", "Cher", "Albert Einstein"], [3, 5, 6, 1], "Cher"],
    expected: 6
  },
  {
    slug: "cheryl",
    name: "scenarios.cheryl.name",
    description: "scenarios.cheryl.description",
    taskId: "look-up-plus-ones",
    functionName: "plus_ones_for",
    args: [["Brian May", "Brad Pitt", "Cher", "Albert Einstein"], [3, 5, 6, 1], "Cheryl"],
    expected: "Not on the list!"
  }
];
