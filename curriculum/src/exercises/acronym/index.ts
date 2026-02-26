import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "concatenate",
    signature: "concatenate(a, b)",
    description: "Combine two strings together (provided by level stdlib)",
    examples: ['concatenate("hello", "world") → "helloworld"', 'concatenate("A", "B") → "AB"'],
    category: "String Operations"
  },
  {
    name: "toUpperCase",
    signature: "toUpperCase(text)",
    description: "Convert a string to uppercase (provided by level stdlib)",
    examples: ['toUpperCase("hello") → "HELLO"', 'toUpperCase("png") → "PNG"'],
    category: "String Operations"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
