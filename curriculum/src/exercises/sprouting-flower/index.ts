import { SproutingFlowerExercise } from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: ['rectangle(10, 20, 50, 30, "skyblue")', 'rectangle(0, 0, 100, 100, "green")'],
    category: "functions.rectangle.category"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(50, 50, 10, "pink")', 'circle(25, 75, 15, "yellow")'],
    category: "functions.circle.category"
  },
  {
    name: "ellipse",
    signature: "ellipse(centerX, centerY, radiusX, radiusY, color)",
    description: "functions.ellipse.description",
    examples: ['ellipse(50, 50, 20, 10, "green")', 'ellipse(30, 60, 15, 5, "green")'],
    category: "functions.ellipse.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass: SproutingFlowerExercise,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["repeat", "variables", "updating-variables", "arithmetic"],
  interpreterOptions: {
    repeatDelay: 50
  }
};

export default exerciseDefinition;
