import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-guest-list" as const,
    name: "tasks.checkGuestList.name",
    description: "tasks.checkGuestList.description",
    hints: [],
    requiredScenarios: ["empty-list", "name-missing", "name-present", "similar-name", "double-barrelled"],
    bonus: false
  },
  {
    id: "bonus-single-names" as const,
    name: "tasks.bonusSingleNames.name",
    description: "tasks.bonusSingleNames.description",
    hints: [],
    requiredScenarios: ["cher", "cheryl"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-list",
    name: "scenarios.emptyList.name",
    description: "scenarios.emptyList.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [[], "Brad"],
    expected: false
  },
  {
    slug: "name-missing",
    name: "scenarios.nameMissing.name",
    description: "scenarios.nameMissing.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Bryn Harrison", "Albert Einstein"], "Brad"],
    expected: false
  },
  {
    slug: "name-present",
    name: "scenarios.namePresent.name",
    description: "scenarios.namePresent.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Albert Einstein"], "Brad"],
    expected: true
  },
  {
    slug: "similar-name",
    name: "scenarios.similarName.name",
    description: "scenarios.similarName.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Bradley Cooper", "Albert Einstein"], "Brad"],
    expected: false
  },
  {
    slug: "double-barrelled",
    name: "scenarios.doubleBarrelled.name",
    description: "scenarios.doubleBarrelled.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Derk-Jan Karrenbeld", "Albert Einstein"], "Derk-Jan"],
    expected: true
  },
  {
    slug: "cher",
    name: "scenarios.cher.name",
    description: "scenarios.cher.description",
    taskId: "bonus-single-names",
    functionName: "on_guest_list",
    args: [["Cher", "Brian May", "Brad Pitt", "Albert Einstein"], "Cher"],
    expected: true
  },
  {
    slug: "cheryl",
    name: "scenarios.cheryl.name",
    description: "scenarios.cheryl.description",
    taskId: "bonus-single-names",
    functionName: "on_guest_list",
    args: [["Cher", "Brian May", "Brad Pitt", "Albert Einstein"], "Cheryl"],
    expected: false
  }
];
