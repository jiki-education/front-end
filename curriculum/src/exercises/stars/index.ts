import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "concatenate",
    signature: "concatenate(a, b, ...)",
    description: "Combine two or more strings together (provided by level stdlib)",
    examples: ['concatenate("*", "*") \u2192 "**"'],
    category: "String Operations"
  },
  {
    name: "push",
    signature: "push(list, item)",
    description: "Add an item to the end of a list (provided by level stdlib)",
    examples: ['push(myList, "*")'],
    category: "List Operations"
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
