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
    "creating-functions-with-return-values",
    "string-iteration",
    "string-indexing",
    "if"
  ],
  // The hand-written toLower helper scans the alphabet per character, so the
  // longest scenarios run ~2000 loop iterations — above the global default of
  // 1000. Raise the cap so valid (if inefficient) manual solutions pass.
  interpreterOptions: { maxTotalLoopIterations: 10000 }
};

export default exerciseDefinition;
