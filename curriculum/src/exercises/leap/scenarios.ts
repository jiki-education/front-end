import type { Task, IOScenario } from "../types";

export const tasks = [
  {
    id: "determine-leap-year" as const,
    name: "Determine if the year is a leap year",
    description:
      "Write a function called isLeapYear that takes a year as its input and returns true if it is a leap year, or false if it is not.",
    hints: [
      "A year divisible by 4 is a leap year",
      "But a year divisible by 100 is NOT a leap year",
      "Unless it is also divisible by 400, in which case it IS a leap year",
      "Use the remainder operator (%) to check divisibility"
    ],
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
    name: "Solve in one line of code",
    description: "Can you solve this with only one line of code within the function?",
    hints: ["You can combine all the conditions into a single return statement using && and ||"],
    requiredScenarios: ["bonus-1"],
    bonus: true
  }
] as const satisfies readonly Task[];

export const scenarios: IOScenario[] = [
  {
    slug: "year-2015",
    name: "Year 2015",
    description: "2015 is not divisible by 4 so is not a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [2015],
    expected: false
  },
  {
    slug: "year-1970",
    name: "Year 1970",
    description: "1970 is not divisible by 4 so is not a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1970],
    expected: false
  },
  {
    slug: "year-2100",
    name: "Year 2100",
    description: "2100 is divisible by 100 but not by 400 so is not a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [2100],
    expected: false
  },
  {
    slug: "year-1900",
    name: "Year 1900",
    description: "1900 is divisible by 100 but not by 400 so is not a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1900],
    expected: false
  },
  {
    slug: "year-1800",
    name: "Year 1800",
    description: "1800 is divisible by 200 but not by 400 so is not a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1800],
    expected: false
  },
  {
    slug: "year-2000",
    name: "Year 2000",
    description: "2000 is divisible by 400 so is a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [2000],
    expected: true
  },
  {
    slug: "year-2400",
    name: "Year 2400",
    description: "2400 is divisible by 400 so is a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [2400],
    expected: true
  },
  {
    slug: "year-1996",
    name: "Year 1996",
    description: "1996 is divisible by 4 but not by 100 so is a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1996],
    expected: true
  },
  {
    slug: "year-1960",
    name: "Year 1960",
    description: "1960 is divisible by 4 so is a leap year",
    taskId: "determine-leap-year",
    functionName: "is_leap_year",
    args: [1960],
    expected: true
  },
  {
    slug: "bonus-1",
    name: "One line of code",
    description: "Solve the exercise with only one line of code within the function",
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
        errorHtml: "You used more than one line of code within the function."
      }
    ]
  }
];
