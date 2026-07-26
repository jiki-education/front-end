import type { Task, IOScenario, CodeCheck } from "../types";

// Collapsing repeatedly until a single digit remains is an unknown-length loop,
// so require a while loop. A for-with-break or recursion would sidestep the
// concept this exercise exists to teach.
const whileCheck: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertStatement("WhileStatement"),
    errorKey: "checks.mustUseWhile"
  }
];

export const tasks = [
  {
    id: "sum-the-digits" as const,
    name: "tasks.sumTheDigits.name",
    description: "tasks.sumTheDigits.description",
    hints: [],
    requiredScenarios: ["dr-zero", "dr-single-digit", "dr-two-digits", "dr-three-digits"],
    bonus: false
  },
  {
    id: "collapse-to-single-digit" as const,
    name: "tasks.collapseToSingleDigit.name",
    description: "tasks.collapseToSingleDigit.description",
    hints: [],
    requiredScenarios: ["dr-thirty-nine", "dr-two-passes", "dr-large", "dr-nines"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "dr-zero",
    name: "scenarios.drZero.name",
    description: "scenarios.drZero.description",
    taskId: "sum-the-digits",
    functionName: "digital_root",
    args: [0],
    expected: 0
  },
  {
    slug: "dr-single-digit",
    name: "scenarios.drSingleDigit.name",
    description: "scenarios.drSingleDigit.description",
    taskId: "sum-the-digits",
    functionName: "digital_root",
    args: [7],
    expected: 7
  },
  {
    slug: "dr-two-digits",
    name: "scenarios.drTwoDigits.name",
    description: "scenarios.drTwoDigits.description",
    taskId: "sum-the-digits",
    functionName: "digital_root",
    args: [16],
    expected: 7
  },
  {
    slug: "dr-three-digits",
    name: "scenarios.drThreeDigits.name",
    description: "scenarios.drThreeDigits.description",
    taskId: "sum-the-digits",
    functionName: "digital_root",
    args: [132],
    expected: 6
  },
  {
    slug: "dr-thirty-nine",
    name: "scenarios.drThirtyNine.name",
    description: "scenarios.drThirtyNine.description",
    taskId: "collapse-to-single-digit",
    functionName: "digital_root",
    args: [39],
    expected: 3,
    codeChecks: whileCheck
  },
  {
    slug: "dr-two-passes",
    name: "scenarios.drTwoPasses.name",
    description: "scenarios.drTwoPasses.description",
    taskId: "collapse-to-single-digit",
    functionName: "digital_root",
    args: [942],
    expected: 6,
    codeChecks: whileCheck
  },
  {
    slug: "dr-large",
    name: "scenarios.drLarge.name",
    description: "scenarios.drLarge.description",
    taskId: "collapse-to-single-digit",
    functionName: "digital_root",
    args: [493193],
    expected: 2,
    codeChecks: whileCheck
  },
  {
    slug: "dr-nines",
    name: "scenarios.drNines.name",
    description: "scenarios.drNines.description",
    taskId: "collapse-to-single-digit",
    functionName: "digital_root",
    args: [99999],
    expected: 9,
    codeChecks: whileCheck
  }
];
