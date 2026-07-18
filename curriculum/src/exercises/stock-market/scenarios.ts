import type { Task, VisualScenario } from "../types";
import type StockMarketExercise from "./Exercise";

export const tasks = [
  {
    id: "grow-investment" as const,
    name: "tasks.growInvestment.name",
    description: "tasks.growInvestment.description",
    hints: [],
    requiredScenarios: ["twenty-years"],
    bonus: false
  }
] as const satisfies readonly Task[];

function currentYear(): number {
  return new Date().getFullYear();
}

function generateGrowthRates(startYear: number): Record<number, number> {
  const rates: Record<number, number> = {};
  for (let year = startYear; year < startYear + 20; year++) {
    rates[year] = Math.floor(Math.random() * 66) - 25; // -25 to 40
  }
  return rates;
}

// Plain float arithmetic in the same order as the reference solution
// (money = money * (100 + rate) / 100). The interpreter no longer rounds
// each operation to 5dp, so the model must not either: per-op rounding
// error compounds over 20 years and can cross a cent boundary for some
// rate sequences, falsely failing correct solutions. The toFixed(2)
// comparison in the expectations provides the tolerance for students
// whose operation order differs slightly.
function getExpectedBalance(startYear: number, rates: Record<number, number>): number {
  let money = 10;
  for (let year = startYear; year < startYear + 20; year++) {
    money = (money * (100 + rates[year])) / 100;
  }
  return money;
}

function getExpectedTaxReports(startYear: number, rates: Record<number, number>): { year: number; balance: number }[] {
  const reports: { year: number; balance: number }[] = [];
  let money = 10;
  for (let year = startYear; year < startYear + 20; year++) {
    money = (money * (100 + rates[year])) / 100;
    reports.push({ year, balance: money });
  }
  return reports;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "twenty-years",
    name: "scenarios.twentyYears.name",
    description: "scenarios.twentyYears.description",
    taskId: "grow-investment",
    setup(exercise) {
      const startYear = currentYear();
      const rates = generateGrowthRates(startYear);
      (exercise as StockMarketExercise).setupGrowthRates(startYear, rates);
    },
    expectations(exercise) {
      const ex = exercise as StockMarketExercise;
      const expectedReports = getExpectedTaxReports(ex.startYear, ex.initialGrowthRates);
      const expectedBalance = getExpectedBalance(ex.startYear, ex.initialGrowthRates);

      const expectations = [
        {
          pass: ex.taxReports.length === 20,
          errorHtml: exercise.t("checks.taxReportCount", { got: ex.taxReports.length })
        }
      ];

      // Per-year tax report checks
      for (let i = 0; i < expectedReports.length; i++) {
        const actual = ex.taxReports[i] as { year: number; balance: number } | undefined;
        const expected = expectedReports[i];
        if (actual === undefined) continue;

        const yearMatch = actual.year === expected.year;
        const balMatch = actual.balance.toFixed(2) === expected.balance.toFixed(2);

        if (!yearMatch) {
          expectations.push({
            pass: false,
            errorHtml: exercise.t("checks.taxReportWrongYear", {
              index: i + 1,
              actualYear: actual.year,
              expectedYear: expected.year
            })
          });
        } else if (!balMatch) {
          expectations.push({
            pass: false,
            errorHtml: exercise.t("checks.taxReportWrongBalance", {
              year: expected.year,
              expected: expected.balance.toFixed(2),
              actual: actual.balance.toFixed(2)
            })
          });
        } else {
          expectations.push({ pass: true, errorHtml: "" });
        }
      }

      expectations.push({
        pass: ex.announcedBalance !== undefined && ex.announcedBalance.toFixed(2) === expectedBalance.toFixed(2),
        errorHtml: exercise.t("checks.wrongFinalBalance", {
          expected: expectedBalance.toFixed(2),
          got: ex.announcedBalance?.toFixed(2) ?? "nothing"
        })
      });

      expectations.push({
        pass: ex.announceCount === 1,
        errorHtml: exercise.t("checks.announcedMultipleTimes", {
          count: ex.announceCount,
          times: ex.announceCount === 1 ? "time" : "times"
        })
      });

      return expectations;
    }
  }
];
