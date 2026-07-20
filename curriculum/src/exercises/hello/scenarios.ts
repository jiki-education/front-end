import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-say-hello-function" as const,
    name: "tasks.createSayHelloFunction.name",
    description: "tasks.createSayHelloFunction.description",
    hints: [],
    requiredScenarios: ["hello-aiko", "hello-priya", "hello-mei"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "hello-aiko",
    name: "scenarios.helloAiko.name",
    description: "scenarios.helloAiko.description",
    taskId: "create-say-hello-function",
    functionName: "say_hello",
    args: ["Aiko"],
    expected: "Hello, Aiko!"
  },
  {
    slug: "hello-priya",
    name: "scenarios.helloPriya.name",
    description: "scenarios.helloPriya.description",
    taskId: "create-say-hello-function",
    functionName: "say_hello",
    args: ["Priya"],
    expected: "Hello, Priya!"
  },
  {
    slug: "hello-mei",
    name: "scenarios.helloMei.name",
    description: "scenarios.helloMei.description",
    taskId: "create-say-hello-function",
    functionName: "say_hello",
    args: ["Mei"],
    expected: "Hello, Mei!"
  }
];
