import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { EvaluationContext } from "@javascript/interpreter";
import type { ExecutionContext } from "@javascript/executor";
import { JSNumber, JSString, type JikiObject } from "@javascript/jsObjects";
import { JSClass } from "@javascript/jsObjects/JSClass";
import { JSInstance } from "@javascript/jsObjects/JSInstance";

function createPointClass(): JSClass {
  const Point = new JSClass("Point");
  Point.addConstructor(function (_: ExecutionContext, instance: JSInstance, x: JikiObject, y: JikiObject) {
    instance.setField("x", x);
    instance.setField("y", y);
  });
  Point.addGetter("x", "public");
  Point.addGetter("y", "public");
  Point.addSetter("x", "public");
  Point.addSetter("y", "public");
  Point.addMethod(
    "distanceTo",
    "calculates distance",
    "public",
    function (_: ExecutionContext, instance: JSInstance, other: JikiObject) {
      const otherInstance = other as JSInstance;
      const dx = (instance.getField("x") as JSNumber).value - (otherInstance.getField("x") as JSNumber).value;
      const dy = (instance.getField("y") as JSNumber).value - (otherInstance.getField("y") as JSNumber).value;
      return new JSNumber(Math.sqrt(dx * dx + dy * dy));
    }
  );
  return Point;
}

function createCounterClass(): JSClass {
  const Counter = new JSClass("Counter");
  Counter.addConstructor(function (_: ExecutionContext, instance: JSInstance) {
    instance.setField("count", new JSNumber(0));
  });
  Counter.addGetter("count", "public");
  Counter.addMethod(
    "increment",
    "increments the counter",
    "public",
    function (_: ExecutionContext, instance: JSInstance) {
      const current = (instance.getField("count") as JSNumber).value;
      instance.setField("count", new JSNumber(current + 1));
    }
  );
  Counter.addMethod("getCount", "returns the count", "public", function (_: ExecutionContext, instance: JSInstance) {
    return instance.getField("count");
  });
  return Counter;
}

describe("JavaScript External Classes", () => {
  describe("instantiation", () => {
    it("should instantiate an external class with no args", () => {
      const Counter = createCounterClass();
      const result = interpret(`let c = new Counter();`, { classes: [Counter] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });

    it("should instantiate an external class with arguments", () => {
      const Point = createPointClass();
      const result = interpret(`let p = new Point(3, 4);`, { classes: [Point] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });

    it("should error for unknown class", () => {
      const result = interpret(`let p = new Unknown(1);`);
      expect(result.error).toBeNull(); // Parse succeeds
      expect(result.success).toBe(false);
      expect(result.frames[0].status).toBe("ERROR");
    });

    it("should check constructor arity", () => {
      const Point = createPointClass();
      const result = interpret(`let p = new Point(1);`, { classes: [Point] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
      expect(result.frames[0].status).toBe("ERROR");
    });
  });

  describe("property access via getters", () => {
    it("should read properties via getters", () => {
      const Point = createPointClass();
      const result = interpret(
        `let p = new Point(3, 4);
let x = p.x;
let y = p.y;`,
        { classes: [Point] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
      expect(result.frames).toHaveLength(3);
    });

    it("should error for unknown property", () => {
      const Point = createPointClass();
      const result = interpret(
        `let p = new Point(3, 4);
let z = p.z;`,
        { classes: [Point] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
    });
  });

  describe("property assignment via setters", () => {
    it("should write properties via setters", () => {
      const Point = createPointClass();
      const result = interpret(
        `let p = new Point(3, 4);
p.x = 10;`,
        { classes: [Point] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });

    it("should error for unknown setter", () => {
      const Point = createPointClass();
      const result = interpret(
        `let p = new Point(3, 4);
p.z = 10;`,
        { classes: [Point] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
    });
  });

  describe("method calls", () => {
    it("should call methods with no return value", () => {
      const Counter = createCounterClass();
      const result = interpret(
        `let c = new Counter();
c.increment();`,
        { classes: [Counter] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });

    it("should call methods with return values", () => {
      const Counter = createCounterClass();
      const result = interpret(
        `let c = new Counter();
c.increment();
c.increment();
let val = c.getCount();`,
        { classes: [Counter] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });

    it("should pass instances as arguments to methods", () => {
      const Point = createPointClass();
      const result = interpret(
        `let p1 = new Point(0, 0);
let p2 = new Point(3, 4);
let d = p1.distanceTo(p2);`,
        { classes: [Point] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });

    it("should error for unknown method", () => {
      const Counter = createCounterClass();
      const result = interpret(
        `let c = new Counter();
c.nonexistent();`,
        { classes: [Counter] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
    });
  });

  describe("multiple classes", () => {
    it("should support multiple classes in context", () => {
      const Point = createPointClass();
      const Counter = createCounterClass();
      const result = interpret(
        `let p = new Point(1, 2);
let c = new Counter();
c.increment();`,
        { classes: [Point, Counter] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });
  });

  describe("custom getters and setters", () => {
    it("should support custom getter functions", () => {
      const Rect = new JSClass("Rect");
      Rect.addConstructor(function (_: ExecutionContext, instance: JSInstance, w: JikiObject, h: JikiObject) {
        instance.setField("w", w);
        instance.setField("h", h);
      });
      Rect.addGetter("area", "public", function (_: ExecutionContext, instance: JSInstance) {
        const w = (instance.getField("w") as JSNumber).value;
        const h = (instance.getField("h") as JSNumber).value;
        return new JSNumber(w * h);
      });

      const result = interpret(
        `let r = new Rect(3, 4);
let a = r.area;`,
        { classes: [Rect] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });

    it("should support custom setter functions with validation", () => {
      const Clamp = new JSClass("Clamp");
      Clamp.addConstructor(function (_: ExecutionContext, instance: JSInstance) {
        instance.setField("val", new JSNumber(0));
      });
      Clamp.addGetter("val", "public");
      Clamp.addSetter("val", "public", function (_: ExecutionContext, instance: JSInstance, value: JikiObject) {
        const num = (value as JSNumber).value;
        const clamped = Math.min(100, Math.max(0, num));
        const result = new JSNumber(clamped);
        instance.setField("val", result);
        return result;
      });

      const result = interpret(
        `let c = new Clamp();
c.val = 200;`,
        { classes: [Clamp] }
      );
      expect(result.error).toBeNull();
      expect(result.success).toBe(true);
    });
  });

  describe("addProperty validation", () => {
    it("should validate that declared properties are set in constructor", () => {
      const Broken = new JSClass("Broken");
      Broken.addProperty("name");
      Broken.addConstructor(function (_: ExecutionContext, _instance: JSInstance) {
        // Intentionally not setting "name"
      });

      const result = interpret(`let b = new Broken();`, { classes: [Broken] });
      expect(result.error).toBeNull();
      expect(result.success).toBe(false);
    });
  });
});
