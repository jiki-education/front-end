import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "includes",
    signature: "[...].includes(item)",
    description: "functions.includes.description",
    examples: ['["Aron", "Nicole"].includes("Nicole") → true', '["Aron", "Nicole"].includes("Frank") → false'],
    category: "functions.includes.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "for-loops", "methods", "if", "updating-variables", "using-functions-with-return-values"]
};

export default exerciseDefinition;
