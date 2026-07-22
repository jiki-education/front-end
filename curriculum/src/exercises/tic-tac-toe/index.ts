import "../../exercise-categories/tic-tac-toe/exercise.css";
import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(left, top, width, height, color)",
    description: "functions.rectangle.description",
    examples: ['rectangle(5, 5, 90, 90, "#ffffff")', 'rectangle(0, 0, 100, 100, "#604fcd")'],
    category: "functions.rectangle.category"
  },
  {
    name: "circle",
    signature: "circle(centerX, centerY, radius, color)",
    description: "functions.circle.description",
    examples: ['circle(50, 50, 10, "#ffffff")'],
    category: "functions.circle.category"
  },
  {
    name: "line",
    signature: "line(x1, y1, x2, y2, color)",
    description: "functions.line.description",
    examples: ['line(5, 35, 95, 35, "#000000")'],
    category: "functions.line.category"
  },
  {
    name: "changeStroke",
    signature: "changeStroke(width, color)",
    description: "functions.changeStroke.description",
    examples: ['changeStroke(1, "#333333")', 'changeStroke(1.5, "#604fcd")'],
    category: "functions.changeStroke.category"
  },
  {
    name: "write",
    signature: "write(text)",
    description: "functions.write.description",
    examples: ['write("The game was a draw!")'],
    category: "functions.write.category"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: [
    "arrays",
    "if",
    "creating-functions-with-inputs",
    "creating-functions-with-return-values",
    "strings",
    "for-loops"
  ]
};

export default exerciseDefinition;
