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
    signature: "rectangle(x, y, width, height, color)",
    description: "Draw a rectangle at position (x, y) with the given width, height, and color",
    examples: [
      'rectangle(0, 0, 100, 50, "#add8e6")',
      "rectangle(house_left, house_top, house_width, house_height, house_color)"
    ],
    category: "Drawing Shapes"
  },
  {
    name: "circle",
    signature: "circle(center_x, center_y, radius, color)",
    description: "Draw a circle centered at (center_x, center_y) with the given radius and color",
    examples: ['circle(50, 50, 10, "#000000")', "circle(knob_center_x, knob_center_y, knob_radius, knob_color)"],
    category: "Drawing Shapes"
  },
  {
    name: "ellipse",
    signature: "ellipse(center_x, center_y, radius_x, radius_y, color)",
    description: "Draw an ellipse centered at (center_x, center_y) with horizontal and vertical radii and color",
    examples: ['ellipse(50, 50, 20, 10, "#000000")', 'ellipse(30, 60, 15, 5, "#ffffff")'],
    category: "Drawing Shapes"
  },
  {
    name: "triangle",
    signature: "triangle(x1, y1, x2, y2, x3, y3, color)",
    description: "Draw a triangle with three corner points and a color",
    examples: [
      'triangle(50, 20, 40, 40, 60, 40, "#8b4513")',
      "triangle(roof_left, roof_base_y, roof_peak_x, roof_peak_y, roof_right, roof_base_y, roof_color)"
    ],
    category: "Drawing Shapes"
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
