import { SproutingFlowerExercise } from "./Exercise";
import { tasks, scenarios } from "./scenarios";
import metadata from "./metadata.json";
import type { VisualExerciseDefinition, FunctionInfo } from "../types";

import solutionJavascript from "./solution.javascript";
import solutionPython from "./solution.py";
import solutionJikiscript from "./solution.jiki";
import stubJavascript from "./stub.javascript";
import stubPython from "./stub.py";
import stubJikiscript from "./stub.jiki";

const functions: FunctionInfo[] = [
  {
    name: "rectangle",
    signature: "rectangle(x, y, width, height, color)",
    description:
      "Draws a **rectangle** at position (x, y) with the specified width, height, and color. The position represents the top-left corner of the rectangle.",
    examples: ['rectangle(10, 20, 50, 30, "#ADD8E6")', 'rectangle(0, 0, 100, 100, "green")'],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(x, y, radius, color)",
    description: "Draws a **circle** at center position (x, y) with the specified radius and color.",
    examples: ['circle(50, 50, 10, "pink")', 'circle(25, 75, 15, "yellow")'],
    category: "Drawing Shapes"
  },
  {
    name: "ellipse",
    signature: "ellipse(x, y, xRadius, yRadius, color)",
    description: "Draws an **ellipse** at center position (x, y) with the specified xRadius, yRadius, and color.",
    examples: ['ellipse(50, 50, 20, 10, "green")', 'ellipse(30, 60, 15, 5, "green")'],
    category: "Drawing Shapes"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata, // Spreads all fields from metadata.json
  ExerciseClass: SproutingFlowerExercise,
  tasks,
  scenarios,
  functions,
  conceptSlugs: ["loops", "variables"],
  solutions: {
    javascript: solutionJavascript,
    python: solutionPython,
    jikiscript: solutionJikiscript
  },
  stubs: {
    javascript: stubJavascript,
    python: stubPython,
    jikiscript: stubJikiscript
  }
};

export default exerciseDefinition;
