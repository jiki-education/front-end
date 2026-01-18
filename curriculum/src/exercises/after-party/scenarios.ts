import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-guest-list" as const,
    name: "Check the Guest List",
    description:
      "Write a function that checks if a person is on the guest list by their first name. A person is on the list if any name on the list starts with their first name (followed by a space or end of string).",
    hints: [
      "Create a helper function to calculate the length of a string",
      "Create a helper function to check if a string starts with another string",
      "Remember to handle the case where the first name matches the entire name (like 'Cher')",
      "Also handle hyphenated names like 'Derk-Jan'"
    ],
    requiredScenarios: ["empty-list", "name-missing", "name-present", "similar-name", "double-barrelled"],
    bonus: false
  },
  {
    id: "bonus-single-names" as const,
    name: "Single Name Celebrities",
    description:
      "Handle celebrities who only have one name, like Cher. Make sure not to accidentally match partial names.",
    hints: [
      "A single name celebrity should match exactly or as a first name",
      "Be careful not to match 'Cher' with 'Cheryl'"
    ],
    requiredScenarios: ["cher", "cheryl"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-list",
    name: "Empty register",
    description: "No-one's allowed in when the list is empty",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [[], "Brad"],
    expected: false
  },
  {
    slug: "name-missing",
    name: "Brad's turned away",
    description: "The name's not on the list",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Bryn Harrison", "Albert Einstein"], "Brad"],
    expected: false
  },
  {
    slug: "name-present",
    name: "Brad's allowed in",
    description: "The name's on the list",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Albert Einstein"], "Brad"],
    expected: true
  },
  {
    slug: "similar-name",
    name: "Close, but nope",
    description: "The name isn't on the list - Bradley is not Brad",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Bradley Cooper", "Albert Einstein"], "Brad"],
    expected: false
  },
  {
    slug: "double-barrelled",
    name: "A dutchman",
    description: "The name's on the list, but it's hyphenated",
    taskId: "check-guest-list",
    functionName: "on_guest_list",
    args: [["Brian May", "Brad Pitt", "Derk-Jan Karrenbeld", "Albert Einstein"], "Derk-Jan"],
    expected: true
  },
  {
    slug: "cher",
    name: "Cher's in town",
    description: "Some people only have one name",
    taskId: "bonus-single-names",
    functionName: "on_guest_list",
    args: [["Cher", "Brian May", "Brad Pitt", "Albert Einstein"], "Cher"],
    expected: true
  },
  {
    slug: "cheryl",
    name: "Getting tough now",
    description: "Are Cheryl Crow and Cher friends? Doesn't matter - Cheryl is not Cher",
    taskId: "bonus-single-names",
    functionName: "on_guest_list",
    args: [["Cher", "Brian May", "Brad Pitt", "Albert Einstein"], "Cheryl"],
    expected: false
  }
];
