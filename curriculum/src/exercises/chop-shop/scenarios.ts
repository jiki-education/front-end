import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "can-fit-in" as const,
    name: "Can You Fit Them In?",
    description:
      "Write a function that determines if a new customer can be served before closing time, given the current queue and time remaining.",
    hints: [
      "Create a helper function to look up how long each haircut takes",
      "Use a list of [name, time] pairs to store the haircut durations",
      "Loop through the queue and subtract each haircut time from the remaining minutes",
      "Check if there's enough time left for the requested haircut"
    ],
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
    name: "No one in the queue",
    description: "No-one in the queue, plenty of time",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [[], "Bob", 30],
    expected: true
  },
  {
    slug: "empty-queue-but-no-time",
    name: "Late in the day",
    description: "No-one in the queue but not enough time",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [[], "Shave and Polish", 5],
    expected: false
  },
  {
    slug: "busy-day-no-time",
    name: "A full day",
    description: "A full queue and not enough time",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [["Mohawk", "Slicked-Back Pixie", "Bob", "Shave and Polish", "Afro Trim", "Up-do"], "Mohawk", 90],
    expected: false
  },
  {
    slug: "busy-day-but-time",
    name: "Just squeezes in",
    description: "A full day but there's just enough time",
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
    name: "Still early",
    description: "It's still early in the day",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [["Afro Trim", "Shave and Polish", "Mohawk", "Slicked-Back Pixie", "Up-do", "Up-do"], "Mohawk", 240],
    expected: true
  },
  {
    slug: "cutting-it-fine",
    name: "Just in time",
    description: "They've made it just in time!",
    taskId: "can-fit-in",
    functionName: "can_fit_in",
    args: [["Mohawk"], "Mohawk", 45],
    expected: true
  }
];
