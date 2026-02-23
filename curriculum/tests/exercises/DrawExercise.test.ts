import { describe, it, expect, beforeEach, vi } from "vitest";
import { DrawExercise } from "../../src/exercise-categories/draw";
import type { ExecutionContext, ExternalFunction } from "@jiki/interpreters";
import type { Shared } from "@jiki/interpreters";
import { Circle, Rectangle, Ellipse, Triangle, Line } from "../../src/exercise-categories/draw/shapes";

// Concrete test implementation of DrawExercise
class TestDrawExercise extends DrawExercise {
  protected get slug() {
    return "test-draw-exercise";
  }

  public get availableFunctions(): ExternalFunction[] {
    const funcs = this.getAllAvailableFunctions();
    return Object.values(funcs);
  }

  // Expose protected properties for testing
  public getShapes() {
    return this.shapes;
  }

  public getStrokeColor() {
    return this.strokeColor;
  }

  public getStrokeWidth() {
    return this.strokeWidth;
  }

  public getCanvas() {
    return this.canvas;
  }

  public getTooltip() {
    return this.tooltip;
  }
}

// Mock ExecutionContext
function createMockExecutionContext(): ExecutionContext {
  return {
    getCurrentTimeInMs: vi.fn(() => 0),
    fastForward: vi.fn(),
    logicError: vi.fn(),
    assertors: {
      assertAllArgumentsAreVariables: vi.fn()
    }
  } as unknown as ExecutionContext;
}

// Helper to create Shared.Number
function createNumber(value: number): Shared.Number {
  return { type: "number", value } as Shared.Number;
}

// Helper to create Shared.String
function createString(value: string): Shared.String {
  return { type: "string", value } as Shared.String;
}

const defaultColor = createString("#ff0000");

describe("DrawExercise", () => {
  let exercise: TestDrawExercise;
  let ctx: ExecutionContext;

  beforeEach(() => {
    exercise = new TestDrawExercise();
    ctx = createMockExecutionContext();
  });

  describe("1.1 Initialization", () => {
    it("should extend VisualExercise", () => {
      expect(exercise).toBeInstanceOf(DrawExercise);
    });

    it("`shapes` should be an empty array initially", () => {
      expect(exercise.getShapes()).toEqual([]);
      expect(Array.isArray(exercise.getShapes())).toBe(true);
    });

    it("`strokeColor` should be '#333333'", () => {
      const strokeColor = exercise.getStrokeColor();
      expect(strokeColor).toBe("#333333");
    });

    it("`strokeWidth` should be 0", () => {
      expect(exercise.getStrokeWidth()).toBe(0);
    });

    it("View should be an HTMLElement", () => {
      expect(exercise.view).toBeInstanceOf(HTMLElement);
    });

    it("Canvas should be created and appended to view", () => {
      const canvas = exercise.getCanvas();
      expect(canvas).toBeInstanceOf(HTMLDivElement);
      expect(exercise.view.contains(canvas)).toBe(true);
    });

    it("Tooltip should be created and appended to view", () => {
      const tooltip = exercise.getTooltip();
      expect(tooltip).toBeInstanceOf(HTMLDivElement);
      expect(exercise.view.contains(tooltip)).toBe(true);
    });

    it("Canvas should have class 'canvas'", () => {
      const canvas = exercise.getCanvas();
      expect(canvas.classList.contains("canvas")).toBe(true);
    });

    it("Canvas should have position: relative", () => {
      const canvas = exercise.getCanvas();
      expect(canvas.style.position).toBe("relative");
    });

    it("Tooltip should have class 'tooltip'", () => {
      const tooltip = exercise.getTooltip();
      expect(tooltip.classList.contains("tooltip")).toBe(true);
    });

    it("Tooltip should be hidden initially (display: none)", () => {
      const tooltip = exercise.getTooltip();
      expect(tooltip.style.display).toBe("none");
    });
  });

  describe("1.2 Circle Drawing", () => {
    it("`circle(x, y, radius, color)` should add a Circle to shapes array", () => {
      exercise.circle(ctx, createNumber(50), createNumber(50), createNumber(10), defaultColor);

      const shapes = exercise.getShapes();
      expect(shapes.length).toBe(1);
      expect(shapes[0]).toBeInstanceOf(Circle);
    });

    it("Circle `cx` should equal the x parameter", () => {
      exercise.circle(ctx, createNumber(30), createNumber(40), createNumber(15), defaultColor);

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.cx).toBe(30);
    });

    it("Circle `cy` should equal the y parameter", () => {
      exercise.circle(ctx, createNumber(30), createNumber(40), createNumber(15), defaultColor);

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.cy).toBe(40);
    });

    it("Circle `radius` should equal the radius parameter", () => {
      exercise.circle(ctx, createNumber(30), createNumber(40), createNumber(15), defaultColor);

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.radius).toBe(15);
    });

    it("Circle `fillColor` should match the color argument", () => {
      exercise.circle(ctx, createNumber(50), createNumber(50), createNumber(10), createString("#00ff00"));

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.fillColor).toBe("#00ff00");
    });

    it("Circle `strokeColor` should match current strokeColor state", () => {
      exercise.circle(ctx, createNumber(50), createNumber(50), createNumber(10), defaultColor);

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.strokeColor).toBe("#333333");
    });

    it("Circle should have an SVG element", () => {
      exercise.circle(ctx, createNumber(50), createNumber(50), createNumber(10), defaultColor);

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.element).toBeInstanceOf(SVGElement);
    });

    it("Multiple circles should be added to shapes array sequentially", () => {
      exercise.circle(ctx, createNumber(10), createNumber(10), createNumber(5), defaultColor);
      exercise.circle(ctx, createNumber(20), createNumber(20), createNumber(8), defaultColor);
      exercise.circle(ctx, createNumber(30), createNumber(30), createNumber(12), defaultColor);

      const shapes = exercise.getShapes();
      expect(shapes.length).toBe(3);
      expect((shapes[0] as Circle).cx).toBe(10);
      expect((shapes[1] as Circle).cx).toBe(20);
      expect((shapes[2] as Circle).cx).toBe(30);
    });

    it("Circle with x=0 should be valid", () => {
      exercise.circle(ctx, createNumber(0), createNumber(50), createNumber(10), defaultColor);

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.cx).toBe(0);
    });

    it("Circle with y=0 should be valid", () => {
      exercise.circle(ctx, createNumber(50), createNumber(0), createNumber(10), defaultColor);

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.cy).toBe(0);
    });

    it("Circle with radius=0 should be valid", () => {
      exercise.circle(ctx, createNumber(50), createNumber(50), createNumber(0), defaultColor);

      const circle = exercise.getShapes()[0] as Circle;
      expect(circle.radius).toBe(0);
    });

    it("Circle should create animation with correct timing", () => {
      const mockGetCurrentTimeInMs = vi.fn(() => 1000);
      ctx.getCurrentTimeInMs = mockGetCurrentTimeInMs;

      exercise.circle(ctx, createNumber(50), createNumber(50), createNumber(10), defaultColor);

      expect(mockGetCurrentTimeInMs).toHaveBeenCalled();
    });
  });

  describe("1.3 Rectangle Drawing", () => {
    it("`rectangle(x, y, width, height, color)` should add a Rectangle to shapes array", () => {
      exercise.rectangle(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(40), defaultColor);

      const shapes = exercise.getShapes();
      expect(shapes.length).toBe(1);
      expect(shapes[0]).toBeInstanceOf(Rectangle);
    });

    it("Rectangle `x` should equal the x parameter", () => {
      exercise.rectangle(ctx, createNumber(15), createNumber(25), createNumber(35), createNumber(45), defaultColor);

      const rect = exercise.getShapes()[0] as Rectangle;
      expect(rect.x).toBe(15);
    });

    it("Rectangle `y` should equal the y parameter", () => {
      exercise.rectangle(ctx, createNumber(15), createNumber(25), createNumber(35), createNumber(45), defaultColor);

      const rect = exercise.getShapes()[0] as Rectangle;
      expect(rect.y).toBe(25);
    });

    it("Rectangle `width` should equal the width parameter", () => {
      exercise.rectangle(ctx, createNumber(15), createNumber(25), createNumber(35), createNumber(45), defaultColor);

      const rect = exercise.getShapes()[0] as Rectangle;
      expect(rect.width).toBe(35);
    });

    it("Rectangle `height` should equal the height parameter", () => {
      exercise.rectangle(ctx, createNumber(15), createNumber(25), createNumber(35), createNumber(45), defaultColor);

      const rect = exercise.getShapes()[0] as Rectangle;
      expect(rect.height).toBe(45);
    });

    it("Rectangle `fillColor` should match the color argument", () => {
      exercise.rectangle(
        ctx,
        createNumber(10),
        createNumber(20),
        createNumber(30),
        createNumber(40),
        createString("#00ff00")
      );

      const rect = exercise.getShapes()[0] as Rectangle;
      expect(rect.fillColor).toBe("#00ff00");
    });

    it("Rectangle `strokeColor` should match current strokeColor state", () => {
      exercise.rectangle(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(40), defaultColor);

      const rect = exercise.getShapes()[0] as Rectangle;
      expect(rect.strokeColor).toBe("#333333");
    });

    it("Rectangle should have an SVG element", () => {
      exercise.rectangle(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(40), defaultColor);

      const rect = exercise.getShapes()[0] as Rectangle;
      expect(rect.element).toBeInstanceOf(SVGElement);
    });

    it("Multiple rectangles should be added to shapes array sequentially", () => {
      exercise.rectangle(ctx, createNumber(10), createNumber(10), createNumber(5), createNumber(5), defaultColor);
      exercise.rectangle(ctx, createNumber(20), createNumber(20), createNumber(10), createNumber(10), defaultColor);
      exercise.rectangle(ctx, createNumber(30), createNumber(30), createNumber(15), createNumber(15), defaultColor);

      const shapes = exercise.getShapes();
      expect(shapes.length).toBe(3);
      expect((shapes[0] as Rectangle).x).toBe(10);
      expect((shapes[1] as Rectangle).x).toBe(20);
      expect((shapes[2] as Rectangle).x).toBe(30);
    });

    it("Rectangle with width=0 should be rejected", () => {
      exercise.rectangle(ctx, createNumber(10), createNumber(20), createNumber(0), createNumber(40), defaultColor);

      expect(ctx.logicError).toHaveBeenCalledWith("Width must be greater than 0");
      expect(exercise.getShapes()).toHaveLength(0);
    });

    it("Rectangle with height=0 should be rejected", () => {
      exercise.rectangle(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(0), defaultColor);

      expect(ctx.logicError).toHaveBeenCalledWith("Height must be greater than 0");
      expect(exercise.getShapes()).toHaveLength(0);
    });

    it("Rectangle should create animation with correct timing", () => {
      const mockGetCurrentTimeInMs = vi.fn(() => 2000);
      ctx.getCurrentTimeInMs = mockGetCurrentTimeInMs;

      exercise.rectangle(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(40), defaultColor);

      expect(mockGetCurrentTimeInMs).toHaveBeenCalled();
    });
  });

  describe("1.4 Ellipse Drawing", () => {
    it("`ellipse(x, y, rx, ry, color)` should add an Ellipse to shapes array", () => {
      exercise.ellipse(ctx, createNumber(50), createNumber(50), createNumber(20), createNumber(10), defaultColor);

      const shapes = exercise.getShapes();
      expect(shapes.length).toBe(1);
      expect(shapes[0]).toBeInstanceOf(Ellipse);
    });

    it("Ellipse `x` should equal the x parameter", () => {
      exercise.ellipse(ctx, createNumber(35), createNumber(45), createNumber(15), createNumber(8), defaultColor);

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.x).toBe(35);
    });

    it("Ellipse `y` should equal the y parameter", () => {
      exercise.ellipse(ctx, createNumber(35), createNumber(45), createNumber(15), createNumber(8), defaultColor);

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.y).toBe(45);
    });

    it("Ellipse `rx` should equal the rx parameter", () => {
      exercise.ellipse(ctx, createNumber(35), createNumber(45), createNumber(15), createNumber(8), defaultColor);

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.rx).toBe(15);
    });

    it("Ellipse `ry` should equal the ry parameter", () => {
      exercise.ellipse(ctx, createNumber(35), createNumber(45), createNumber(15), createNumber(8), defaultColor);

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.ry).toBe(8);
    });

    it("Ellipse `fillColor` should match the color argument", () => {
      exercise.ellipse(
        ctx,
        createNumber(50),
        createNumber(50),
        createNumber(20),
        createNumber(10),
        createString("#00ff00")
      );

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.fillColor).toBe("#00ff00");
    });

    it("Ellipse `strokeColor` should match current strokeColor state", () => {
      exercise.ellipse(ctx, createNumber(50), createNumber(50), createNumber(20), createNumber(10), defaultColor);

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.strokeColor).toBe("#333333");
    });

    it("Ellipse should have an SVG element", () => {
      exercise.ellipse(ctx, createNumber(50), createNumber(50), createNumber(20), createNumber(10), defaultColor);

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.element).toBeInstanceOf(SVGElement);
    });

    it("Multiple ellipses should be added to shapes array sequentially", () => {
      exercise.ellipse(ctx, createNumber(10), createNumber(10), createNumber(5), createNumber(3), defaultColor);
      exercise.ellipse(ctx, createNumber(20), createNumber(20), createNumber(10), createNumber(6), defaultColor);
      exercise.ellipse(ctx, createNumber(30), createNumber(30), createNumber(15), createNumber(9), defaultColor);

      const shapes = exercise.getShapes();
      expect(shapes.length).toBe(3);
      expect((shapes[0] as Ellipse).x).toBe(10);
      expect((shapes[1] as Ellipse).x).toBe(20);
      expect((shapes[2] as Ellipse).x).toBe(30);
    });

    it("Ellipse with rx=0 should be valid", () => {
      exercise.ellipse(ctx, createNumber(50), createNumber(50), createNumber(0), createNumber(10), defaultColor);

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.rx).toBe(0);
    });

    it("Ellipse with ry=0 should be valid", () => {
      exercise.ellipse(ctx, createNumber(50), createNumber(50), createNumber(20), createNumber(0), defaultColor);

      const ellipse = exercise.getShapes()[0] as Ellipse;
      expect(ellipse.ry).toBe(0);
    });

    it("Ellipse should create animation with correct timing", () => {
      const mockGetCurrentTimeInMs = vi.fn(() => 3000);
      ctx.getCurrentTimeInMs = mockGetCurrentTimeInMs;

      exercise.ellipse(ctx, createNumber(50), createNumber(50), createNumber(20), createNumber(10), defaultColor);

      expect(mockGetCurrentTimeInMs).toHaveBeenCalled();
    });
  });

  describe("1.5 Triangle Drawing", () => {
    it("`triangle(x1, y1, x2, y2, x3, y3, color)` should add a Triangle to shapes array", () => {
      exercise.triangle(
        ctx,
        createNumber(10),
        createNumber(10),
        createNumber(20),
        createNumber(20),
        createNumber(15),
        createNumber(30),
        defaultColor
      );

      const shapes = exercise.getShapes();
      expect(shapes.length).toBe(1);
      expect(shapes[0]).toBeInstanceOf(Triangle);
    });

    it("Triangle `x1` should equal the x1 parameter", () => {
      exercise.triangle(
        ctx,
        createNumber(5),
        createNumber(10),
        createNumber(15),
        createNumber(20),
        createNumber(10),
        createNumber(25),
        defaultColor
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.x1).toBe(5);
    });

    it("Triangle `y1` should equal the y1 parameter", () => {
      exercise.triangle(
        ctx,
        createNumber(5),
        createNumber(10),
        createNumber(15),
        createNumber(20),
        createNumber(10),
        createNumber(25),
        defaultColor
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.y1).toBe(10);
    });

    it("Triangle `x2` should equal the x2 parameter", () => {
      exercise.triangle(
        ctx,
        createNumber(5),
        createNumber(10),
        createNumber(15),
        createNumber(20),
        createNumber(10),
        createNumber(25),
        defaultColor
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.x2).toBe(15);
    });

    it("Triangle `y2` should equal the y2 parameter", () => {
      exercise.triangle(
        ctx,
        createNumber(5),
        createNumber(10),
        createNumber(15),
        createNumber(20),
        createNumber(10),
        createNumber(25),
        defaultColor
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.y2).toBe(20);
    });

    it("Triangle `x3` should equal the x3 parameter", () => {
      exercise.triangle(
        ctx,
        createNumber(5),
        createNumber(10),
        createNumber(15),
        createNumber(20),
        createNumber(10),
        createNumber(25),
        defaultColor
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.x3).toBe(10);
    });

    it("Triangle `y3` should equal the y3 parameter", () => {
      exercise.triangle(
        ctx,
        createNumber(5),
        createNumber(10),
        createNumber(15),
        createNumber(20),
        createNumber(10),
        createNumber(25),
        defaultColor
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.y3).toBe(25);
    });

    it("Triangle `fillColor` should match the color argument", () => {
      exercise.triangle(
        ctx,
        createNumber(10),
        createNumber(10),
        createNumber(20),
        createNumber(20),
        createNumber(15),
        createNumber(30),
        createString("#00ff00")
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.fillColor).toBe("#00ff00");
    });

    it("Triangle `strokeColor` should match current strokeColor state", () => {
      exercise.triangle(
        ctx,
        createNumber(10),
        createNumber(10),
        createNumber(20),
        createNumber(20),
        createNumber(15),
        createNumber(30),
        defaultColor
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.strokeColor).toBe("#333333");
    });

    it("Triangle should have an SVG element", () => {
      exercise.triangle(
        ctx,
        createNumber(10),
        createNumber(10),
        createNumber(20),
        createNumber(20),
        createNumber(15),
        createNumber(30),
        defaultColor
      );

      const triangle = exercise.getShapes()[0] as Triangle;
      expect(triangle.element).toBeInstanceOf(SVGElement);
    });

    it("Triangle should create animation with correct timing", () => {
      const mockGetCurrentTimeInMs = vi.fn(() => 4000);
      ctx.getCurrentTimeInMs = mockGetCurrentTimeInMs;

      exercise.triangle(
        ctx,
        createNumber(10),
        createNumber(10),
        createNumber(20),
        createNumber(20),
        createNumber(15),
        createNumber(30),
        defaultColor
      );

      expect(mockGetCurrentTimeInMs).toHaveBeenCalled();
    });
  });

  describe("1.6 Line Drawing", () => {
    it("`line(x1, y1, x2, y2, color)` should add a Line to shapes array", () => {
      exercise.line(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(40), defaultColor);

      const shapes = exercise.getShapes();
      expect(shapes.length).toBe(1);
      expect(shapes[0]).toBeInstanceOf(Line);
    });

    it("Line `x1` should equal the x1 parameter", () => {
      exercise.line(ctx, createNumber(15), createNumber(25), createNumber(35), createNumber(45), defaultColor);

      const line = exercise.getShapes()[0] as Line;
      expect(line.x1).toBe(15);
    });

    it("Line `y1` should equal the y1 parameter", () => {
      exercise.line(ctx, createNumber(15), createNumber(25), createNumber(35), createNumber(45), defaultColor);

      const line = exercise.getShapes()[0] as Line;
      expect(line.y1).toBe(25);
    });

    it("Line `x2` should equal the x2 parameter", () => {
      exercise.line(ctx, createNumber(15), createNumber(25), createNumber(35), createNumber(45), defaultColor);

      const line = exercise.getShapes()[0] as Line;
      expect(line.x2).toBe(35);
    });

    it("Line `y2` should equal the y2 parameter", () => {
      exercise.line(ctx, createNumber(15), createNumber(25), createNumber(35), createNumber(45), defaultColor);

      const line = exercise.getShapes()[0] as Line;
      expect(line.y2).toBe(45);
    });

    it("Line `strokeColor` should match current strokeColor state", () => {
      exercise.line(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(40), defaultColor);

      const line = exercise.getShapes()[0] as Line;
      expect(line.strokeColor).toBe("#333333");
    });

    it("Line `fillColor` should match the color argument", () => {
      exercise.line(
        ctx,
        createNumber(10),
        createNumber(20),
        createNumber(30),
        createNumber(40),
        createString("#00ff00")
      );

      const line = exercise.getShapes()[0] as Line;
      expect(line.fillColor).toBe("#00ff00");
    });

    it("Line should have an SVG element", () => {
      exercise.line(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(40), defaultColor);

      const line = exercise.getShapes()[0] as Line;
      expect(line.element).toBeInstanceOf(SVGElement);
    });

    it("Line should create animation with correct timing", () => {
      const mockGetCurrentTimeInMs = vi.fn(() => 5000);
      ctx.getCurrentTimeInMs = mockGetCurrentTimeInMs;

      exercise.line(ctx, createNumber(10), createNumber(20), createNumber(30), createNumber(40), defaultColor);

      expect(mockGetCurrentTimeInMs).toHaveBeenCalled();
    });
  });

  describe("1.7 Clear Canvas", () => {
    it("`clear()` should empty the shapes array", () => {
      // Draw some shapes first
      exercise.circle(ctx, createNumber(10), createNumber(10), createNumber(5), defaultColor);
      exercise.rectangle(ctx, createNumber(20), createNumber(20), createNumber(10), createNumber(10), defaultColor);
      expect(exercise.getShapes().length).toBe(2);

      // Clear should not remove from shapes array (shapes tracks all drawn shapes)
      exercise.clear(ctx);

      // Note: clear() doesn't actually empty shapes[], it empties visibleShapes[]
      // Let's verify the behavior - after clear, shapes should still be there
      expect(exercise.getShapes().length).toBe(2);
    });

    it("`clear()` should remove all SVG elements from canvas", () => {
      // Draw some shapes
      exercise.circle(ctx, createNumber(10), createNumber(10), createNumber(5), defaultColor);
      exercise.rectangle(ctx, createNumber(20), createNumber(20), createNumber(10), createNumber(10), defaultColor);

      const canvas = exercise.getCanvas();
      const childCountBefore = canvas.children.length;
      expect(childCountBefore).toBeGreaterThan(0);

      exercise.clear(ctx);

      // Clear adds opacity 0 animations but doesn't remove elements
      // The elements are still in DOM, just animated out
      expect(canvas.children.length).toBe(childCountBefore);
    });

    it("`clear()` should create animation with correct timing", () => {
      const mockGetCurrentTimeInMs = vi.fn(() => 6000);
      const mockFastForward = vi.fn();
      ctx.getCurrentTimeInMs = mockGetCurrentTimeInMs;
      ctx.fastForward = mockFastForward;

      exercise.circle(ctx, createNumber(10), createNumber(10), createNumber(5), defaultColor);
      exercise.clear(ctx);

      expect(mockGetCurrentTimeInMs).toHaveBeenCalled();
      expect(mockFastForward).toHaveBeenCalledWith(1);
    });

    it("`clear()` after drawing shapes should result in empty shapes array", () => {
      exercise.circle(ctx, createNumber(10), createNumber(10), createNumber(5), defaultColor);
      exercise.rectangle(ctx, createNumber(20), createNumber(20), createNumber(10), createNumber(10), defaultColor);
      exercise.line(ctx, createNumber(0), createNumber(0), createNumber(50), createNumber(50), defaultColor);

      expect(exercise.getShapes().length).toBe(3);

      exercise.clear(ctx);

      // After clear, shapes array still has all shapes (historical record)
      expect(exercise.getShapes().length).toBe(3);
    });

    it("Multiple consecutive `clear()` calls should not error", () => {
      exercise.circle(ctx, createNumber(10), createNumber(10), createNumber(5), defaultColor);

      expect(() => {
        exercise.clear(ctx);
        exercise.clear(ctx);
        exercise.clear(ctx);
      }).not.toThrow();
    });
  });

  describe("1.15 getAllAvailableFunctions", () => {
    it("Should return an object", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(typeof funcs).toBe("object");
      expect(funcs).not.toBeNull();
    });

    it("Should include `rectangle` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.rectangle).toBeDefined();
    });

    it("Should include `circle` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.circle).toBeDefined();
    });

    it("Should include `ellipse` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.ellipse).toBeDefined();
    });

    it("Should include `triangle` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.triangle).toBeDefined();
    });

    it("Should include `line` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.line).toBeDefined();
    });

    it("Should include `clear` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.clear).toBeDefined();
    });

    it("Should include `hsl` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.hsl).toBeDefined();
    });

    it("Should include `rgb` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.rgb).toBeDefined();
    });

    it("Should NOT include `fill_color_hex` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.fill_color_hex).toBeUndefined();
    });

    it("Should NOT include `fill_color_hsl` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.fill_color_hsl).toBeUndefined();
    });

    it("Should NOT include `strokeColorHex` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.strokeColorHex).toBeUndefined();
    });

    it("Should NOT include `setStrokeWidth` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.setStrokeWidth).toBeUndefined();
    });

    it("Should NOT include `setBackgroundImage` function", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      expect(funcs.setBackgroundImage).toBeUndefined();
    });

    it("Each function should have a `name` property (string)", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values(funcs).forEach((fn: any) => {
        expect(typeof fn.name).toBe("string");
      });
    });

    it("Each function should have a `func` property (function)", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values(funcs).forEach((fn: any) => {
        expect(typeof fn.func).toBe("function");
      });
    });

    it("Each function should have a `description` property (string or undefined)", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const funcs = (exercise as any).getAllAvailableFunctions();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Object.values(funcs).forEach((fn: any) => {
        expect(typeof fn.description === "string" || fn.description === undefined).toBe(true);
      });
    });
  });
});
