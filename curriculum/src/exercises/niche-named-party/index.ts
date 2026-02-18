import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "ask_name",
    signature: "ask_name()",
    description: "Returns the **name** of the person at the door.",
    examples: ["set name to ask_name()"],
    category: "Information"
  },
  {
    name: "get_allowed_start",
    signature: "get_allowed_start()",
    description: "Returns the required **starting letters** for tonight's party.",
    examples: ["set allowed_start to get_allowed_start()"],
    category: "Information"
  },
  {
    name: "let_in",
    signature: "let_in()",
    description: "Lets the person into the party.",
    examples: ["let_in()"],
    category: "Action"
  },
  {
    name: "turn_away",
    signature: "turn_away()",
    description: "Turns the person away from the party.",
    examples: ["turn_away()"],
    category: "Action"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
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
