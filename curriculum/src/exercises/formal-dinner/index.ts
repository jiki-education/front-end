import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "concatenate",
    signature: "concatenate(str1, str2, ...)",
    description: "Combine two or more strings together (provided by level stdlib)",
    examples: ['concatenate("hello", " ", "world") returns "hello world"', 'concatenate("A", "B", "C") returns "ABC"'],
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
