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
  conceptSlugs: ["using-functions", "repeat", "if"]
};

export default exerciseDefinition;
