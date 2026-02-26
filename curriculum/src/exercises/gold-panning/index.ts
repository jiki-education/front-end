import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "pan",
    signature: "pan()",
    description: "Dips your pan in the river and **gives back** the number of gold nuggets found.",
    examples: ["let found = pan()"],
    category: "Mining"
  },
  {
    name: "sell",
    signature: "sell(nuggets)",
    description: "Sells your gold nuggets at the trading post.",
    examples: ["sell(nuggets)"],
    category: "Action"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
