import { SproutingFlowerExercise } from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description:
      "Draws a **rectangle** at position (left, top) with the specified width, height, and color. The position represents the top-left corner of the rectangle.",
    examples: ['rectangle(10, 20, 50, 30, "skyblue")', 'rectangle(0, 0, 100, 100, "green")'],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "Draws a **circle** at center position (centerX, centerY) with the specified radius and color.",
    examples: ['circle(50, 50, 10, "pink")', 'circle(25, 75, 15, "yellow")'],
    category: "Drawing Shapes"
  },
  {
    name: "ellipse",
    signature: "ellipse(centerX, centerY, radiusX, radiusY, color)",
    description:
      "Draws an **ellipse** at center position (centerX, centerY) with the specified radiusX, radiusY, and color.",
    examples: ['ellipse(50, 50, 20, 10, "green")', 'ellipse(30, 60, 15, 5, "green")'],
    category: "Drawing Shapes"
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
