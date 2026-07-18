import "../../exercise-categories/cityscape/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "buildWall",
    signature: "buildWall(x, y)",
    description: "functions.buildWall.description",
    examples: ["buildWall(1, 1)", "buildWall(5, 3)"],
    category: "functions.buildWall.category"
  },
  {
    name: "buildGlass",
    signature: "buildGlass(x, y)",
    description: "functions.buildGlass.description",
    examples: ["buildGlass(2, 1)", "buildGlass(3, 4)"],
    category: "functions.buildGlass.category"
  },
  {
    name: "buildEntrance",
    signature: "buildEntrance(x, y)",
    description: "functions.buildEntrance.description",
    examples: ["buildEntrance(3, 1)"],
    category: "functions.buildEntrance.category"
  },
  {
    name: "numBuildings",
    signature: "numBuildings()",
    description: "functions.numBuildings.description",
    examples: ["let buildings = numBuildings()"],
    category: "functions.numBuildings.category"
  },
  {
    name: "randomWidth",
    signature: "randomWidth()",
    description: "functions.randomWidth.description",
    examples: ["let width = randomWidth()"],
    category: "functions.randomWidth.category"
  },
  {
    name: "randomNumFloors",
    signature: "randomNumFloors()",
    description: "functions.randomNumFloors.description",
    examples: ["let floors = randomNumFloors()"],
    category: "functions.randomNumFloors.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["using-functions-with-return-values", "variables", "repeat", "nested-loops", "random"]
};

export default exerciseDefinition;
