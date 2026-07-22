import ExerciseClass from "./ScrollAndShootExercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "moveLeft",
    signature: "moveLeft()",
    description: "functions.moveLeft.description",
    examples: ["moveLeft()"],
    category: "functions.moveLeft.category"
  },
  {
    name: "moveRight",
    signature: "moveRight()",
    description: "functions.moveRight.description",
    examples: ["moveRight()"],
    category: "functions.moveRight.category"
  },
  {
    name: "shoot",
    signature: "shoot()",
    description: "functions.shoot.description",
    examples: ["shoot()"],
    category: "functions.shoot.category"
  },
  {
    name: "isAlienAbove",
    signature: "isAlienAbove()",
    description: "functions.isAlienAbove.description",
    examples: ["if (isAlienAbove()) { shoot(); }"],
    category: "functions.isAlienAbove.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "using-functions", "if", "else-if", "updating-variables", "state"],
  interpreterOptions: { maxTotalLoopIterations: 100 }
};

export default exerciseDefinition;
