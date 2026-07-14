import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import { progression } from "./progression";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  progression,
  functions,
  conceptSlugs: ["creating-functions", "modulo", "if", "creating-functions-with-return-values"]
};

export default exerciseDefinition;
