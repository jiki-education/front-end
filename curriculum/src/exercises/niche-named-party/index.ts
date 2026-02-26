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
    name: "askName",
    signature: "askName()",
    description: "Returns the **name** of the person at the door.",
    examples: ["let name = askName()"],
    category: "Information"
  },
  {
    name: "getAllowedStart",
    signature: "getAllowedStart()",
    description: "Returns the required **starting letters** for tonight's party.",
    examples: ["let allowedStart = getAllowedStart()"],
    category: "Information"
  },
  {
    name: "letIn",
    signature: "letIn()",
    description: "Lets the person into the party.",
    examples: ["letIn()"],
    category: "Action"
  },
  {
    name: "turnAway",
    signature: "turnAway()",
    description: "Turns the person away from the party.",
    examples: ["turnAway()"],
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
