import ExerciseClass from "./Exercise";
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
    signature: "rectangle(left, top, width, height, color)",
    description: "Draw a rectangle at position (left, top) with the given width, height, and color",
    examples: ['rectangle(5, 5, 90, 90, "#ffffff")', 'rectangle(0, 0, 100, 100, "#604fcd")'],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(x, y, radius, color)",
    description: "Draw a circle centered at (x, y) with the given radius and color",
    examples: ['circle(50, 50, 10, "#ffffff")'],
    category: "Drawing Shapes"
  },
  {
    name: "line",
    signature: "line(x1, y1, x2, y2, color)",
    description: "Draw a line from (x1, y1) to (x2, y2) with the given color",
    examples: ['line(5, 35, 95, 35, "#000000")'],
    category: "Drawing Shapes"
  },
  {
    name: "changeStroke",
    signature: "changeStroke(width, color)",
    description: "Set the stroke width and color for subsequent shapes. Lines are drawn using the stroke color.",
    examples: ['changeStroke(1, "#333333")', 'changeStroke(1.5, "#604fcd")'],
    category: "Stroke Settings"
  },
  {
    name: "write",
    signature: "write(text)",
    description: "Write text to the center of the screen in white",
    examples: ['write("The game was a draw!")'],
    category: "Text"
  }
];

const exerciseDefinition: VisualExerciseDefinition = {
  type: "visual",
  ...metadata,
  ExerciseClass,
  tasks,
  scenarios,
  functions,
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
