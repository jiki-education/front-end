import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "push",
    signature: "push(list, element)",
    description: "Returns a new list with the element added to the end (provided by level stdlib)",
    examples: ['push(["a", "b"], "c") -> ["a", "b", "c"]', "push([1, 2], 3) -> [1, 2, 3]"],
    category: "List Operations"
  },
  {
    name: "concat",
    signature: "concat(list1, list2)",
    description:
      "Takes two lists, joins them together into one list, then returns the result (provided by level stdlib)",
    examples: ['concat(["a"], ["b"]) -> ["a", "b"]', "concat([1, 2], [3, 4]) -> [1, 2, 3, 4]"],
    category: "List Operations"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["arrays", "string-iteration", "building-arrays", "if"],
  interpreterOptions: { maxTotalLoopIterations: 10000 }
};

export default exerciseDefinition;
