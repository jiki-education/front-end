import type { Task, IOScenario, CodeCheck } from "../types";

// Require using continue to move past a character that has already been
// classified, rather than nesting further conditions.
const continueCheck: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertStatement("ContinueStatement"),
    errorKey: "checks.mustUseContinue"
  }
];

// Require the three helper functions from the instructions to each be defined
// and actually used (called somewhere other than their own body), rather than
// collapsing everything into a single inline pass.
const helpersCheck: CodeCheck[] = [
  {
    pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("is_alpha"),
    errorKey: "checks.useIsAlpha"
  },
  {
    pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("is_numeric"),
    errorKey: "checks.useIsNumeric"
  },
  {
    pass: (result) => result.assertors.assertFunctionCalledOutsideOwnDefinition("is_alphanumeric"),
    errorKey: "checks.useIsAlphanumeric"
  }
];

// Require a tight solution. Each language's limit matches its canonical solution.
const locCheck: CodeCheck[] = [
  {
    pass: (result, language) => {
      const limit = language === "python" ? 35 : language === "jikiscript" ? 50 : 42;
      return result.assertors.assertMaxLinesOfCode(limit);
    },
    errorKey: "checks.tooManyLines"
  }
];

export const tasks = [
  {
    id: "classify-string" as const,
    name: "tasks.classifyString.name",
    description: "tasks.classifyString.description",
    hints: [],
    requiredScenarios: ["duck", "number", "alphanumeric", "not-alphanumeric-1", "not-alphanumeric-2"],
    bonus: false
  },
  {
    id: "use-continue" as const,
    name: "tasks.useContinue.name",
    description: "tasks.useContinue.description",
    hints: [],
    requiredScenarios: ["alphanumeric-uses-continue"],
    bonus: false
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "duck",
    name: "scenarios.duck.name",
    description: "scenarios.duck.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["Duck"],
    expected: "Alpha"
  },
  {
    slug: "number",
    name: "scenarios.number.name",
    description: "scenarios.number.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["42"],
    expected: "Numeric"
  },
  {
    slug: "alphanumeric",
    name: "scenarios.alphanumeric.name",
    description: "scenarios.alphanumeric.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["Duck42"],
    expected: "Alphanumeric"
  },
  {
    slug: "not-alphanumeric-1",
    name: "scenarios.notAlphanumeric1.name",
    description: "scenarios.notAlphanumeric1.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["It's not 42!"],
    expected: "Unknown"
  },
  {
    slug: "not-alphanumeric-2",
    name: "scenarios.notAlphanumeric2.name",
    description: "scenarios.notAlphanumeric2.description",
    taskId: "classify-string",
    functionName: "what_am_i",
    args: ["42 Rubber Duck!"],
    expected: "Unknown",
    codeChecks: [...helpersCheck, ...locCheck]
  },
  {
    slug: "alphanumeric-uses-continue",
    name: "scenarios.alphanumericUsesContinue.name",
    description: "scenarios.alphanumericUsesContinue.description",
    taskId: "use-continue",
    functionName: "what_am_i",
    args: ["Duck42"],
    expected: "Alphanumeric",
    codeChecks: continueCheck
  }
];
