import "../../exercise-categories/digital-clock/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "currentTimeHour",
    signature: "currentTimeHour()",
    description: "functions.currentTimeHour.description",
    examples: ["let hour = currentTimeHour()"],
    category: "functions.currentTimeHour.category"
  },
  {
    name: "currentTimeMinute",
    signature: "currentTimeMinute()",
    description: "functions.currentTimeMinute.description",
    examples: ["let minutes = currentTimeMinute()"],
    category: "functions.currentTimeMinute.category"
  },
  {
    name: "displayTime",
    signature: "displayTime(hour, minutes, indicator)",
    description: "functions.displayTime.description",
    examples: ['displayTime(7, 45, "am")'],
    category: "functions.displayTime.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["else-if", "variables", "using-functions-with-return-values"]
};

export default exerciseDefinition;
