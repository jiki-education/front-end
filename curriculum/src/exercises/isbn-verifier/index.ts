import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "stringToNumber",
    signature: "stringToNumber(str)",
    description: "Convert a string containing digits to a number (provided by level stdlib)",
    examples: ['stringToNumber("42") // returns 42'],
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
