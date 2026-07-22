import "../../exercise-categories/maze/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "move",
    signature: "move()",
    description: "functions.move.description",
    examples: ["move()"],
    category: "functions.move.category"
  },
  {
    name: "turnLeft",
    signature: "turnLeft()",
    description: "functions.turnLeft.description",
    examples: ["turnLeft()"],
    category: "functions.turnLeft.category"
  },
  {
    name: "turnRight",
    signature: "turnRight()",
    description: "functions.turnRight.description",
    examples: ["turnRight()"],
    category: "functions.turnRight.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "using-functions"]
};

export default exerciseDefinition;
