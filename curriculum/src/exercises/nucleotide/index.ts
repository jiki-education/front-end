import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import { progressionMetrics } from "./progressionMetrics";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "includes",
    signature: '"...".includes(substring)',
    description: "functions.includes.description",
    examples: ['"ACGT".includes("A") → true', '"ACGT".includes("X") → false'],
    category: "functions.includes.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  progressionMetrics,
  conceptSlugs: ["methods", "string-iteration", "if"]
};

export default exerciseDefinition;
