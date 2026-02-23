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
    name: "buildWall",
    signature: "buildWall(x, y)",
    description: "Places a **wall block** at grid position (x, y).",
    examples: ["buildWall(1, 1)", "buildWall(5, 3)"],
    category: "Building"
  },
  {
    name: "buildGlass",
    signature: "buildGlass(x, y)",
    description: "Places a **glass panel** at grid position (x, y).",
    examples: ["buildGlass(2, 1)", "buildGlass(3, 4)"],
    category: "Building"
  },
  {
    name: "buildEntrance",
    signature: "buildEntrance(x, y)",
    description: "Places an **entrance door** at grid position (x, y).",
    examples: ["buildEntrance(3, 1)"],
    category: "Building"
  },
  {
    name: "numBuildings",
    signature: "numBuildings()",
    description: "Returns the **number of buildings** to construct.",
    examples: ["let buildings = numBuildings()"],
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
