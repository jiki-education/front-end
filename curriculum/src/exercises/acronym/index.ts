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
    signature: "concatenate(a, b)",
    description: "Combine two strings together (provided by level stdlib)",
    examples: ['concatenate("hello", "world") → "helloworld"', 'concatenate("A", "B") → "AB"'],
    category: "String Operations"
  },
  {
    name: "toUpperCase",
    signature: "toUpperCase(text)",
    description: "Convert a string to uppercase (provided by level stdlib)",
    examples: ['toUpperCase("hello") → "HELLO"', 'toUpperCase("png") → "PNG"'],
    category: "String Operations"
  }
];

const { title, description, instructions } = parseInstructions(instructionsRaw);

const exerciseDefinition: IOExerciseDefinition = {
  type: "io",
  ...metadata,

  title,

  description,

  instructions, // Spreads all fields from metadata.json
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
