import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "can-fit-in" as const,
    name: "tasks.canFitIn.name",
    description: "tasks.canFitIn.description",
    hints: [],
    requiredScenarios: [
      "empty-queue",
      "empty-queue-but-no-time",
      "busy-day-no-time",
      "busy-day-but-time",
      "still-early",
      "cutting-it-fine"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-queue",
    name: "scenarios.emptyQueue.name",
    description: "scenarios.emptyQueue.description",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [[], "Bob", 30],
    expected: true
  },
  {
    slug: "empty-queue-but-no-time",
    name: "scenarios.emptyQueueButNoTime.name",
    description: "scenarios.emptyQueueButNoTime.description",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [[], "Shave and Polish", 5],
    expected: false
  },
  {
    slug: "busy-day-no-time",
    name: "scenarios.busyDayNoTime.name",
    description: "scenarios.busyDayNoTime.description",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [["Mohawk", "Slicked-Back Pixie", "Bob", "Shave and Polish", "Afro Trim", "Up-do"], "Mohawk", 90],
    expected: false
  },
  {
    slug: "busy-day-but-time",
    name: "scenarios.busyDayButTime.name",
    description: "scenarios.busyDayButTime.description",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [
      ["Mohawk", "Slicked-Back Pixie", "Afro Trim", "Shave and Polish", "Slicked-Back Pixie", "Up-do"],
      "Mohawk",
      160
    ],
    expected: true
  },
  {
    slug: "still-early",
    name: "scenarios.stillEarly.name",
    description: "scenarios.stillEarly.description",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [["Afro Trim", "Shave and Polish", "Mohawk", "Slicked-Back Pixie", "Up-do", "Up-do"], "Mohawk", 240],
    expected: true
  },
  {
    slug: "cutting-it-fine",
    name: "scenarios.cuttingItFine.name",
    description: "scenarios.cuttingItFine.description",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [["Mohawk"], "Mohawk", 45],
    expected: true
  }
];
