import "../../exercise-categories/golf/exercise.css";
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
    name: "rollTo",
    signature: "rollTo(x)",
    description: "Rolls the ball to position **x**.",
    examples: ["rollTo(30)", "rollTo(50)"],
    category: "Movement"
  },
  {
    name: "getShotLength",
    signature: "getShotLength()",
    description: "Returns the **length of the shot** — how many units the ball travels to the right.",
    examples: ["let shotLength = getShotLength()"],
    category: "Game"
  },
  {
    name: "fireFireworks",
    signature: "fireFireworks()",
    description: "Fires celebratory fireworks!",
    examples: ["fireFireworks()"],
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
