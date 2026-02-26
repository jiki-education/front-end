import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "concatenate",
    signature: "concatenate(a, b, ...)",
    description: "Combine two or more strings together (provided by level stdlib)",
    examples: ['concatenate("Move to ", "5") returns "Move to 5"'],
    category: "String Operations"
  },
  {
    name: "numberToString",
    signature: "numberToString(number)",
    description: "Convert a number to its string representation (provided by level stdlib)",
    examples: ['numberToString(42) returns "42"'],
    category: "Type Conversion"
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
