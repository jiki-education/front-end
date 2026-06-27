import "../../exercise-categories/golf/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rollTo",
    signature: "rollTo(x, y)",
    description: "Rolls the ball to position **(x, y)**.",
    examples: ["rollTo(30, 75)", "rollTo(50, 84)"],
    category: "Movement"
  },
  {
    name: "getShotLength",
    signature: "getShotLength()",
    description: "Returns the **length of the shot** — how many units the ball travels to the right.",
    examples: ["let shotLength = getShotLength()"],
    category: "Information"
  },
  {
    name: "fireFireworks",
    signature: "fireFireworks()",
    description: "Fires celebratory fireworks!",
    examples: ["fireFireworks()"],
    category: "Action"
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
  interpreterOptions: { repeatDelay: 20 }
};

export default exerciseDefinition;
