import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "toLowerCase",
    signature: "toLowerCase(text)",
    description: "Convert a string to lowercase (provided by level stdlib)",
    examples: ['toLowerCase("HELLO") → "hello"'],
    category: "String Operations"
  },
  {
    name: "push",
    signature: "push(list, element)",
    description: "Add an element to a list and return the new list (provided by level stdlib)",
    examples: ['push(["a"], "b") → ["a", "b"]'],
    category: "List Operations"
  },
  {
    name: "hasKey",
    signature: "hasKey(dictionary, key)",
    description: "Check if a key exists in a dictionary, returns true or false (provided by level stdlib)",
    examples: ['hasKey({"name": "Jeremy"}, "name") → true'],
    category: "Dictionary Operations"
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
