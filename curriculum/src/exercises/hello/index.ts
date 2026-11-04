import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import { progressionMetrics } from "./progressionMetrics";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  progressionMetrics,
  functions,
  conceptSlugs: [
    "creating-functions",
    "creating-functions-with-inputs",
    "string-concatenation",
    "string-templates",
    "creating-functions-with-return-values"
  ]
};

export default exerciseDefinition;
