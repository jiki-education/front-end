import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-two-fer-function" as const,
    name: "Create two-fer function",
    description:
      "Write a twoFer function that takes a name and returns 'One for [name], one for me.' If no name is given (empty string), use 'you' instead of the name.",
    hints: [
      "Check if the name is an empty string",
      "Use concatenate() to build the result",
      "Return the full sentence with the correct name"
    ],
    requiredScenarios: ["two-fer-default", "two-fer-alice", "two-fer-tom"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "two-fer-default",
    name: "No name given",
    description: "No name is given so return 'One for you, one for me.'",
    taskId: "create-two-fer-function",
    functionName: "two_fer",
    args: [""],
    expected: "One for you, one for me."
  },
  {
    slug: "two-fer-alice",
    name: "Name given as Alice",
    description: "Her name is 'Alice' so return 'One for Alice, one for me.'",
    taskId: "create-two-fer-function",
    functionName: "two_fer",
    args: ["Alice"],
    expected: "One for Alice, one for me."
  },
  {
    slug: "two-fer-tom",
    name: "Name given as Tom",
    description: "His name is 'Tom' so return 'One for Tom, one for me.'",
    taskId: "create-two-fer-function",
    functionName: "two_fer",
    args: ["Tom"],
    expected: "One for Tom, one for me."
  }
];
