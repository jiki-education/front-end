import { describe, it, expect } from "vitest";
import { Shape, Circle, Rectangle, Ellipse, Triangle, Line } from "../../../src/exercise-categories/draw/shapes";

// Helper to create mock SVG elements
function createMockSVGElement(): SVGElement {
  return document.createElementNS("http://www.w3.org/2000/svg", "circle") as SVGElement;
}

describe("Shape Classes", () => {
  describe("5.1 Circle Class", () => {
    const strokeColor = { type: "hex" as const, color: "#333333" };
    const fillColor = { type: "hex" as const, color: "#ff0000" };
    const element = createMockSVGElement();

    it("Should construct with all parameters", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(circle).toBeInstanceOf(Circle);
    });

    it("`cx` should be a number", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(typeof circle.cx).toBe("number");
    });

    it("`cy` should be a number", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(typeof circle.cy).toBe("number");
    });

    it("`radius` should be a number", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(typeof circle.radius).toBe("number");
    });

    it("`strokeColor` should be a Color object", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(circle.strokeColor).toHaveProperty("type");
      expect(circle.strokeColor).toHaveProperty("color");
    });

    it("`fillColor` should be a Color object", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(circle.fillColor).toHaveProperty("type");
      expect(circle.fillColor).toHaveProperty("color");
    });

    it("`element` should be an SVGElement", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(circle.element).toBeInstanceOf(SVGElement);
    });

    it("Should extend Shape class", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(circle).toBeInstanceOf(Shape);
    });

    it("Should store cx correctly", () => {
      const circle = new Circle(75, 60, 10, strokeColor, fillColor, element);

      expect(circle.cx).toBe(75);
    });

    it("Should store cy correctly", () => {
      const circle = new Circle(50, 85, 10, strokeColor, fillColor, element);

      expect(circle.cy).toBe(85);
    });

    it("Should store radius correctly", () => {
      const circle = new Circle(50, 60, 25, strokeColor, fillColor, element);

      expect(circle.radius).toBe(25);
    });

    it("Should store strokeColor correctly", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(circle.strokeColor).toBe(strokeColor);
    });

    it("Should store fillColor correctly", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(circle.fillColor).toBe(fillColor);
    });

    it("Should store element correctly", () => {
      const circle = new Circle(50, 60, 10, strokeColor, fillColor, element);

      expect(circle.element).toBe(element);
    });
  });

  describe("5.2 Rectangle Class", () => {
    const strokeColor = { type: "hex" as const, color: "#333333" };
    const fillColor = { type: "hex" as const, color: "#ff0000" };
    const element = createMockSVGElement();

    it("Should construct with all parameters", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(rect).toBeInstanceOf(Rectangle);
    });

    it("`x` should be a number", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(typeof rect.x).toBe("number");
    });

    it("`y` should be a number", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(typeof rect.y).toBe("number");
    });

    it("`width` should be a number", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(typeof rect.width).toBe("number");
    });

    it("`height` should be a number", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(typeof rect.height).toBe("number");
    });

    it("`strokeColor` should be a Color object", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(rect.strokeColor).toHaveProperty("type");
      expect(rect.strokeColor).toHaveProperty("color");
    });

    it("`fillColor` should be a Color object", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(rect.fillColor).toHaveProperty("type");
      expect(rect.fillColor).toHaveProperty("color");
    });

    it("`element` should be an SVGElement", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(rect.element).toBeInstanceOf(SVGElement);
    });

    it("Should extend Shape class", () => {
      const rect = new Rectangle(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(rect).toBeInstanceOf(Shape);
    });

    it("Should store x correctly", () => {
      const rect = new Rectangle(15, 20, 30, 40, strokeColor, fillColor, element);

      expect(rect.x).toBe(15);
    });

    it("Should store y correctly", () => {
      const rect = new Rectangle(10, 25, 30, 40, strokeColor, fillColor, element);

      expect(rect.y).toBe(25);
    });

    it("Should store width correctly", () => {
      const rect = new Rectangle(10, 20, 35, 40, strokeColor, fillColor, element);

      expect(rect.width).toBe(35);
    });

    it("Should store height correctly", () => {
      const rect = new Rectangle(10, 20, 30, 45, strokeColor, fillColor, element);

      expect(rect.height).toBe(45);
    });
  });

  describe("5.3 Ellipse Class", () => {
    const strokeColor = { type: "hex" as const, color: "#333333" };
    const fillColor = { type: "hex" as const, color: "#ff0000" };
    const element = createMockSVGElement();

    it("Should construct with all parameters", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(ellipse).toBeInstanceOf(Ellipse);
    });

    it("`x` should be a number", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(typeof ellipse.x).toBe("number");
    });

    it("`y` should be a number", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(typeof ellipse.y).toBe("number");
    });

    it("`rx` should be a number", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(typeof ellipse.rx).toBe("number");
    });

    it("`ry` should be a number", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(typeof ellipse.ry).toBe("number");
    });

    it("`strokeColor` should be a Color object", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(ellipse.strokeColor).toHaveProperty("type");
      expect(ellipse.strokeColor).toHaveProperty("color");
    });

    it("`fillColor` should be a Color object", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(ellipse.fillColor).toHaveProperty("type");
      expect(ellipse.fillColor).toHaveProperty("color");
    });

    it("`element` should be an SVGElement", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(ellipse.element).toBeInstanceOf(SVGElement);
    });

    it("Should extend Shape class", () => {
      const ellipse = new Ellipse(50, 60, 20, 10, strokeColor, fillColor, element);

      expect(ellipse).toBeInstanceOf(Shape);
    });

    it("Should store x correctly", () => {
      const ellipse = new Ellipse(55, 60, 20, 10, strokeColor, fillColor, element);

      expect(ellipse.x).toBe(55);
    });

    it("Should store y correctly", () => {
      const ellipse = new Ellipse(50, 65, 20, 10, strokeColor, fillColor, element);

      expect(ellipse.y).toBe(65);
    });

    it("Should store rx correctly", () => {
      const ellipse = new Ellipse(50, 60, 25, 10, strokeColor, fillColor, element);

      expect(ellipse.rx).toBe(25);
    });

    it("Should store ry correctly", () => {
      const ellipse = new Ellipse(50, 60, 20, 15, strokeColor, fillColor, element);

      expect(ellipse.ry).toBe(15);
    });
  });

  describe("5.4 Triangle Class", () => {
    const strokeColor = { type: "hex" as const, color: "#333333" };
    const fillColor = { type: "hex" as const, color: "#ff0000" };
    const element = createMockSVGElement();

    it("Should construct with all parameters", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(triangle).toBeInstanceOf(Triangle);
    });

    it("`x1` should be a number", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(typeof triangle.x1).toBe("number");
    });

    it("`y1` should be a number", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(typeof triangle.y1).toBe("number");
    });

    it("`x2` should be a number", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(typeof triangle.x2).toBe("number");
    });

    it("`y2` should be a number", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(typeof triangle.y2).toBe("number");
    });

    it("`x3` should be a number", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(typeof triangle.x3).toBe("number");
    });

    it("`y3` should be a number", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(typeof triangle.y3).toBe("number");
    });

    it("`strokeColor` should be a Color object", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(triangle.strokeColor).toHaveProperty("type");
      expect(triangle.strokeColor).toHaveProperty("color");
    });

    it("`fillColor` should be a Color object", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(triangle.fillColor).toHaveProperty("type");
      expect(triangle.fillColor).toHaveProperty("color");
    });

    it("`element` should be an SVGElement", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(triangle.element).toBeInstanceOf(SVGElement);
    });

    it("Should extend Shape class", () => {
      const triangle = new Triangle(10, 10, 20, 20, 15, 30, strokeColor, fillColor, element);

      expect(triangle).toBeInstanceOf(Shape);
    });
  });

  describe("5.5 Line Class", () => {
    const strokeColor = { type: "hex" as const, color: "#333333" };
    const fillColor = { type: "hex" as const, color: "#ff0000" };
    const element = createMockSVGElement();

    it("Should construct with all parameters", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(line).toBeInstanceOf(Line);
    });

    it("`x1` should be a number", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(typeof line.x1).toBe("number");
    });

    it("`y1` should be a number", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(typeof line.y1).toBe("number");
    });

    it("`x2` should be a number", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(typeof line.x2).toBe("number");
    });

    it("`y2` should be a number", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(typeof line.y2).toBe("number");
    });

    it("`strokeColor` should be a Color object", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(line.strokeColor).toHaveProperty("type");
      expect(line.strokeColor).toHaveProperty("color");
    });

    it("`fillColor` should be a Color object", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(line.fillColor).toHaveProperty("type");
      expect(line.fillColor).toHaveProperty("color");
    });

    it("`element` should be an SVGElement", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(line.element).toBeInstanceOf(SVGElement);
    });

    it("Should extend Shape class", () => {
      const line = new Line(10, 20, 30, 40, strokeColor, fillColor, element);

      expect(line).toBeInstanceOf(Shape);
    });
  });

  describe("5.6 Color Type", () => {
    it("Hex color should have type 'hex'", () => {
      const color = { type: "hex" as const, color: "#ff0000" };

      expect(color.type).toBe("hex");
    });

    it("Hex color should have string color property", () => {
      const color = { type: "hex" as const, color: "#ff0000" };

      expect(typeof color.color).toBe("string");
    });

    it("RGB color should have type 'rgb'", () => {
      const color = { type: "rgb" as const, color: [255, 0, 0] as [number, number, number] };

      expect(color.type).toBe("rgb");
    });

    it("RGB color should have [number, number, number] array", () => {
      const color = { type: "rgb" as const, color: [255, 0, 0] as [number, number, number] };

      expect(Array.isArray(color.color)).toBe(true);
      expect(color.color.length).toBe(3);
      expect(typeof color.color[0]).toBe("number");
      expect(typeof color.color[1]).toBe("number");
      expect(typeof color.color[2]).toBe("number");
    });

    it("RGBA color should have type 'rgba'", () => {
      const color = { type: "rgba" as const, color: [255, 0, 0, 1] as [number, number, number, number] };

      expect(color.type).toBe("rgba");
    });

    it("RGBA color should have [number, number, number, number] array", () => {
      const color = { type: "rgba" as const, color: [255, 0, 0, 1] as [number, number, number, number] };

      expect(Array.isArray(color.color)).toBe(true);
      expect(color.color.length).toBe(4);
      expect(typeof color.color[0]).toBe("number");
      expect(typeof color.color[1]).toBe("number");
      expect(typeof color.color[2]).toBe("number");
      expect(typeof color.color[3]).toBe("number");
    });

    it("HSL color should have type 'hsl'", () => {
      const color = { type: "hsl" as const, color: [0, 100, 50] as [number, number, number] };

      expect(color.type).toBe("hsl");
    });

    it("HSL color should have [number, number, number] array", () => {
      const color = { type: "hsl" as const, color: [0, 100, 50] as [number, number, number] };

      expect(Array.isArray(color.color)).toBe(true);
      expect(color.color.length).toBe(3);
      expect(typeof color.color[0]).toBe("number");
      expect(typeof color.color[1]).toBe("number");
      expect(typeof color.color[2]).toBe("number");
    });
  });
});
