import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "numberToString",
    signature: "numberToString(number)",
    description: "functions.numberToString.description",
    examples: ['numberToString(42) returns "42"'],
    category: "functions.numberToString.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["string-iteration", "string-indexing", "if", "using-functions-with-return-values"]
};

export default exerciseDefinition;
