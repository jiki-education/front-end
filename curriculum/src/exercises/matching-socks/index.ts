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
