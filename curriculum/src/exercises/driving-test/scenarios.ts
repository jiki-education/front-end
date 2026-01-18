import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "did-they-pass" as const,
    name: "Did They Pass?",
    description:
      "Write a function that analyzes driving test marks and determines if the student passed. A student fails if they have any major faults (💥) or 5 or more minor faults (❌).",
    hints: [
      "Loop through each character in the marks string",
      "If you see a 💥, return false immediately - one major fails",
      "Count how many ❌ you encounter",
      "At the end, return true only if minors < 5"
    ],
    requiredScenarios: ["perfect-marks", "dangerous", "one-big-mistake", "scraped-through", "one-mistake-too-many"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "perfect-marks",
    name: "The perfect student!",
    description: "They did everything right - wow!",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅✅"],
    expected: true
  },
  {
    slug: "dangerous",
    name: "Danger to society",
    description: "We can't let this one on the road!",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅💥💥✅✅✅💥💥✅✅✅❌✅❌✅✅❌❌✅"],
    expected: false
  },
  {
    slug: "one-big-mistake",
    name: "One big mistake",
    description: "One big mistake is all it takes to fail!",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅✅✅✅✅✅✅✅💥✅✅✅✅✅✅✅✅✅✅"],
    expected: false
  },
  {
    slug: "scraped-through",
    name: "Scraped through",
    description: "They cut it close but they passed!",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅✅❌✅✅✅❌✅✅✅❌️✅✅✅✅✅❌️✅✅"],
    expected: true
  },
  {
    slug: "one-mistake-too-many",
    name: "One mistake too many!",
    description: "All those little errors added up",
    taskId: "did-they-pass",
    functionName: "did_they_pass",
    args: ["✅✅✅❌✅✅✅❌✅✅✅❌️✅✅✅✅✅❌️❌️✅"],
    expected: false
  }
];
