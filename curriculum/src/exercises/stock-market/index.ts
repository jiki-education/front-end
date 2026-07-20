import "./exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "marketGrowth",
    signature: "marketGrowth(year)",
    description: "functions.marketGrowth.description",
    examples: ["let growth = marketGrowth(2026)"],
    category: "functions.marketGrowth.category"
  },
  {
    name: "reportTax",
    signature: "reportTax(year, balance)",
    description: "functions.reportTax.description",
    examples: ["reportTax(year, money)"],
    category: "functions.reportTax.category"
  },
  {
    name: "announceToFamily",
    signature: "announceToFamily(money)",
    description: "functions.announceToFamily.description",
    examples: ["announceToFamily(money)"],
    category: "functions.announceToFamily.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "variables", "using-functions-with-return-values", "using-functions", "arithmetic"]
};

export default exerciseDefinition;
