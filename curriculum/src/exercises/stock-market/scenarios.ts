import type { Task, VisualScenario } from "../types";
import type StockMarketExercise from "./Exercise";

export const tasks = [
  {
    id: "grow-investment" as const,
    name: "Grow your investment over 20 years",
    description:
      "Start with $10, simulate 20 years of stock market growth using Math.randomInt(), and check your final balance.",
    hints: [
      "Start with a variable set to 10 for your balance",
      "Use a repeat loop for 20 years",
      "Each year, generate a random rate from 0 to 10 using Math.randomInt(0, 10)",
      "Calculate the growth: multiply your balance by the rate, then divide by 100",
      "Add the growth to your balance",
      "After the loop, call checkBalance() with your final amount"
    ],
    requiredScenarios: ["twenty-years"],
    bonus: false
  }
] as const satisfies readonly Task[];

function mulberry32(seed: number): () => number {
  let state = seed | 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function getExpectedBalance(seed: number): number {
  const rng = mulberry32(seed);
  const randomInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  let balance = 10;
  for (let i = 0; i < 20; i++) {
    const rate = randomInt(0, 10);
    const growth = (balance * rate) / 100;
    balance = balance + growth;
  }
  return balance;
}

export const scenarios: VisualScenario[] = [
  {
    slug: "twenty-years",
    name: "20 years of growth",
    description: "Invest $10 and check the balance after 20 years of random growth.",
    taskId: "grow-investment",
    randomSeed: 42,
    expectations(exercise) {
      const ex = exercise as StockMarketExercise;
      const expectedBalance = getExpectedBalance(42);
      return [
        {
          pass: ex.balanceChecked === true,
          errorHtml: "You didn't check your balance. Make sure you call <code>checkBalance()</code> after the loop."
        },
        {
          pass: ex.reportedBalance !== undefined && Math.abs(ex.reportedBalance - expectedBalance) < 0.001,
          errorHtml: `Expected a balance of approximately $${expectedBalance.toFixed(2)} but got $${ex.reportedBalance?.toFixed(2) ?? "nothing"}. Make sure you're calculating growth correctly: multiply your current balance by the rate, divide by 100, then add that to your balance.`
        }
      ];
    }
  }
];
