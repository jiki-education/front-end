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
  conceptSlugs: ["string-iteration", "if", "creating-functions-with-return-values", "creating-functions"]
};

export default exerciseDefinition;
