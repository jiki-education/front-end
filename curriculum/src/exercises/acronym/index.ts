import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { IOExerciseDefinition, FunctionDoc } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionDoc[] = [
  {
    name: "concatenate(a, b)",
    description: "Combine two strings together (provided by level stdlib)",
    usage: 'concatenate("hello", "world") // returns "helloworld"'
  },
  {
    name: "to_upper_case(text)",
    description: "Convert a string to uppercase (provided by level stdlib)",
    usage: 'to_upper_case("hello") // returns "HELLO"'
  }
];

const exerciseDefinition: IOExerciseDefinition = {
  type: "io",
  ...metadata, // Spreads all fields from metadata.json
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
