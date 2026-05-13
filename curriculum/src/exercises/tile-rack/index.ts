import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "numberToString",
    signature: "numberToString(number)",
    description: "Convert a number to its string representation (provided by level stdlib)",
    examples: ['numberToString(42) returns "42"'],
    category: "Type Conversion"
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
