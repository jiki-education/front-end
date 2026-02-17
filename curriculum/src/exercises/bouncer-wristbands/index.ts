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
    name: "get_age",
    signature: "get_age()",
    description: "Returns the **age** of the person waiting outside.",
    examples: ["set age to get_age()"],
    category: "Information"
  },
  {
    name: "child_wristband",
    signature: "child_wristband()",
    description: "Gives the person a **child** wristband (under 13).",
    examples: ["child_wristband()"],
    category: "Wristbands"
  },
  {
    name: "teen_wristband",
    signature: "teen_wristband()",
    description: "Gives the person a **teen** wristband (13-17).",
    examples: ["teen_wristband()"],
    category: "Wristbands"
  },
  {
    name: "adult_wristband",
    signature: "adult_wristband()",
    description: "Gives the person an **adult** wristband (18-64).",
    examples: ["adult_wristband()"],
    category: "Wristbands"
  },
  {
    name: "senior_wristband",
    signature: "senior_wristband()",
    description: "Gives the person a **senior** wristband (65+).",
    examples: ["senior_wristband()"],
    category: "Wristbands"
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
