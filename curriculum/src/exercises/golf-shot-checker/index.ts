import "../../exercise-categories/golf/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "moveTo",
    signature: "moveTo(x, y)",
    description: "functions.moveTo.description",
    examples: ["moveTo(30, 75)", "moveTo(50, 84)"],
    category: "functions.moveTo.category"
  },
  {
    name: "getShotLength",
    signature: "getShotLength()",
    description: "functions.getShotLength.description",
    examples: ["let shotLength = getShotLength()"],
    category: "functions.getShotLength.category"
  },
  {
    name: "fireFireworks",
    signature: "fireFireworks()",
    description: "functions.fireFireworks.description",
    examples: ["fireFireworks()"],
    category: "functions.fireFireworks.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  conceptSlugs: ["logical-and", "if", "repeat", "updating-variables", "using-functions-with-return-values"],
  tasks,
  scenarios,
  functions,
  interpreterOptions: { maxTotalLoopIterations: 200 }
};

export default exerciseDefinition;
