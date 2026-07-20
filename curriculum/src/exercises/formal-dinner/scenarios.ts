import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-formal-guest-list" as const,
    name: "tasks.checkFormalGuestList.name",
    description: "tasks.checkFormalGuestList.description",
    hints: [],
    requiredScenarios: [
      "empty-list",
      "name-missing",
      "name-present",
      "different-honorific",
      "bond-allowed",
      "bond-not-allowed"
    ],
    bonus: false
  },
  {
    id: "bonus-multi-word-surname" as const,
    name: "tasks.bonusMultiWordSurname.name",
    description: "tasks.bonusMultiWordSurname.description",
    hints: [],
    requiredScenarios: ["lloyd-webber", "mark-webber"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-list",
    name: "scenarios.emptyList.name",
    description: "scenarios.emptyList.description",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [[], "Mr Pitt"],
    expected: false
  },
  {
    slug: "name-missing",
    name: "scenarios.nameMissing.name",
    description: "scenarios.nameMissing.description",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Albert Einstein", "James Watt"], "Mr Pitt"],
    expected: false
  },
  {
    slug: "name-present",
    name: "scenarios.namePresent.name",
    description: "scenarios.namePresent.description",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Albert Einstein"], "Mr Pitt"],
    expected: true
  },
  {
    slug: "different-honorific",
    name: "scenarios.differentHonorific.name",
    description: "scenarios.differentHonorific.description",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["Arthur Conan Doyle", "Bradley Cooper", "Albert Einstein"], "Lord Doyle"],
    expected: true
  },
  {
    slug: "bond-allowed",
    name: "scenarios.bondAllowed.name",
    description: "scenarios.bondAllowed.description",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["James Bond"], "Mr Bond"],
    expected: true
  },
  {
    slug: "bond-not-allowed",
    name: "scenarios.bondNotAllowed.name",
    description: "scenarios.bondNotAllowed.description",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["Jason Bourne"], "Dr Bond"],
    expected: false
  },
  {
    slug: "lloyd-webber",
    name: "scenarios.lloydWebber.name",
    description: "scenarios.lloydWebber.description",
    taskId: "bonus-multi-word-surname",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Albert Einstein", "Andrew Lloyd Webber"], "Baron Lloyd Webber"],
    expected: true
  },
  {
    slug: "mark-webber",
    name: "scenarios.markWebber.name",
    description: "scenarios.markWebber.description",
    taskId: "bonus-multi-word-surname",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Albert Einstein", "Mark Webber"], "Baron Lloyd Webber"],
    expected: false
  }
];
