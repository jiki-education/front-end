import { describe, it, expect } from "vitest";
import {
  checkCanvasCoverage,
  checkUniqueColoredCircles,
  checkUniqueColoredRectangles,
  checkUniqueColoredLines
} from "../../../src/exercises/DrawExercise/checks";
import type { Shape } from "../../../src/exercises/DrawExercise/shapes";
import { Circle, Rectangle, Line } from "../../../src/exercises/DrawExercise/shapes";

// Helper to create mock SVG elements
function createMockSVGElement(): SVGElement {
  return document.createElementNS("http://www.w3.org/2000/svg", "circle") as SVGElement;
}

const defaultStrokeColor = { type: "hex" as const, color: "#333333" };
const defaultFillColor = { type: "hex" as const, color: "#ff0000" };

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
      const redFill = { type: "hex" as const, color: "#ff0000" };
      const blueFill = { type: "hex" as const, color: "#0000ff" };
      const greenStroke = { type: "hex" as const, color: "#00ff00" };

      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, redFill, createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, greenStroke, blueFill, createMockSVGElement());
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
      const redFill = { type: "hex" as const, color: "#ff0000" };
      const blueFill = { type: "hex" as const, color: "#0000ff" };

      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, redFill, createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, defaultStrokeColor, blueFill, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare rgb colors correctly", () => {
      const rgbRed = { type: "rgb" as const, color: [255, 0, 0] as [number, number, number] };
      const rgbBlue = { type: "rgb" as const, color: [0, 0, 255] as [number, number, number] };

      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, rgbRed, createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, defaultStrokeColor, rgbBlue, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare rgba colors correctly", () => {
      const rgbaRed = { type: "rgba" as const, color: [255, 0, 0, 1] as [number, number, number, number] };
      const rgbaBlue = { type: "rgba" as const, color: [0, 0, 255, 1] as [number, number, number, number] };

      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, rgbaRed, createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, defaultStrokeColor, rgbaBlue, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare hsl colors correctly", () => {
      const hslRed = { type: "hsl" as const, color: [0, 100, 50] as [number, number, number] };
      const hslBlue = { type: "hsl" as const, color: [240, 100, 50] as [number, number, number] };

      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, hslRed, createMockSVGElement());
      const circle2 = new Circle(20, 20, 5, defaultStrokeColor, hslBlue, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = checkUniqueColoredCircles(shapes, 2);

      expect(result).toBe(true);
    });
  });

  describe("4.3 checkUniqueColoredRectangles", () => {
    it("Should return true when all rectangles have unique colors", () => {
      const redFill = { type: "hex" as const, color: "#ff0000" };
      const blueFill = { type: "hex" as const, color: "#0000ff" };

      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, redFill, createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, blueFill, createMockSVGElement());
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
      const redFill = { type: "hex" as const, color: "#ff0000" };
      const blueFill = { type: "hex" as const, color: "#0000ff" };

      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, redFill, createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, blueFill, createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare rgb colors correctly", () => {
      const rgbRed = { type: "rgb" as const, color: [255, 0, 0] as [number, number, number] };
      const rgbBlue = { type: "rgb" as const, color: [0, 0, 255] as [number, number, number] };

      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, rgbRed, createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, rgbBlue, createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare rgba colors correctly", () => {
      const rgbaRed = { type: "rgba" as const, color: [255, 0, 0, 1] as [number, number, number, number] };
      const rgbaBlue = { type: "rgba" as const, color: [0, 0, 255, 1] as [number, number, number, number] };

      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, rgbaRed, createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, rgbaBlue, createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare hsl colors correctly", () => {
      const hslRed = { type: "hsl" as const, color: [0, 100, 50] as [number, number, number] };
      const hslBlue = { type: "hsl" as const, color: [240, 100, 50] as [number, number, number] };

      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, hslRed, createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, hslBlue, createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = checkUniqueColoredRectangles(shapes, 2);

      expect(result).toBe(true);
    });
  });

  describe("4.4 checkUniqueColoredLines", () => {
    it("Should return true when all lines have unique colors", () => {
      const redStroke = { type: "hex" as const, color: "#ff0000" };
      const blueStroke = { type: "hex" as const, color: "#0000ff" };

      const line1 = new Line(0, 0, 10, 10, redStroke, defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, blueStroke, defaultFillColor, createMockSVGElement());
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

    it("Should compare hex colors correctly", () => {
      const redStroke = { type: "hex" as const, color: "#ff0000" };
      const blueStroke = { type: "hex" as const, color: "#0000ff" };

      const line1 = new Line(0, 0, 10, 10, redStroke, defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, blueStroke, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare rgb colors correctly", () => {
      const rgbRed = { type: "rgb" as const, color: [255, 0, 0] as [number, number, number] };
      const rgbBlue = { type: "rgb" as const, color: [0, 0, 255] as [number, number, number] };

      const line1 = new Line(0, 0, 10, 10, rgbRed, defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, rgbBlue, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare rgba colors correctly", () => {
      const rgbaRed = { type: "rgba" as const, color: [255, 0, 0, 1] as [number, number, number, number] };
      const rgbaBlue = { type: "rgba" as const, color: [0, 0, 255, 1] as [number, number, number, number] };

      const line1 = new Line(0, 0, 10, 10, rgbaRed, defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, rgbaBlue, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(true);
    });

    it("Should compare hsl colors correctly", () => {
      const hslRed = { type: "hsl" as const, color: [0, 100, 50] as [number, number, number] };
      const hslBlue = { type: "hsl" as const, color: [240, 100, 50] as [number, number, number] };

      const line1 = new Line(0, 0, 10, 10, hslRed, defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 30, 30, hslBlue, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = checkUniqueColoredLines(shapes, 2);

      expect(result).toBe(true);
    });
  });
});
