import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-guest-list" as const,
    name: "tasks.checkGuestList.name",
    description: "tasks.checkGuestList.description",
    hints: [],
    requiredScenarios: ["name-single-list-true", "name-single-list-false", "name-list-true", "name-list-false"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "name-single-list-true",
    name: "scenarios.nameSingleListTrue.name",
    description: "scenarios.nameSingleListTrue.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Jeremy"], "Jeremy"],
    expected: true
  },
  {
    slug: "name-single-list-false",
    name: "scenarios.nameSingleListFalse.name",
    description: "scenarios.nameSingleListFalse.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Nicole"], "Jeremy"],
    expected: false
  },
  {
    slug: "name-list-true",
    name: "scenarios.nameListTrue.name",
    description: "scenarios.nameListTrue.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Aron", "Jeremy", "Nicole"], "Jeremy"],
    expected: true
  },
  {
    slug: "name-list-false",
    name: "scenarios.nameListFalse.name",
    description: "scenarios.nameListFalse.description",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Aron", "Frank", "Nicole"], "Jeremy"],
    expected: false
  }
];
