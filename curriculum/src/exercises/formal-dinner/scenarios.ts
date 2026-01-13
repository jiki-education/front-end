import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-formal-guest-list" as const,
    name: "Check the Formal Guest List",
    description:
      "Write a function that checks if a person is on the guest list by their surname. Given an honorific and surname (e.g., 'Mr Pitt'), check if any name on the list ends with that surname.",
    hints: [
      "Create a helper function to calculate string length",
      "Create an ends_with helper to check if a string ends with another string",
      "Remove the honorific (everything before the first space) to get just the surname",
      "Check if any name on the list ends with the surname"
    ],
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
    name: "Multi-word Surnames",
    description: "Handle surnames that have multiple words, like 'Lloyd Webber'.",
    hints: ["The surname is everything after the honorific (first word)", "Be careful not to match partial surnames"],
    requiredScenarios: ["lloyd-webber", "mark-webber"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-list",
    name: "Empty register",
    description: "No-one's allowed in when the list is empty",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [[], "Mr Pitt"],
    expected: false
  },
  {
    slug: "name-missing",
    name: "Brad's turned away",
    description: "The name's not on the list",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Albert Einstein", "James Watt"], "Mr Pitt"],
    expected: false
  },
  {
    slug: "name-present",
    name: "Brad's allowed in",
    description: "The name's on the list (Brad Pitt matches Mr Pitt)",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Albert Einstein"], "Mr Pitt"],
    expected: true
  },
  {
    slug: "different-honorific",
    name: "Knight of the realm",
    description: "Handle a different honorific (Lord Doyle matches Arthur Conan Doyle)",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["Arthur Conan Doyle", "Bradley Cooper", "Albert Einstein"], "Lord Doyle"],
    expected: true
  },
  {
    slug: "bond-allowed",
    name: "Mr Bond, I presume",
    description: "James Bond is on the list",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["James Bond"], "Mr Bond"],
    expected: true
  },
  {
    slug: "bond-not-allowed",
    name: "Hmmm.. Mr Bond, I presume",
    description: "Only Jason Bourne on the list, not James Bond",
    taskId: "check-formal-guest-list",
    functionName: "on_guest_list",
    args: [["Jason Bourne"], "Dr Bond"],
    expected: false
  },
  {
    slug: "lloyd-webber",
    name: "How about a Baron?",
    description: "Baron Lloyd Webber has two words in his surname",
    taskId: "bonus-multi-word-surname",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Albert Einstein", "Andrew Lloyd Webber"], "Baron Lloyd Webber"],
    expected: true
  },
  {
    slug: "mark-webber",
    name: "Is Mark the Baron?",
    description: "A different Webber doesn't count - surname must match fully",
    taskId: "bonus-multi-word-surname",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Albert Einstein", "Mark Webber"], "Baron Lloyd Webber"],
    expected: false
  }
];
