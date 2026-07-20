import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "determine-leap-year" as const,
    name: "tasks.determineLeapYear.name",
    description: "tasks.determineLeapYear.description",
    hints: [],
    requiredScenarios: [
      "year-2015",
      "year-1970",
      "year-2100",
      "year-1900",
      "year-1800",
      "year-2000",
      "year-2400",
      "year-1996",
      "year-1960"
    ],
    bonus: false
  },
  {
    id: "solve-in-one-line" as const,
    name: "tasks.solveInOneLine.name",
    description: "tasks.solveInOneLine.description",
    hints: [],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "year-2015",
    name: "scenarios.year2015.name",
    description: "scenarios.year2015.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [2015],
    expected: false
  },
  {
    slug: "year-1970",
    name: "scenarios.year1970.name",
    description: "scenarios.year1970.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1970],
    expected: false
  },
  {
    slug: "year-2100",
    name: "scenarios.year2100.name",
    description: "scenarios.year2100.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [2100],
    expected: false
  },
  {
    slug: "year-1900",
    name: "scenarios.year1900.name",
    description: "scenarios.year1900.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1900],
    expected: false
  },
  {
    slug: "year-1800",
    name: "scenarios.year1800.name",
    description: "scenarios.year1800.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1800],
    expected: false
  },
  {
    slug: "year-2000",
    name: "scenarios.year2000.name",
    description: "scenarios.year2000.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [2000],
    expected: true
  },
  {
    slug: "year-2400",
    name: "scenarios.year2400.name",
    description: "scenarios.year2400.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [2400],
    expected: true
  },
  {
    slug: "year-1996",
    name: "scenarios.year1996.name",
    description: "scenarios.year1996.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1996],
    expected: true
  },
  {
    slug: "year-1960",
    name: "scenarios.year1960.name",
    description: "scenarios.year1960.description",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1960],
    expected: true
  },
  {
    slug: "bonus-1",
    name: "scenarios.bonus1.name",
    description: "scenarios.bonus1.description",
    taskId: "solve-in-one-line",
    functionName: "is_leap_year",
    args: [2000],
    expected: true,
    codeChecks: [
      {
        pass: (result, language) => {
          const limit = language === "python" ? 2 : 3;
          return result.assertors.assertMaxLinesOfCode(limit);
        },
        errorKey: "checks.moreThanOneLine"
      }
    ]
  }
];
