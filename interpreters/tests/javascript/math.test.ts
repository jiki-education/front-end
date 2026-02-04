import { describe, it, expect } from "vitest";
import { interpret } from "@javascript/interpreter";

describe("Math.randomInt()", () => {
  it("returns an integer within the specified range (inclusive)", () => {
    // Run multiple times to verify range behavior
    for (let i = 0; i < 100; i++) {
      const result = interpret(`let x = Math.randomInt(1, 10);`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as any).variables.x.value;
      expect(Number.isInteger(x)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(10);
    }
  });

  it("works with negative ranges", () => {
    for (let i = 0; i < 100; i++) {
      const result = interpret(`let x = Math.randomInt(-10, -1);`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as any).variables.x.value;
      expect(Number.isInteger(x)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(-10);
      expect(x).toBeLessThanOrEqual(-1);
    }
  });

  it("works with ranges spanning negative to positive", () => {
    for (let i = 0; i < 100; i++) {
      const result = interpret(`let x = Math.randomInt(-5, 5);`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as any).variables.x.value;
      expect(Number.isInteger(x)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(-5);
      expect(x).toBeLessThanOrEqual(5);
    }
  });

  it("returns the only possible value when min equals max", () => {
    const result = interpret(`let x = Math.randomInt(5, 5);`);
    expect(result.success).toBe(true);
    const x = (result.frames[0] as any).variables.x.value;
    expect(x).toBe(5);
  });

  it("can be used in expressions", () => {
    const result = interpret(`
      let x = Math.randomInt(1, 1) + 10;
    `);
    expect(result.success).toBe(true);
    const x = (result.frames[0] as any).variables.x.value;
    expect(x).toBe(11);
  });

  it("can be logged with console.log", () => {
    const result = interpret(`
      let x = Math.randomInt(42, 42);
      console.log(x);
    `);
    expect(result.success).toBe(true);
    expect(result.logLines).toHaveLength(1);
    expect(result.logLines[0].output).toBe("42");
  });

  it("generates frames with descriptions", () => {
    const result = interpret(`let x = Math.randomInt(1, 10);`);
    expect(result.success).toBe(true);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("SUCCESS");
  });
});

describe("Math object", () => {
  it("throws error for non-existent methods", () => {
    const result = interpret(`Math.notAMethod();`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("PropertyNotFound");
  });

  it("Math.randomInt can be accessed as a property", () => {
    const result = interpret(`
      let randFunc = Math.randomInt;
      let x = randFunc(7, 7);
    `);
    expect(result.success).toBe(true);
    const x = (result.frames[1] as any).variables.x.value;
    expect(x).toBe(7);
  });
});
