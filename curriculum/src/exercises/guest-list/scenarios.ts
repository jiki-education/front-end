import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-guest-list" as const,
    name: "Check the Guest List",
    description:
      "Write a function that checks if a person's name is on the guest list. Return true if they are, false if they aren't.",
    hints: [
      "Loop through each name in the list",
      "Compare each name to the person you're looking for",
      "If you find a match, return true",
      "If you finish the loop without finding a match, return false"
    ],
    requiredScenarios: ["name-single-list-true", "name-single-list-false", "name-list-true", "name-list-false"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "name-single-list-true",
    name: "Person is on a single person list",
    description: "Return true if a person is on the guest list",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Jeremy"], "Jeremy"],
    expected: true
  },
  {
    slug: "name-single-list-false",
    name: "Person is not on a single person list",
    description: "Return false if a person is not on the guest list",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Nicole"], "Jeremy"],
    expected: false
  },
  {
    slug: "name-list-true",
    name: "Person is on a larger list",
    description: "Return true if a person is on a larger guest list",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Aron", "Jeremy", "Nicole"], "Jeremy"],
    expected: true
  },
  {
    slug: "name-list-false",
    name: "Person is not on a larger list",
    description: "Return false if a person is not on a larger guest list",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Aron", "Frank", "Nicole"], "Jeremy"],
    expected: false
  }
];
