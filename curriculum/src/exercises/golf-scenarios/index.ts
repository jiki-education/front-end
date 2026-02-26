import "../../exercise-categories/golf/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rollTo",
    signature: "rollTo(x)",
    description: "Rolls the ball to position **x**.",
    examples: ["rollTo(30)", "rollTo(50)"],
    category: "Movement"
  },
  {
    name: "getShotLength",
    signature: "getShotLength()",
    description: "Returns the **length of the shot** — how many units the ball travels to the right.",
    examples: ["let shotLength = getShotLength()"],
    category: "Game"
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
  tasks,
  scenarios,
  functions
};

export default exerciseDefinition;
