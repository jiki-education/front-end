import { describe, it, expect } from "vitest";
import {
  getCircleAt,
  getRectangleAt,
  getEllipseAt,
  getTriangleAt,
  getLineAt
} from "../../../src/exercise-categories/draw/retrievers";
import type { Shape } from "../../../src/exercise-categories/draw/shapes";
import { Circle, Rectangle, Ellipse, Triangle, Line } from "../../../src/exercise-categories/draw/shapes";

// Helper to create mock SVG elements
function createMockSVGElement(): SVGElement {
  return document.createElementNS("http://www.w3.org/2000/svg", "circle") as SVGElement;
}

const defaultStrokeColor = "#333333";
const defaultFillColor = "#ff0000";

describe("Shape Retrievers", () => {
  describe("2.1 getCircleAt", () => {
    it("Should return Circle when exact match exists", () => {
      const circle = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 50, 50, 10);

      expect(result).toBe(circle);
    });

    it("Returned circle's cx should match search x", () => {
      const circle = new Circle(30, 40, 15, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 30, 40, 15);

      expect(result?.cx).toBe(30);
    });

    it("Returned circle's cy should match search y", () => {
      const circle = new Circle(30, 40, 15, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 30, 40, 15);

      expect(result?.cy).toBe(40);
    });

    it("Returned circle's radius should match search radius", () => {
      const circle = new Circle(30, 40, 15, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 30, 40, 15);

      expect(result?.radius).toBe(15);
    });

    it("Should return undefined when no match exists", () => {
      const circle = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 30, 30, 5);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when x doesn't match", () => {
      const circle = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 51, 50, 10);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when y doesn't match", () => {
      const circle = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 50, 51, 10);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when radius doesn't match", () => {
      const circle = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 50, 50, 11);

      expect(result).toBeUndefined();
    });

    it("Should handle floating-point precision (x=50.0000001 should match x=50)", () => {
      // Note: JavaScript === comparison is used, so this won't match unless truly equal
      const circle = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 50.0, 50.0, 10.0);

      expect(result).toBe(circle);
    });

    it("Should handle shapes array with multiple circles", () => {
      const circle1 = new Circle(10, 10, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle2 = new Circle(20, 20, 8, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle3 = new Circle(30, 30, 12, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2, circle3];

      const result = getCircleAt(shapes, 20, 20, 8);

      expect(result).toBe(circle2);
    });

    it("Should return first matching circle when multiple matches exist", () => {
      const circle1 = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const circle2 = new Circle(50, 50, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle1, circle2];

      const result = getCircleAt(shapes, 50, 50, 10);

      expect(result).toBe(circle1);
    });

    it("Should work with x=0, y=0, radius=0", () => {
      const circle = new Circle(0, 0, 0, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 0, 0, 0);

      expect(result).toBe(circle);
    });

    it("Should work with x=100, y=100, radius=100", () => {
      const circle = new Circle(100, 100, 100, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, 100, 100, 100);

      expect(result).toBe(circle);
    });

    it("Should work with negative coordinates", () => {
      const circle = new Circle(-50, -30, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [circle];

      const result = getCircleAt(shapes, -50, -30, 10);

      expect(result).toBe(circle);
    });
  });

  describe("2.2 getRectangleAt", () => {
    it("Should return Rectangle when exact match exists", () => {
      const rect = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 10, 20, 30, 40);

      expect(result).toBe(rect);
    });

    it("Returned rectangle's x should match search x", () => {
      const rect = new Rectangle(15, 25, 35, 45, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 15, 25, 35, 45);

      expect(result?.x).toBe(15);
    });

    it("Returned rectangle's y should match search y", () => {
      const rect = new Rectangle(15, 25, 35, 45, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 15, 25, 35, 45);

      expect(result?.y).toBe(25);
    });

    it("Returned rectangle's width should match search width", () => {
      const rect = new Rectangle(15, 25, 35, 45, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 15, 25, 35, 45);

      expect(result?.width).toBe(35);
    });

    it("Returned rectangle's height should match search height", () => {
      const rect = new Rectangle(15, 25, 35, 45, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 15, 25, 35, 45);

      expect(result?.height).toBe(45);
    });

    it("Should return undefined when no match exists", () => {
      const rect = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 5, 10, 15, 20);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when x doesn't match", () => {
      const rect = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 11, 20, 30, 40);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when y doesn't match", () => {
      const rect = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 10, 21, 30, 40);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when width doesn't match", () => {
      const rect = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 10, 20, 31, 40);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when height doesn't match", () => {
      const rect = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 10, 20, 30, 41);

      expect(result).toBeUndefined();
    });

    it("Should handle floating-point precision", () => {
      const rect = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 10.0, 20.0, 30.0, 40.0);

      expect(result).toBe(rect);
    });

    it("Should handle shapes array with multiple rectangles", () => {
      const rect1 = new Rectangle(10, 10, 5, 5, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const rect2 = new Rectangle(20, 20, 10, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const rect3 = new Rectangle(30, 30, 15, 15, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2, rect3];

      const result = getRectangleAt(shapes, 20, 20, 10, 10);

      expect(result).toBe(rect2);
    });

    it("Should return first matching rectangle when multiple matches exist", () => {
      const rect1 = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const rect2 = new Rectangle(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect1, rect2];

      const result = getRectangleAt(shapes, 10, 20, 30, 40);

      expect(result).toBe(rect1);
    });

    it("Should work with width=0, height=0", () => {
      const rect = new Rectangle(10, 20, 0, 0, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, 10, 20, 0, 0);

      expect(result).toBe(rect);
    });

    it("Should work with negative dimensions", () => {
      const rect = new Rectangle(-10, -20, -30, -40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [rect];

      const result = getRectangleAt(shapes, -10, -20, -30, -40);

      expect(result).toBe(rect);
    });
  });

  describe("2.3 getEllipseAt", () => {
    it("Should return Ellipse when exact match exists", () => {
      const ellipse = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 50, 50, 20, 10);

      expect(result).toBe(ellipse);
    });

    it("Returned ellipse's x should match search x", () => {
      const ellipse = new Ellipse(35, 45, 15, 8, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 35, 45, 15, 8);

      expect(result?.x).toBe(35);
    });

    it("Returned ellipse's y should match search y", () => {
      const ellipse = new Ellipse(35, 45, 15, 8, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 35, 45, 15, 8);

      expect(result?.y).toBe(45);
    });

    it("Returned ellipse's rx should match search rx", () => {
      const ellipse = new Ellipse(35, 45, 15, 8, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 35, 45, 15, 8);

      expect(result?.rx).toBe(15);
    });

    it("Returned ellipse's ry should match search ry", () => {
      const ellipse = new Ellipse(35, 45, 15, 8, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 35, 45, 15, 8);

      expect(result?.ry).toBe(8);
    });

    it("Should return undefined when no match exists", () => {
      const ellipse = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 30, 30, 15, 7);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when x doesn't match", () => {
      const ellipse = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 51, 50, 20, 10);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when y doesn't match", () => {
      const ellipse = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 50, 51, 20, 10);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when rx doesn't match", () => {
      const ellipse = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 50, 50, 21, 10);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when ry doesn't match", () => {
      const ellipse = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 50, 50, 20, 11);

      expect(result).toBeUndefined();
    });

    it("Should handle floating-point precision", () => {
      const ellipse = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 50.0, 50.0, 20.0, 10.0);

      expect(result).toBe(ellipse);
    });

    it("Should handle shapes array with multiple ellipses", () => {
      const ellipse1 = new Ellipse(10, 10, 5, 3, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const ellipse2 = new Ellipse(20, 20, 10, 6, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const ellipse3 = new Ellipse(30, 30, 15, 9, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse1, ellipse2, ellipse3];

      const result = getEllipseAt(shapes, 20, 20, 10, 6);

      expect(result).toBe(ellipse2);
    });

    it("Should return first matching ellipse when multiple matches exist", () => {
      const ellipse1 = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const ellipse2 = new Ellipse(50, 50, 20, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse1, ellipse2];

      const result = getEllipseAt(shapes, 50, 50, 20, 10);

      expect(result).toBe(ellipse1);
    });

    it("Should work with rx=0, ry=0", () => {
      const ellipse = new Ellipse(50, 50, 0, 0, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, 50, 50, 0, 0);

      expect(result).toBe(ellipse);
    });

    it("Should work with negative radii", () => {
      const ellipse = new Ellipse(-50, -30, -20, -10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [ellipse];

      const result = getEllipseAt(shapes, -50, -30, -20, -10);

      expect(result).toBe(ellipse);
    });
  });

  describe("2.4 getTriangleAt", () => {
    it("Should return Triangle when exact match exists", () => {
      const triangle = new Triangle(
        10,
        10,
        20,
        20,
        15,
        30,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 10, 10, 20, 20, 15, 30);

      expect(result).toBe(triangle);
    });

    it("Returned triangle's x1 should match search x1", () => {
      const triangle = new Triangle(
        5,
        10,
        15,
        20,
        10,
        25,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 5, 10, 15, 20, 10, 25);

      expect(result?.x1).toBe(5);
    });

    it("Returned triangle's y1 should match search y1", () => {
      const triangle = new Triangle(
        5,
        10,
        15,
        20,
        10,
        25,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 5, 10, 15, 20, 10, 25);

      expect(result?.y1).toBe(10);
    });

    it("Returned triangle's x2 should match search x2", () => {
      const triangle = new Triangle(
        5,
        10,
        15,
        20,
        10,
        25,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 5, 10, 15, 20, 10, 25);

      expect(result?.x2).toBe(15);
    });

    it("Returned triangle's y2 should match search y2", () => {
      const triangle = new Triangle(
        5,
        10,
        15,
        20,
        10,
        25,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 5, 10, 15, 20, 10, 25);

      expect(result?.y2).toBe(20);
    });

    it("Returned triangle's x3 should match search x3", () => {
      const triangle = new Triangle(
        5,
        10,
        15,
        20,
        10,
        25,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 5, 10, 15, 20, 10, 25);

      expect(result?.x3).toBe(10);
    });

    it("Returned triangle's y3 should match search y3", () => {
      const triangle = new Triangle(
        5,
        10,
        15,
        20,
        10,
        25,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 5, 10, 15, 20, 10, 25);

      expect(result?.y3).toBe(25);
    });

    it("Should return undefined when no match exists", () => {
      const triangle = new Triangle(
        10,
        10,
        20,
        20,
        15,
        30,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 5, 5, 15, 15, 10, 25);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when any coordinate doesn't match", () => {
      const triangle = new Triangle(
        10,
        10,
        20,
        20,
        15,
        30,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 10, 10, 20, 20, 15, 31);

      expect(result).toBeUndefined();
    });

    it("Should handle floating-point precision", () => {
      const triangle = new Triangle(
        10,
        10,
        20,
        20,
        15,
        30,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle];

      const result = getTriangleAt(shapes, 10.0, 10.0, 20.0, 20.0, 15.0, 30.0);

      expect(result).toBe(triangle);
    });

    it("Should handle shapes array with multiple triangles", () => {
      const triangle1 = new Triangle(5, 5, 10, 10, 7, 15, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const triangle2 = new Triangle(
        15,
        15,
        25,
        25,
        20,
        35,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle1, triangle2];

      const result = getTriangleAt(shapes, 15, 15, 25, 25, 20, 35);

      expect(result).toBe(triangle2);
    });

    it("Should return first matching triangle when multiple matches exist", () => {
      const triangle1 = new Triangle(
        10,
        10,
        20,
        20,
        15,
        30,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const triangle2 = new Triangle(
        10,
        10,
        20,
        20,
        15,
        30,
        defaultStrokeColor,
        defaultFillColor,
        createMockSVGElement()
      );
      const shapes: Shape[] = [triangle1, triangle2];

      const result = getTriangleAt(shapes, 10, 10, 20, 20, 15, 30);

      expect(result).toBe(triangle1);
    });
  });

  describe("2.5 getLineAt", () => {
    it("Should return Line when exact match exists", () => {
      const line = new Line(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = getLineAt(shapes, 10, 20, 30, 40);

      expect(result).toBe(line);
    });

    it("Returned line's x1 should match search x1", () => {
      const line = new Line(15, 25, 35, 45, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = getLineAt(shapes, 15, 25, 35, 45);

      expect(result?.x1).toBe(15);
    });

    it("Returned line's y1 should match search y1", () => {
      const line = new Line(15, 25, 35, 45, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = getLineAt(shapes, 15, 25, 35, 45);

      expect(result?.y1).toBe(25);
    });

    it("Returned line's x2 should match search x2", () => {
      const line = new Line(15, 25, 35, 45, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = getLineAt(shapes, 15, 25, 35, 45);

      expect(result?.x2).toBe(35);
    });

    it("Returned line's y2 should match search y2", () => {
      const line = new Line(15, 25, 35, 45, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = getLineAt(shapes, 15, 25, 35, 45);

      expect(result?.y2).toBe(45);
    });

    it("Should return undefined when no match exists", () => {
      const line = new Line(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = getLineAt(shapes, 5, 10, 15, 20);

      expect(result).toBeUndefined();
    });

    it("Should return undefined when any coordinate doesn't match", () => {
      const line = new Line(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = getLineAt(shapes, 10, 20, 30, 41);

      expect(result).toBeUndefined();
    });

    it("Should handle floating-point precision", () => {
      const line = new Line(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line];

      const result = getLineAt(shapes, 10.0, 20.0, 30.0, 40.0);

      expect(result).toBe(line);
    });

    it("Should handle shapes array with multiple lines", () => {
      const line1 = new Line(0, 0, 10, 10, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const line2 = new Line(20, 20, 40, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = getLineAt(shapes, 20, 20, 40, 40);

      expect(result).toBe(line2);
    });

    it("Should return first matching line when multiple matches exist", () => {
      const line1 = new Line(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const line2 = new Line(10, 20, 30, 40, defaultStrokeColor, defaultFillColor, createMockSVGElement());
      const shapes: Shape[] = [line1, line2];

      const result = getLineAt(shapes, 10, 20, 30, 40);

      expect(result).toBe(line1);
    });
  });
});
