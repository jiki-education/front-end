import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "pan",
    signature: "pan()",
    description: "functions.pan.description",
    examples: ["let found = pan()"],
    category: "functions.pan.category"
  },
  {
    name: "sell",
    signature: "sell(numberOfNuggets)",
    description: "functions.sell.description",
    examples: ["sell(numberOfNuggets)"],
    category: "functions.sell.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["using-functions-with-return-values", "repeat", "variables"]
};

export default exerciseDefinition;
