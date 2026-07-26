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
  conceptSlugs: [
    "function-composition",
    "creating-functions",
    "string-iteration",
    "creating-functions-with-return-values"
  ],
  // The intended lowercase-only solution peaks at ~600 iterations, but a student
  // may over-engineer this first exercise with the full case-handling approach
  // used later in the series (~2200+ iterations). Match the rest of the pangram
  // series' cap so any correct manual solution passes.
  interpreterOptions: { maxTotalLoopIterations: 32000 }
};

export default exerciseDefinition;
