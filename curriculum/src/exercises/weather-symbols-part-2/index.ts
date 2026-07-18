import "../../exercise-categories/weather/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: ['rectangle(0, 0, 100, 100, "#ADD8E6")'],
    category: "functions.rectangle.category"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(75, 30, 15, "#ffed06")'],
    category: "functions.circle.category"
  },
  {
    name: "ellipse",
    signature: "ellipse(centerX, centerY, radiusX, radiusY, color)",
    description: "functions.ellipse.description",
    examples: ['ellipse(30, 70, 3, 5, "#56AEFF")'],
    category: "functions.ellipse.category"
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
