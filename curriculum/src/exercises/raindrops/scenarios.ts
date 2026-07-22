import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "plings" as const,
    name: "tasks.plings.name",
    description: "tasks.plings.description",
    hints: [],
    requiredScenarios: ["number-3", "number-27"],
    bonus: false
  },
  {
    id: "plangs" as const,
    name: "tasks.plangs.name",
    description: "tasks.plangs.description",
    hints: [],
    requiredScenarios: ["number-5", "number-3125", "number-15"],
    bonus: false
  },
  {
    id: "plongs" as const,
    name: "tasks.plongs.name",
    description: "tasks.plongs.description",
    hints: [],
    requiredScenarios: ["number-7", "number-21", "number-35", "number-105"],
    bonus: false
  },
  {
    id: "no-sound" as const,
    name: "tasks.noSound.name",
    description: "tasks.noSound.description",
    hints: [],
    requiredScenarios: ["number-8", "number-52"],
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
    slug: "number-3",
    name: "scenarios.number3.name",
    description: "scenarios.number3.description",
    taskId: "plings",
    functionName: "raindrops",
    args: [3],
    expected: "Pling"
  },
  {
    slug: "number-27",
    name: "scenarios.number27.name",
    description: "scenarios.number27.description",
    taskId: "plings",
    functionName: "raindrops",
    args: [27],
    expected: "Pling"
  },
  {
    slug: "number-5",
    name: "scenarios.number5.name",
    description: "scenarios.number5.description",
    taskId: "plangs",
    functionName: "raindrops",
    args: [5],
    expected: "Plang"
  },
  {
    slug: "number-3125",
    name: "scenarios.number3125.name",
    description: "scenarios.number3125.description",
    taskId: "plangs",
    functionName: "raindrops",
    args: [3125],
    expected: "Plang"
  },
  {
    slug: "number-15",
    name: "scenarios.number15.name",
    description: "scenarios.number15.description",
    taskId: "plangs",
    functionName: "raindrops",
    args: [15],
    expected: "PlingPlang"
  },
  {
    slug: "number-7",
    name: "scenarios.number7.name",
    description: "scenarios.number7.description",
    taskId: "plongs",
    functionName: "raindrops",
    args: [7],
    expected: "Plong"
  },
  {
    slug: "number-21",
    name: "scenarios.number21.name",
    description: "scenarios.number21.description",
    taskId: "plongs",
    functionName: "raindrops",
    args: [21],
    expected: "PlingPlong"
  },
  {
    slug: "number-35",
    name: "scenarios.number35.name",
    description: "scenarios.number35.description",
    taskId: "plongs",
    functionName: "raindrops",
    args: [35],
    expected: "PlangPlong"
  },
  {
    slug: "number-105",
    name: "scenarios.number105.name",
    description: "scenarios.number105.description",
    taskId: "plongs",
    functionName: "raindrops",
    args: [105],
    expected: "PlingPlangPlong"
  },
  {
    slug: "number-8",
    name: "scenarios.number8.name",
    description: "scenarios.number8.description",
    taskId: "no-sound",
    functionName: "raindrops",
    args: [8],
    expected: "8"
  },
  {
    slug: "number-52",
    name: "scenarios.number52.name",
    description: "scenarios.number52.description",
    taskId: "no-sound",
    functionName: "raindrops",
    args: [52],
    expected: "52"
  },
  {
    slug: "bonus-1",
    name: "scenarios.bonus1.name",
    description: "scenarios.bonus1.description",
    taskId: "solve-in-sixteen-lines",
    functionName: "raindrops",
    args: [105],
    expected: "PlingPlangPlong",
    codeChecks: [
      {
        pass: (result) => result.assertors.assertMaxLinesOfCode(16),
        errorKey: "checks.moreThanSixteenLines"
      }
    ]
  }
];
