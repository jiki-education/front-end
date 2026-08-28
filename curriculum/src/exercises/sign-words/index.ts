import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "split",
    signature: '"...".split(separator)',
    description: "functions.split.description",
    examples: ['"a-b-c".split("-") → ["a", "b", "c"]', '"one".split("-") → ["one"]'],
    category: "functions.split.category"
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
  conceptSlugs: ["arrays", "building-arrays", "string-iteration", "methods", "if"]
};

export default exerciseDefinition;
