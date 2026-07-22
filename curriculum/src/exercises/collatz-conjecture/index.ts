import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["creating-functions", "modulo", "if", "repeat", "creating-functions-with-return-values"],
  interpreterOptions: { maxTotalLoopIterations: 200 }
};

export default exerciseDefinition;
