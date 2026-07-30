import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "toReversed",
    signature: "[...].toReversed()",
    description: "functions.toReversed.description",
    examples: ['["a", "b", "c"].toReversed() → ["c", "b", "a"]', "[1, 2, 3].toReversed() → [3, 2, 1]"],
    category: "functions.toReversed.category"
  },
  {
    name: "push",
    signature: "[...].push(element)",
    description: "functions.push.description",
    examples: ['["a", "b"].push("c") → ["a", "b", "c"]', "[1, 2].push(3) → [1, 2, 3]"],
    category: "functions.push.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "building-arrays", "if", "arithmetic", "methods"]
};

export default exerciseDefinition;
