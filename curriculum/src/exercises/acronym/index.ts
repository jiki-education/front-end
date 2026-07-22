import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "toUpperCase",
    signature: "toUpperCase(text)",
    description: "functions.toUpperCase.description",
    examples: ['toUpperCase("hello") → "HELLO"', 'toUpperCase("png") → "PNG"'],
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
  conceptSlugs: ["string-iteration", "methods", "string-concatenation", "creating-functions"]
};

export default exerciseDefinition;
