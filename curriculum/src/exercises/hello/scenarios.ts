import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "create-say-hello-function" as const,
    name: "Create say_hello function",
    description: "Write a say_hello function that takes a name and returns a greeting in the format 'Hello, [name]!'.",
    hints: [
      "Use concatenate() to join the parts together",
      'The greeting has three parts: "Hello, ", the name, and "!"'
    ],
    requiredScenarios: ["hello-aiko", "hello-priya", "hello-mei"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "hello-aiko",
    name: "Greet Aiko",
    description: "Return 'Hello, Aiko!'",
    taskId: "create-say-hello-function",
    functionName: "say_hello",
    args: ["Aiko"],
    expected: "Hello, Aiko!"
  },
  {
    slug: "hello-priya",
    name: "Greet Priya",
    description: "Return 'Hello, Priya!'",
    taskId: "create-say-hello-function",
    functionName: "say_hello",
    args: ["Priya"],
    expected: "Hello, Priya!"
  },
  {
    slug: "hello-mei",
    name: "Greet Mei",
    description: "Return 'Hello, Mei!'",
    taskId: "create-say-hello-function",
    functionName: "say_hello",
    args: ["Mei"],
    expected: "Hello, Mei!"
  }
];
