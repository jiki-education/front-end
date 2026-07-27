import type { Task, IOScenario, CodeCheck } from "../types";

// Bonus: reward pulling the letter-testing and case-swapping into helpers that
// `acronym` reuses. The reference decomposition lands on exactly these counts,
// so a student who inlines or duplicates the alphabet scans will overshoot.
const lineCountCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 33 : language === "jikiscript" ? 44 : 46;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "create-acronym-function" as const,
    name: "tasks.createAcronymFunction.name",
    description: "tasks.createAcronymFunction.description",
    hints: [],
    requiredScenarios: [
      "png",
      "ror",
      "gimp",
      "first-word-only",
      "hyphenated",
      "fifo",
      "punctuation",
      "hc",
      "simufta",
      "trnt",
      "long",
      "emoji"
    ],
    bonus: false
  },
  {
    id: "solve-tightly" as const,
    name: "tasks.solveTightly.name",
    description: "tasks.solveTightly.description",
    hints: [],
    requiredScenarios: ["acronym-bonus-line-count"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "png",
    name: "scenarios.png.name",
    description: "scenarios.png.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable Network Graphics"],
    expected: "PNG"
  },
  {
    slug: "ror",
    name: "scenarios.ror.name",
    description: "scenarios.ror.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Ruby on Rails"],
    expected: "ROR"
  },
  {
    slug: "gimp",
    name: "scenarios.gimp.name",
    description: "scenarios.gimp.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["GNU Image Manipulation Program"],
    expected: "GIMP"
  },
  {
    slug: "first-word-only",
    name: "scenarios.firstWordOnly.name",
    description: "scenarios.firstWordOnly.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["HyperText"],
    expected: "H"
  },
  {
    slug: "hyphenated",
    name: "scenarios.hyphenated.name",
    description: "scenarios.hyphenated.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Complementary metal-oxide semiconductor"],
    expected: "CMOS"
  },
  {
    slug: "fifo",
    name: "scenarios.fifo.name",
    description: "scenarios.fifo.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["First In, First Out"],
    expected: "FIFO"
  },
  {
    slug: "punctuation",
    name: "scenarios.punctuation.name",
    description: "scenarios.punctuation.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Portable, HyperText, Transmitter"],
    expected: "PHT"
  },
  {
    slug: "hc",
    name: "scenarios.hc.name",
    description: "scenarios.hc.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Halley's Comet"],
    expected: "HC"
  },
  {
    slug: "simufta",
    name: "scenarios.simufta.name",
    description: "scenarios.simufta.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Something - I made up from thin air"],
    expected: "SIMUFTA"
  },
  {
    slug: "trnt",
    name: "scenarios.trnt.name",
    description: "scenarios.trnt.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["The Road _Not_ Taken"],
    expected: "TRNT"
  },
  {
    slug: "long",
    name: "scenarios.long.name",
    description: "scenarios.long.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Rolling On The Floor Laughing So Hard That My Dogs Came Over And Licked Me"],
    expected: "ROTFLSHTMDCOALM"
  },
  {
    slug: "emoji",
    name: "scenarios.emoji.name",
    description: "scenarios.emoji.description",
    taskId: "create-acronym-function",
    functionName: "acronym",
    args: ["Hello 👋 World"],
    expected: "HW"
  },
  {
    slug: "acronym-bonus-line-count",
    name: "scenarios.acronymBonusLineCount.name",
    description: "scenarios.acronymBonusLineCount.description",
    taskId: "solve-tightly",
    functionName: "acronym",
    args: ["Andrew Lloyd Webber"],
    expected: "ALW",
    codeChecks: lineCountCheck
  }
];
