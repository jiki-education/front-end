import ExerciseClass from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseCore, FunctionInfo } from "../types";

const functions: FunctionInfo[] = [
  {
    name: "circle",
    signature: "circle(cx, cy, radius, color)",
    description: "Draw a circle centered at (cx, cy) with the given radius and color",
    examples: ['circle(50, 50, 15, "white")'],
    category: "Drawing Shapes"
  }
];

const exerciseDefinition: VisualExerciseCore = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["variables", "using-functions"],
  readonlyRanges: {
    javascript: [{ fromLine: 6, toLine: 13 }],
    python: [{ fromLine: 6, toLine: 13 }],
    jikiscript: [{ fromLine: 6, toLine: 13 }]
  }
};

export default exerciseDefinition;
