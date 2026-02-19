import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "concatenate",
    signature: "concatenate(a, b)",
    description: "Combine two strings together (provided by level stdlib)",
    examples: ['concatenate("hello", "world") → "helloworld"'],
    category: "String Operations"
  },
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

const exerciseDefinition: IOExerciseDefinition = {
  type: "io",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
