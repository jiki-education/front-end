import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import { progressionMetrics } from "./progressionMetrics";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  progressionMetrics,
  conceptSlugs: [
    "creating-functions-with-inputs",
    "creating-functions-with-return-values",
    "string-indexing",
    "string-iteration",
    "repeat",
    "if"
  ]
};

export default exerciseDefinition;
