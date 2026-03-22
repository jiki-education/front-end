import "../../exercise-categories/cityscape/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

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
    name: "numFloors",
    signature: "numFloors()",
    description: "Returns the **number of floors** for this building.",
    examples: ["let floors = numFloors()"],
    category: "Info"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["return-values", "variables", "repeat"]
};

export default exerciseDefinition;
