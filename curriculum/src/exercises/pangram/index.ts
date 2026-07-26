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
  // Loop-heavy exercise: hand-written toLowerCase/indexOf/includes helpers scan
  // the alphabet per character. The reference solution peaks at ~1600 iterations
  // on the longest scenario, but valid-if-inefficient approaches run much higher:
  // a no-helper "scan the sentence once per letter" solution hits ~16k, and
  // re-lowercasing inside the 26-letter loop hits ~31k. Cap at 32k so all correct
  // manual solutions pass regardless of structure.
  interpreterOptions: { maxTotalLoopIterations: 32000 }
};

export default exerciseDefinition;
