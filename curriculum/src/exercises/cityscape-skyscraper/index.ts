import "../../exercise-categories/cityscape/exercise.css";
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
    name: "build_wall",
    signature: "build_wall(x, y)",
    description: "Places a **wall block** at grid position (x, y).",
    examples: ["build_wall(1, 1)", "build_wall(5, 3)"],
    category: "Building"
  },
  {
    name: "build_glass",
    signature: "build_glass(x, y)",
    description: "Places a **glass panel** at grid position (x, y).",
    examples: ["build_glass(2, 1)", "build_glass(3, 4)"],
    category: "Building"
  },
  {
    name: "build_entrance",
    signature: "build_entrance(x, y)",
    description: "Places an **entrance door** at grid position (x, y).",
    examples: ["build_entrance(3, 1)"],
    category: "Building"
  },
  {
    name: "num_floors",
    signature: "num_floors()",
    description: "Returns the **number of floors** for this building.",
    examples: ["set floors to num_floors()"],
    category: "Info"
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
