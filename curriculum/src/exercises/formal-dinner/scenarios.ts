import type { Task, IOScenario, CodeCheck } from "../types";

// Bonus: require a tight solution. Each language's limit matches its canonical
// solution. Hand-rolling the surname extraction or the suffix comparison instead
// of leaning on the string methods this level unlocks costs several extra lines,
// so it overshoots the budget.
const lineCountCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 6 : language === "jikiscript" ? 45 : 9;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "find-guest-table" as const,
    name: "tasks.findGuestTable.name",
    description: "tasks.findGuestTable.description",
    hints: [],
    requiredScenarios: [
      "empty-list",
      "name-missing",
      "name-present",
      "different-honorific",
      "bond-seated",
      "bond-not-seated",
      "partial-surname",
      "lloyd-webber",
      "mark-webber"
    ],
    bonus: false
  },
  {
    id: "solve-tightly" as const,
    name: "tasks.solveTightly.name",
    description: "tasks.solveTightly.description",
    hints: [],
    requiredScenarios: ["formal-dinner-bonus-line-count"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-list",
    name: "scenarios.emptyList.name",
    description: "scenarios.emptyList.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [[], [], "Mr Pitt"],
    expected: "No table found"
  },
  {
    slug: "name-missing",
    name: "scenarios.nameMissing.name",
    description: "scenarios.nameMissing.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [["Brian May", "Albert Einstein", "James Watt"], ["Willow", "Hawthorn", "Cedar"], "Mr Pitt"],
    expected: "No table found"
  },
  {
    slug: "name-present",
    name: "scenarios.namePresent.name",
    description: "scenarios.namePresent.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [["Brad Pitt", "Brian May", "Albert Einstein"], ["Juniper", "Willow", "Hawthorn"], "Mr Pitt"],
    expected: "Juniper"
  },
  {
    slug: "different-honorific",
    name: "scenarios.differentHonorific.name",
    description: "scenarios.differentHonorific.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [
      ["Bradley Cooper", "Grace Hopper", "Arthur Conan Doyle", "Albert Einstein", "Ada Lovelace"],
      ["Rose", "Fern", "Cedar", "Willow", "Thistle"],
      "Lord Doyle"
    ],
    expected: "Cedar"
  },
  {
    slug: "bond-seated",
    name: "scenarios.bondSeated.name",
    description: "scenarios.bondSeated.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [["Jason Bourne", "Ethan Hunt", "James Bond"], ["Larch", "Rowan", "Bramble"], "Mr Bond"],
    expected: "Bramble"
  },
  {
    slug: "bond-not-seated",
    name: "scenarios.bondNotSeated.name",
    description: "scenarios.bondNotSeated.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [["Jason Bourne"], ["Larch"], "Dr Bond"],
    expected: "No table found"
  },
  {
    slug: "partial-surname",
    name: "scenarios.partialSurname.name",
    description: "scenarios.partialSurname.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [["Brian May", "Ada Spitt", "Hugo Ross-Pitt"], ["Willow", "Foxglove", "Hawthorn"], "Mr Pitt"],
    expected: "No table found"
  },
  {
    slug: "lloyd-webber",
    name: "scenarios.lloydWebber.name",
    description: "scenarios.lloydWebber.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [
      ["Brian May", "Brad Pitt", "Albert Einstein", "Andrew Lloyd Webber"],
      ["Willow", "Juniper", "Hawthorn", "Foxglove"],
      "Baron Lloyd Webber"
    ],
    expected: "Foxglove"
  },
  {
    slug: "mark-webber",
    name: "scenarios.markWebber.name",
    description: "scenarios.markWebber.description",
    taskId: "find-guest-table",
    functionName: "table_for",
    args: [
      ["Brian May", "Brad Pitt", "Albert Einstein", "Mark Webber"],
      ["Willow", "Juniper", "Hawthorn", "Foxglove"],
      "Baron Lloyd Webber"
    ],
    expected: "No table found"
  },
  {
    slug: "formal-dinner-bonus-line-count",
    name: "scenarios.formalDinnerBonusLineCount.name",
    description: "scenarios.formalDinnerBonusLineCount.description",
    taskId: "solve-tightly",
    functionName: "table_for",
    args: [
      ["Bradley Cooper", "Grace Hopper", "Arthur Conan Doyle", "Albert Einstein", "Ada Lovelace"],
      ["Rose", "Fern", "Cedar", "Willow", "Thistle"],
      "Lord Doyle"
    ],
    expected: "Cedar",
    codeChecks: lineCountCheck
  }
];
