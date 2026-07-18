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
  },
  {
    name: "canMove",
    signature: "canMove()",
    description: "functions.canMove.description",
    examples: ["canMove()"],
    category: "functions.canMove.category"
  },
  {
    name: "canTurnLeft",
    signature: "canTurnLeft()",
    description: "functions.canTurnLeft.description",
    examples: ["canTurnLeft()"],
    category: "functions.canTurnLeft.category"
  },
  {
    name: "canTurnRight",
    signature: "canTurnRight()",
    description: "functions.canTurnRight.description",
    examples: ["canTurnRight()"],
    category: "functions.canTurnRight.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["creating-functions", "using-functions", "repeat", "if", "else-if", "else"],
  interpreterOptions: { maxTotalLoopIterations: 50 }
};

export default exerciseDefinition;
