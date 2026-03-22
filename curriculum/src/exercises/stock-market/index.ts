import "./exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "marketGrowth",
    signature: "marketGrowth(year)",
    description:
      "Returns the market growth percentage for a given year (between -25 and 40). You'll need to **increase** the amount of money you have by this number each time. (So 40 means that your $10 should be worth $14, and -10 means your $10 goes down to $9)",
    examples: ["let growth = marketGrowth(2026)"],
    category: "Action"
  },
  {
    name: "reportTax",
    signature: "reportTax(year, balance)",
    description:
      "Reports your tax for a given year. You should call this every year, with the year and the current amount of money you have.",
    examples: ["reportTax(year, money)"],
    category: "Action"
  },
  {
    name: "announceToFamily",
    signature: "announceToFamily(money)",
    description: "Announces your final balance to your family.",
    examples: ["announceToFamily(money)"],
    category: "Action"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "variables", "return-values", "using-functions", "arithmetic"]
};

export default exerciseDefinition;
