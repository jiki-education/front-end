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
    signature: "concatenate(str1, str2, ...)",
    description: "Combine two or more strings together (provided by level stdlib)",
    examples: ['concatenate("hello", " ", "world") -> "hello world"', 'concatenate("A", "B", "C") -> "ABC"'],
    category: "String Operations"
  },
  {
    name: "keys",
    signature: "keys(dictionary)",
    description: "Returns a list of all keys in the dictionary (provided by level stdlib)",
    examples: ['keys({ "A": 1, "B": 2 }) -> ["A", "B"]'],
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
