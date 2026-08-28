import type { Task, IOScenario, CodeCheck } from "../types";

const sixteenLinesCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 13 : 16;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "pack-lunchbox" as const,
    name: "tasks.packLunchbox.name",
    description: "tasks.packLunchbox.description",
    hints: [],
    requiredScenarios: ["empty-lunchbox", "everything-fits", "pack-the-most", "just-the-snack", "nothing-fits"],
    bonus: false
  },
  {
    id: "solve-in-sixteen-lines" as const,
    name: "tasks.solveInSixteenLines.name",
    description: "tasks.solveInSixteenLines.description",
    hints: [],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-lunchbox",
    name: "scenarios.emptyLunchbox.name",
    description: "scenarios.emptyLunchbox.description",
    taskId: "pack-lunchbox",
    functionName: "pack_lunch",
    args: [[], 10],
    expected: [[], []]
  },
  {
    slug: "everything-fits",
    name: "scenarios.everythingFits.name",
    description: "scenarios.everythingFits.description",
    taskId: "pack-lunchbox",
    functionName: "pack_lunch",
    args: [
      [
        ["Sandwich", 4],
        ["Cookies", 2],
        ["Grapes", 1]
      ],
      10
    ],
    expected: [["Grapes", "Cookies", "Sandwich"], []]
  },
  {
    slug: "pack-the-most",
    name: "scenarios.packTheMost.name",
    description: "scenarios.packTheMost.description",
    taskId: "pack-lunchbox",
    functionName: "pack_lunch",
    args: [
      [
        ["Water bottle", 6],
        ["Papaya", 5],
        ["Sandwich", 3],
        ["Cookies", 2],
        ["Grapes", 1]
      ],
      6
    ],
    expected: [
      ["Grapes", "Cookies", "Sandwich"],
      ["Papaya", "Water bottle"]
    ]
  },
  {
    slug: "just-the-snack",
    name: "scenarios.justTheSnack.name",
    description: "scenarios.justTheSnack.description",
    taskId: "pack-lunchbox",
    functionName: "pack_lunch",
    args: [
      [
        ["Sandwich", 4],
        ["Cookies", 2],
        ["Grapes", 1]
      ],
      1
    ],
    expected: [["Grapes"], ["Cookies", "Sandwich"]]
  },
  {
    slug: "nothing-fits",
    name: "scenarios.nothingFits.name",
    description: "scenarios.nothingFits.description",
    taskId: "pack-lunchbox",
    functionName: "pack_lunch",
    args: [
      [
        ["Water bottle", 5],
        ["Sandwich", 4]
      ],
      3
    ],
    expected: [[], ["Sandwich", "Water bottle"]]
  },
  {
    slug: "bonus-1",
    name: "scenarios.bonus1.name",
    description: "scenarios.bonus1.description",
    taskId: "solve-in-sixteen-lines",
    functionName: "pack_lunch",
    args: [
      [
        ["Water bottle", 6],
        ["Papaya", 5],
        ["Sandwich", 3],
        ["Cookies", 2],
        ["Grapes", 1]
      ],
      6
    ],
    expected: [
      ["Grapes", "Cookies", "Sandwich"],
      ["Papaya", "Water bottle"]
    ],
    codeChecks: sixteenLinesCheck
  }
];
