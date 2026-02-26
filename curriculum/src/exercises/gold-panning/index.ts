import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import instructionsRaw from "./instructions/en.md";
import { parseInstructions } from "../parse-instructions";
import type { VisualExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "pan",
    signature: "pan()",
    description: "Dips your pan in the river and **gives back** the number of gold nuggets found.",
    examples: ["let found = pan()"],
    category: "Mining"
  },
  {
    name: "sell",
    signature: "sell(nuggets)",
    description: "Sells your gold nuggets at the trading post.",
    examples: ["sell(nuggets)"],
    category: "Action"
  }
];

const { title, description, instructions } = parseInstructions(instructionsRaw);

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
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
