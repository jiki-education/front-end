import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import instructionsRaw from "./instructions/en.md";
import { parseInstructions } from "../parse-instructions";
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

const { title, description, instructions } = parseInstructions(instructionsRaw);

const exerciseDefinition: IOExerciseDefinition = {
  type: "io",
  ...metadata,

  title,

  description,

  instructions,
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
