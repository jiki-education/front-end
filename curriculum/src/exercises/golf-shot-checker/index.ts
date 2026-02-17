import "../../exercise-categories/golf/exercise.css";
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
    name: "roll_to",
    signature: "roll_to(x, y)",
    description: "Rolls the ball to position **(x, y)**.",
    examples: ["roll_to(30, 75)", "roll_to(50, 84)"],
    category: "Movement"
  },
  {
    name: "get_shot_length",
    signature: "get_shot_length()",
    description: "Returns the **length of the shot** — how many units the ball travels to the right.",
    examples: ["set shot_length to get_shot_length()"],
    category: "Game"
  },
  {
    name: "fire_fireworks",
    signature: "fire_fireworks()",
    description: "Fires celebratory fireworks!",
    examples: ["fire_fireworks()"],
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
