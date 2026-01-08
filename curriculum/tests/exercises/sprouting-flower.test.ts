import { describe, it, expect, beforeEach } from "vitest";
import { SproutingFlowerExercise } from "../../src/exercises/sprouting-flower/Exercise";
import { DrawExercise } from "../../src/exercises/DrawExercise";
import { VisualExercise } from "../../src/VisualExercise";

describe("SproutingFlowerExercise", () => {
  let exercise: SproutingFlowerExercise;

  beforeEach(() => {
    exercise = new SproutingFlowerExercise();
  });

  describe("6.1 Class Structure", () => {
    it("Should extend DrawExercise", () => {
      expect(exercise).toBeInstanceOf(DrawExercise);
    });

    it("Should be an instance of DrawExercise", () => {
      expect(exercise instanceof DrawExercise).toBe(true);
    });

    it("Should be an instance of VisualExercise", () => {
      expect(exercise instanceof VisualExercise).toBe(true);
    });

    it("`slug` should be 'sprouting-flower'", () => {
      // Access protected slug via casting
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const slug = (exercise as any).slug;
      expect(slug).toBe("sprouting-flower");
    });

    it("`slug` should be a string", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const slug = (exercise as any).slug;
      expect(typeof slug).toBe("string");
    });
  });

  describe("6.2 availableFunctions", () => {
    it("Should return an array", () => {
      const funcs = exercise.availableFunctions;

      expect(Array.isArray(funcs)).toBe(true);
    });

    it("Array length should be 4", () => {
      const funcs = exercise.availableFunctions;

      expect(funcs.length).toBe(4);
    });

    it("Should include `rectangle` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).toContain("rectangle");
    });

    it("Should include `circle` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).toContain("circle");
    });

    it("Should include `ellipse` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).toContain("ellipse");
    });

    it("Should include `fill_color_hex` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).toContain("fill_color_hex");
    });

    it("Should NOT include `triangle` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).not.toContain("triangle");
    });

    it("Should NOT include `line` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).not.toContain("line");
    });

    it("Should NOT include `fill_color_rgb` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).not.toContain("fill_color_rgb");
    });

    it("Should NOT include `fill_color_rgba` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).not.toContain("fill_color_rgba");
    });

    it("Should NOT include `fill_color_hsl` function", () => {
      const funcs = exercise.availableFunctions;
      const names = funcs.map((f) => f.name);

      expect(names).not.toContain("fill_color_hsl");
    });

    it("Each function should have `name` property", () => {
      const funcs = exercise.availableFunctions;

      funcs.forEach((fn) => {
        expect(fn).toHaveProperty("name");
      });
    });

    it("Each function should have `func` property", () => {
      const funcs = exercise.availableFunctions;

      funcs.forEach((fn) => {
        expect(fn).toHaveProperty("func");
      });
    });

    it("Each function should have `description` property", () => {
      const funcs = exercise.availableFunctions;

      funcs.forEach((fn) => {
        expect(fn).toHaveProperty("description");
      });
    });

    it("`rectangle` name should be 'rectangle'", () => {
      const funcs = exercise.availableFunctions;
      const rectangleFunc = funcs.find((f) => f.name === "rectangle");

      expect(rectangleFunc?.name).toBe("rectangle");
    });

    it("`circle` name should be 'circle'", () => {
      const funcs = exercise.availableFunctions;
      const circleFunc = funcs.find((f) => f.name === "circle");

      expect(circleFunc?.name).toBe("circle");
    });

    it("`ellipse` name should be 'ellipse'", () => {
      const funcs = exercise.availableFunctions;
      const ellipseFunc = funcs.find((f) => f.name === "ellipse");

      expect(ellipseFunc?.name).toBe("ellipse");
    });

    it("`fill_color_hex` name should be 'fill_color_hex'", () => {
      const funcs = exercise.availableFunctions;
      const fillColorHexFunc = funcs.find((f) => f.name === "fill_color_hex");

      expect(fillColorHexFunc?.name).toBe("fill_color_hex");
    });
  });
});
