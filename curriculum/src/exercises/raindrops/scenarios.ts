import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "plings" as const,
    name: "Plings",
    description: 'Start off by getting the Pling sounds right. If the number is divisible by 3, return "Pling".',
    hints: [],
    requiredScenarios: ["number-3", "number-27"],
    bonus: false
  },
  {
    id: "plangs" as const,
    name: "Plangs",
    description:
      'Now get the Plang sounds right. If the number is divisible by 5, add "Plang" to the result. If it\'s divisible by both 3 and 5, return "PlingPlang".',
    hints: [],
    requiredScenarios: ["number-5", "number-3125", "number-15"],
    bonus: false
  },
  {
    id: "plongs" as const,
    name: "Plongs",
    description:
      'Now get the Plong sounds right. If the number is divisible by 7, add "Plong" to the result. Numbers can be divisible by multiple factors.',
    hints: [],
    requiredScenarios: ["number-7", "number-21", "number-35", "number-105"],
    bonus: false
  },
  {
    id: "no-sound" as const,
    name: "Numbers with no raindrop sound",
    description:
      "Finally, if the number is not divisible by 3, 5, or 7, return the number itself as a string. Use numberToString() to convert the number.",
    hints: [],
    requiredScenarios: ["number-8", "number-52"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "number-3",
    name: "Number 3",
    description: 'If 3 is input, return "Pling"',
    taskId: "plings",
    functionName: "raindrops",
    args: [3],
    expected: "Pling"
  },
  {
    slug: "number-27",
    name: "Number 27",
    description: 'If 27 is input, return "Pling"',
    taskId: "plings",
    functionName: "raindrops",
    args: [27],
    expected: "Pling"
  },
  {
    slug: "number-5",
    name: "Number 5",
    description: 'If 5 is input, return "Plang"',
    taskId: "plangs",
    functionName: "raindrops",
    args: [5],
    expected: "Plang"
  },
  {
    slug: "number-3125",
    name: "Number 3125",
    description: 'If 3125 is input, return "Plang"',
    taskId: "plangs",
    functionName: "raindrops",
    args: [3125],
    expected: "Plang"
  },
  {
    slug: "number-15",
    name: "Number 15",
    description: 'If 15 is input, return "PlingPlang"',
    taskId: "plangs",
    functionName: "raindrops",
    args: [15],
    expected: "PlingPlang"
  },
  {
    slug: "number-7",
    name: "Number 7",
    description: 'If 7 is input, return "Plong"',
    taskId: "plongs",
    functionName: "raindrops",
    args: [7],
    expected: "Plong"
  },
  {
    slug: "number-21",
    name: "Number 21",
    description: 'If 21 is input, return "PlingPlong"',
    taskId: "plongs",
    functionName: "raindrops",
    args: [21],
    expected: "PlingPlong"
  },
  {
    slug: "number-35",
    name: "Number 35",
    description: 'If 35 is input, return "PlangPlong"',
    taskId: "plongs",
    functionName: "raindrops",
    args: [35],
    expected: "PlangPlong"
  },
  {
    slug: "number-105",
    name: "Number 105",
    description: 'If 105 is input, return "PlingPlangPlong"',
    taskId: "plongs",
    functionName: "raindrops",
    args: [105],
    expected: "PlingPlangPlong"
  },
  {
    slug: "number-8",
    name: "Number 8",
    description: 'If 8 is input, return "8"',
    taskId: "no-sound",
    functionName: "raindrops",
    args: [8],
    expected: "8"
  },
  {
    slug: "number-52",
    name: "Number 52",
    description: 'If 52 is input, return "52"',
    taskId: "no-sound",
    functionName: "raindrops",
    args: [52],
    expected: "52"
  }
];
