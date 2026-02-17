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
    name: "get_outfit",
    signature: "get_outfit()",
    description: 'Returns the **outfit** the person is wearing (e.g. `"ballgown"`, `"suit"`, `"jeans"`).',
    examples: ["set outfit to get_outfit()"],
    category: "Information"
  },
  {
    name: "offer_champagne",
    signature: "offer_champagne()",
    description: "Offers the person a glass of champagne.",
    examples: ["offer_champagne()"],
    category: "Action"
  },
  {
    name: "let_in",
    signature: "let_in()",
    description: "Lets the person into the venue.",
    examples: ["let_in()"],
    category: "Action"
  },
  {
    name: "turn_away",
    signature: "turn_away()",
    description: "Turns the person away from the venue.",
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
