import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "check-the-name" as const,
    name: "tasks.checkTheName.name",
    description: "tasks.checkTheName.description",
    hints: [],
    requiredScenarios: [
      "sarah-s-party",
      "brad-s-party",
      "bradley-brad-party",
      "brian-brad-party",
      "silence",
      "cher-cher-party"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "sarah-s-party",
    name: "scenarios.sarahSParty.name",
    description: "scenarios.sarahSParty.description",
    taskId: "check-the-name",
    functionName: "handle_guest",
    args: ["Sarah", "S"],
    expected: true
  },
  {
    slug: "brad-s-party",
    name: "scenarios.bradSParty.name",
    description: "scenarios.bradSParty.description",
    taskId: "check-the-name",
    functionName: "handle_guest",
    args: ["Brad", "S"],
    expected: false
  },
  {
    slug: "bradley-brad-party",
    name: "scenarios.bradleyBradParty.name",
    description: "scenarios.bradleyBradParty.description",
    taskId: "check-the-name",
    functionName: "handle_guest",
    args: ["Bradley", "Brad"],
    expected: true
  },
  {
    slug: "brian-brad-party",
    name: "scenarios.brianBradParty.name",
    description: "scenarios.brianBradParty.description",
    taskId: "check-the-name",
    functionName: "handle_guest",
    args: ["Brian", "Brad"],
    expected: false
  },
  {
    slug: "silence",
    name: "scenarios.silence.name",
    description: "scenarios.silence.description",
    taskId: "check-the-name",
    functionName: "handle_guest",
    args: ["", "S"],
    expected: false
  },
  {
    slug: "cher-cher-party",
    name: "scenarios.cherCherParty.name",
    description: "scenarios.cherCherParty.description",
    taskId: "check-the-name",
    functionName: "handle_guest",
    args: ["Cher", "Cher"],
    expected: true
  }
];
