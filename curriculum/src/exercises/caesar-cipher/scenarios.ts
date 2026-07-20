import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "encode-message" as const,
    name: "tasks.encodeMessage.name",
    description: "tasks.encodeMessage.description",
    hints: [],
    requiredScenarios: [
      "caesar-simple-shift",
      "caesar-shift-by-3",
      "caesar-wrap-around",
      "caesar-with-spaces",
      "caesar-rot13"
    ],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "caesar-simple-shift",
    name: "scenarios.caesarSimpleShift.name",
    description: "scenarios.caesarSimpleShift.description",
    taskId: "encode-message",
    functionName: "encode",
    args: ["abc", 1],
    expected: "bcd"
  },
  {
    slug: "caesar-shift-by-3",
    name: "scenarios.caesarShiftBy3.name",
    description: "scenarios.caesarShiftBy3.description",
    taskId: "encode-message",
    functionName: "encode",
    args: ["hello", 3],
    expected: "khoor"
  },
  {
    slug: "caesar-wrap-around",
    name: "scenarios.caesarWrapAround.name",
    description: "scenarios.caesarWrapAround.description",
    taskId: "encode-message",
    functionName: "encode",
    args: ["xyz", 3],
    expected: "abc"
  },
  {
    slug: "caesar-with-spaces",
    name: "scenarios.caesarWithSpaces.name",
    description: "scenarios.caesarWithSpaces.description",
    taskId: "encode-message",
    functionName: "encode",
    args: ["hello world", 5],
    expected: "mjqqt btwqi"
  },
  {
    slug: "caesar-rot13",
    name: "scenarios.caesarRot13.name",
    description: "scenarios.caesarRot13.description",
    taskId: "encode-message",
    functionName: "encode",
    args: ["attack at dawn", 13],
    expected: "nggnpx ng qnja"
  }
];
