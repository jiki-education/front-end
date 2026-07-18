import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "toUpperCase",
    signature: "toUpperCase(text)",
    description: "functions.toUpperCase.description",
    examples: ['toUpperCase("hello") → "HELLO"', 'toUpperCase("a") → "A"'],
    category: "functions.toUpperCase.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["dictionaries", "updating-dictionaries", "string-iteration", "methods"]
};

export default exerciseDefinition;
