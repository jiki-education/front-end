import type { Task, IOScenario, CodeCheck } from "../types";

// Bonus: require a tight solution. Each language's limit matches its canonical
// solution. Checking membership by hand-rolling a search loop nested inside the
// walk through the queue costs several extra lines, so it overshoots — the
// budget only fits if the membership check is a single expression.
const lineCountCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 6 : language === "jikiscript" ? 17 : 9;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "count-chancers-in-queue" as const,
    name: "tasks.countChancersInQueue.name",
    description: "tasks.countChancersInQueue.description",
    hints: [],
    requiredScenarios: [
      "empty-queue",
      "everyone-chancing-it",
      "everyone-invited",
      "mixed-queue",
      "guests-who-havent-arrived",
      "long-queue-short-list"
    ],
    bonus: false
  },
  {
    id: "solve-tightly" as const,
    name: "tasks.solveTightly.name",
    description: "tasks.solveTightly.description",
    hints: [],
    requiredScenarios: ["guest-list-bonus-line-count"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "empty-queue",
    name: "scenarios.emptyQueue.name",
    description: "scenarios.emptyQueue.description",
    taskId: "count-chancers-in-queue",
    functionName: "num_chancers_in_queue",
    args: [[], ["Jeremy", "Nicole"]],
    expected: 0
  },
  {
    slug: "everyone-chancing-it",
    name: "scenarios.everyoneChancingIt.name",
    description: "scenarios.everyoneChancingIt.description",
    taskId: "count-chancers-in-queue",
    functionName: "num_chancers_in_queue",
    args: [
      ["Frank", "Brian May"],
      ["Jeremy", "Nicole", "Aron"]
    ],
    expected: 2
  },
  {
    slug: "everyone-invited",
    name: "scenarios.everyoneInvited.name",
    description: "scenarios.everyoneInvited.description",
    taskId: "count-chancers-in-queue",
    functionName: "num_chancers_in_queue",
    args: [
      ["Nicole", "Jeremy", "Aron"],
      ["Aron", "Jeremy", "Nicole"]
    ],
    expected: 0
  },
  {
    slug: "mixed-queue",
    name: "scenarios.mixedQueue.name",
    description: "scenarios.mixedQueue.description",
    taskId: "count-chancers-in-queue",
    functionName: "num_chancers_in_queue",
    args: [
      ["Frank", "Nicole", "Aron", "Brian May"],
      ["Jeremy", "Nicole", "Aronson"]
    ],
    expected: 3
  },
  {
    slug: "guests-who-havent-arrived",
    name: "scenarios.guestsWhoHaventArrived.name",
    description: "scenarios.guestsWhoHaventArrived.description",
    taskId: "count-chancers-in-queue",
    functionName: "num_chancers_in_queue",
    args: [
      ["Aron", "Frank"],
      ["Jeremy", "Nicole", "Aron", "Brian May", "Freddie Mercury"]
    ],
    expected: 1
  },
  {
    slug: "long-queue-short-list",
    name: "scenarios.longQueueShortList.name",
    description: "scenarios.longQueueShortList.description",
    taskId: "count-chancers-in-queue",
    functionName: "num_chancers_in_queue",
    args: [
      ["Frank", "Jeremy", "Brian May", "Nicole", "Aron", "Freddie Mercury"],
      ["Nicole", "Jeremy"]
    ],
    expected: 4
  },
  {
    slug: "guest-list-bonus-line-count",
    name: "scenarios.guestListBonusLineCount.name",
    description: "scenarios.guestListBonusLineCount.description",
    taskId: "solve-tightly",
    functionName: "num_chancers_in_queue",
    args: [
      ["Frank", "Nicole", "Aron", "Brian May"],
      ["Jeremy", "Nicole", "Aronson"]
    ],
    expected: 3,
    codeChecks: lineCountCheck
  }
];
