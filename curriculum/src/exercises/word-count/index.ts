import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "toLowerCase",
    signature: "toLowerCase(text)",
    description: "functions.toLowerCase.description",
    examples: ['toLowerCase("HELLO") → "hello"'],
    category: "functions.toLowerCase.category"
  },
  {
    name: "push",
    signature: "push(list, element)",
    description: "functions.push.description",
    examples: ['push(["a"], "b") → ["a", "b"]'],
    category: "functions.push.category"
  },
  {
    name: "hasKey",
    signature: "hasKey(dictionary, key)",
    description: "functions.hasKey.description",
    examples: ['hasKey({"name": "Jeremy"}, "name") → true'],
    category: "functions.hasKey.category"
  }
];

const exerciseDefinition: IOExerciseCore = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["dictionaries", "updating-dictionaries", "string-iteration", "if"]
};

export default exerciseDefinition;
