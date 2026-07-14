import type { Task, VisualScenario } from "../types";
import type StockMarketExercise from "./Exercise";

export const tasks = [
  {
    id: "grow-investment" as const,
    name: "Grow your investment over 20 years",
    description:
      "Start with $10, simulate 20 years of stock market growth, report to the taxman each year, and announce the final balance to your family.",
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
    name: "20 years of growth",
    description: "Invest $10 and track your balance over 20 years of market growth.",
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
          errorHtml: `Expected 20 tax reports (one per year) but got ${ex.taxReports.length}. Make sure you call <code>reportTax()</code> inside the loop.`
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
            errorHtml: `Tax report #${i + 1} was for year ${actual.year} but should have been for year ${expected.year}.`
          });
        } else if (!balMatch) {
          expectations.push({
            pass: false,
            errorHtml: `You reported the wrong tax for ${expected.year}. It should have been $${expected.balance.toFixed(2)} but was $${actual.balance.toFixed(2)}.`
          });
        } else {
          expectations.push({ pass: true, errorHtml: "" });
        }
      }

      expectations.push({
        pass: ex.announcedBalance !== undefined && ex.announcedBalance.toFixed(2) === expectedBalance.toFixed(2),
        errorHtml: `Expected a final balance of approximately $${expectedBalance.toFixed(2)} but got $${ex.announcedBalance?.toFixed(2) ?? "nothing"}. Make sure you call <code>announceToFamily()</code> after the loop.`
      });

      expectations.push({
        pass: ex.announceCount === 1,
        errorHtml: `You should only announce to your family <strong>once</strong>, after the 20 years are up, not every year. You called <code>announceToFamily()</code> ${ex.announceCount} ${ex.announceCount === 1 ? "time" : "times"}.`
      });

      return expectations;
    }
  }
];
