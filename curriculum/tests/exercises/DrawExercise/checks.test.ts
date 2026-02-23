import { describe, it, expect } from "vitest";
import {
  checkCanvasCoverage,
  checkUniqueColoredCircles,
  checkUniqueColoredRectangles,
  checkUniqueColoredLines,
  checkUniquePositionedCircles
} from "../../../src/exercise-categories/draw/checks";
import type { Shape } from "../../../src/exercise-categories/draw/shapes";
import { Circle, Rectangle, Line } from "../../../src/exercise-categories/draw/shapes";

// Helper to create mock SVG elements
function createMockSVGElement(): SVGElement {
  return document.createElementNS("http://www.w3.org/2000/svg", "circle") as SVGElement;
}

const defaultStrokeColor = "#333333";
const defaultFillColor = "#ff0000";

describe("Check Functions", () => {
  describe("4.1 checkCanvasCoverage", () => {
    it("Should return true when coverage meets minimum percentage", () => {
      // Create a large circle that covers more than 50% of the canvas
      const circle = new Circle(50, 50, 60, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = checkCanvasCoverage(shapes, 50);

      expect(result).toBe(true);
    });

    it("Should return false when coverage below minimum percentage", () => {
      // Create a small circle that covers less than 50% of the canvas
      const circle = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = checkCanvasCoverage(shapes, 50);

      expect(result).toBe(false);
    });

    it("Should handle empty shapes array (0% coverage)", () => {
      const shapes: Shape[] = [];

      const result = checkCanvasCoverage(shapes, 10);

      expect(result).toBe(false);
    });

    it("Should handle full canvas coverage (100% coverage)", () => {
      // Create a very large circle that covers the entire canvas
      const circle = new Circle(50, 50, 100, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = checkCanvasCoverage(shapes, 100);

      expect(result).toBe(true);
    });

    it("Should calculate coverage correctly for single circle", () => {
      // Larger circle to ensure coverage > 0%
      const circle = new Circle(50, 50, 15, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      // Should have some coverage (a circle with radius 15 at center should cover a few percent)
      const result = checkCanvasCoverage(shapes, 0.5);

      expect(result).toBe(true);
    });

    it("Should calculate coverage correctly for multiple shapes", () => {
      // Multiple small circles
      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle2 = new Circle(90, 90, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkCanvasCoverage(shapes, 1);

      expect(result).toBe(true);
    });

    it("Should handle overlapping shapes", () => {
      // Two overlapping circles
      const circle1 = new Circle(50, 50, 20, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle2 = new Circle(55, 55, 20, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      // Overlapping shouldn't double-count coverage
      const result = checkCanvasCoverage(shapes, 10);

      expect(result).toBe(true);
    });
  });

  describe("4.2 checkUniqueColoredCircles", () => {
    it("Should return true when all circles have unique colors", () => {
      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, "#ff0000", createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, "#00ff00", "#0000ff", createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should return false when circles have duplicate colors", () => {
      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(false);
    });

    it("Should handle empty circles array", () => {
      const shapes: Shape[] = [];

      const result = checkUniqueColoredCircles(shapes, 1);

      expect(result).toBe(false);
    });

    it("Should handle single circle", () => {
      const circle = new Circle(10, 10, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = checkUniqueColoredCircles(shapes, 1);

      expect(result).toBe(true);
    });

    it("Should compare hex colors correctly", () => {
      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, "#ff0000", createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, defaultStrokeColor, "#0000ff", createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should detect duplicate colors with same stroke and fill", () => {
      const circle1 = new Circle(10, 10, 5, "#333333", "#ff0000", createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, "#333333", "#ff0000", createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(false);
    });

    it("Should treat different stroke colors as unique", () => {
      const circle1 = new Circle(10, 10, 5, "#111111", "#ff0000", createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, "#222222", "#ff0000", createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should treat different fill colors as unique", () => {
      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, "#ff0000", createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, defaultStrokeColor, "#00ff00", createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(true);
    });
  });

  describe("4.3 checkUniqueColoredRectangles", () => {
    it("Should return true when all rectangles have unique colors", () => {
      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, "#ff0000", createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, "#0000ff", createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should return false when rectangles have duplicate colors", () => {
      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(false);
    });

    it("Should handle empty rectangles array", () => {
      const shapes: Shape[] = [];

      const result = checkUniqueColoredRectangles(shapes, 1);

      expect(result).toBe(false);
    });

    it("Should handle single rectangle", () => {
      const rect = new Rectangle(10, 10, 5, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = checkUniqueColoredRectangles(shapes, 1);

      expect(result).toBe(true);
    });

    it("Should compare hex colors correctly", () => {
      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, "#ff0000", createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, "#0000ff", createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should detect duplicate fill colors", () => {
      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, "#aabbcc", createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, "#aabbcc", createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(false);
    });

    it("Should treat different fill colors as unique", () => {
      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, "#112233", createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, "#445566", createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should count unique colors across multiple rectangles", () => {
      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, "#ff0000", createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, "#00ff00", createMockSVGElement());
      const rect3 = new Rectangle(30, 30, 15, 15, defaultStrokeColor, "#0000ff", createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2, rect3];

      const result = checkUniqueColoredRectangles(shapes, 3);

      expect(result).toBe(true);
    });
  });

  describe("4.4 checkUniqueColoredLines", () => {
    it("Should return true when all lines have unique colors", () => {
      const line1 = new Line(0, 0, 10, 10, "#ff0000", defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, "#0000ff", defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should return false when lines have duplicate colors", () => {
      const line1 = new Line(0, 0, 10, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(false);
    });

    it("Should handle empty lines array", () => {
      const shapes: Shape[] = [];

      const result = checkUniqueColoredLines(shapes, 1);

      expect(result).toBe(false);
    });

    it("Should handle single line", () => {
      const line = new Line(0, 0, 10, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = checkUniqueColoredLines(shapes, 1);

      expect(result).toBe(true);
    });

    it("Should compare hex stroke colors correctly", () => {
      const line1 = new Line(0, 0, 10, 10, "#ff0000", defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, "#0000ff", defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should detect duplicate stroke colors", () => {
      const line1 = new Line(0, 0, 10, 10, "#aabbcc", defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, "#aabbcc", defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(false);
    });

    it("Should treat different stroke colors as unique", () => {
      const line1 = new Line(0, 0, 10, 10, "#112233", defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, "#445566", defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should count unique colors across multiple lines", () => {
      const line1 = new Line(0, 0, 10, 10, "#ff0000", defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, "#00ff00", defaultFillColor, createMockSVGElement());
      const line3 = new Line(40, 40, 50, 50, "#0000ff", defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2, line3];

      const result = checkUniqueColoredLines(shapes, 3);

      expect(result).toBe(true);
    });
  });

  describe("4.5 checkUniquePositionedCircles", () => {
    it("Should return true when circles have enough unique positions", () => {
      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle3 = new Circle(30, 30, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2, circle3];

      const result = checkUniquePositionedCircles(shapes, 3);
      expect(result).toBe(true);
    });

    it("Should return false when circles share positions", () => {
      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, "#ff0000", createMockSVGElement());
      const circle2 = new Circle(10, 10, 5, defaultStrokeColor, "#00ff00", createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniquePositionedCircles(shapes, 2);
      expect(result).toBe(false);
    });

    it("Should handle empty shapes array", () => {
      const shapes: Shape[] = [];
      const result = checkUniquePositionedCircles(shapes, 1);
      expect(result).toBe(false);
    });

    it("Should ignore non-circle shapes", () => {
      const rect = new Rectangle(10, 10, 5, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle = new Circle(20, 20, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect, circle];

      const result = checkUniquePositionedCircles(shapes, 1);
      expect(result).toBe(true);
    });
  });
});
