// Main DrawExercise class
export { DrawExercise } from "./DrawExercise";

// Shape classes for type checking
export { Shape, Circle, Rectangle, Line, Triangle, Ellipse } from "./shapes";

// Utility functions
export { aToR, rToA } from "./utils";

// Check functions for scenarios
export {
  checkCanvasCoverage,
  checkUniqueColoredLines,
  checkUniqueColoredCircles,
  checkUniqueColoredRectangles,
  checkUniquePositionedCircles
} from "./checks";

// Retriever functions for scenarios
export { getCircleAt, getLineAt, getEllipseAt, getRectangleAt, getTriangleAt } from "./retrievers";
