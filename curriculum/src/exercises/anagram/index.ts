import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "push",
    signature: "push(list, element)",
    description: "Returns a new list with the element added to the end (provided by level stdlib)",
    examples: ['push(["a", "b"], "c") → ["a", "b", "c"]', "push([1, 2], 3) → [1, 2, 3]"],
    category: "List Operations"
  },
  {
    name: "sortString",
    signature: "sortString(string)",
    description: "Takes a string and returns its characters sorted alphabetically (provided by level stdlib)",
    examples: ['sortString("dcba") → "abcd"', 'sortString("listen") → "eilnst"'],
    category: "String Operations"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "string-iteration", "methods", "function-composition"]
};

export default exerciseDefinition;
