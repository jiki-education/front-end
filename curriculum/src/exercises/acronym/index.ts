import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

// No stdlib functions: at this level string methods aren't available yet, so the
// student builds every tool they need (uppercasing, letter-testing) themselves.
const functions: FunctionInfo[] = [];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: [
    "string-iteration",
    "string-indexing",
    "string-concatenation",
    "creating-functions",
    "creating-functions-with-return-values"
  ],
  // No string methods at this level, so solutions scan the alphabet by hand to
  // uppercase/letter-test each character. Over the long phrase, a sane solution
  // that tests every character can run several thousand iterations — lift the
  // 1000 default so a valid-but-unoptimised answer never trips the loop cap.
  interpreterOptions: { maxTotalLoopIterations: 10000 }
};

export default exerciseDefinition;
