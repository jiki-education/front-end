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
    name: "getOutfit",
    signature: "getOutfit()",
    description: 'Returns the **outfit** the person is wearing (e.g. `"ballgown"`, `"suit"`, `"jeans"`).',
    examples: ["let outfit = getOutfit()"],
    category: "Information"
  },
  {
    name: "offerChampagne",
    signature: "offerChampagne()",
    description: "Offers the person a glass of champagne.",
    examples: ["offerChampagne()"],
    category: "Action"
  },
  {
    name: "letIn",
    signature: "letIn()",
    description: "Lets the person into the venue.",
    examples: ["letIn()"],
    category: "Action"
  },
  {
    name: "turnAway",
    signature: "turnAway()",
    description: "Turns the person away from the venue.",
    examples: ["turnAway()"],
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
