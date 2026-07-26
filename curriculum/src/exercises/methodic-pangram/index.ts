import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "toLowerCase",
    signature: '"...".toLowerCase()',
    description: "functions.toLowerCase.description",
    examples: ['"Hello".toLowerCase() → "hello"', '"PNG".toLowerCase() → "png"'],
    category: "functions.toLowerCase.category"
  },
  {
    name: "includes",
    signature: '"...".includes(substring)',
    description: "functions.includes.description",
    examples: ['"hello".includes("ell") → true', '"hello".includes("z") → false'],
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
  conceptSlugs: ["methods", "string-iteration", "if"]
};

export default exerciseDefinition;
