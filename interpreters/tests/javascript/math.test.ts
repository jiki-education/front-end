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

describe("Math.randomInt() error handling", () => {
  it("throws TypeError for non-number first argument", () => {
    const result = interpret(`Math.randomInt("a", 10);`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("TypeError");
  });

  it("throws TypeError for non-number second argument", () => {
    const result = interpret(`Math.randomInt(1, true);`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("TypeError");
  });

  it("throws ValueError when min > max", () => {
    const result = interpret(`Math.randomInt(10, 1);`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect(result.frames[0].error?.type).toBe("ValueError");
  });

  it("truncates float arguments to integers", () => {
    // 1.9 truncates to 1, 3.1 truncates to 3, so range is [1, 3]
    for (let i = 0; i < 50; i++) {
      const result = interpret(`let x = Math.randomInt(1.9, 3.1);`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as any).variables.x.value;
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(3);
      expect(Number.isInteger(x)).toBe(true);
    }
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

describe("Math.randomInt() with randomSeed", () => {
  it("produces deterministic results with the same seed", () => {
    const result1 = interpret(`let x = Math.randomInt(0, 100);`, { randomSeed: 42 });
    const result2 = interpret(`let x = Math.randomInt(0, 100);`, { randomSeed: 42 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as any).variables.x.value;
    const x2 = (result2.frames[0] as any).variables.x.value;
    expect(x1).toBe(x2);
  });

  it("produces deterministic sequences across multiple calls", () => {
    const code = `
      let a = Math.randomInt(0, 100);
      let b = Math.randomInt(0, 100);
      let c = Math.randomInt(0, 100);
    `;
    const result1 = interpret(code, { randomSeed: 123 });
    const result2 = interpret(code, { randomSeed: 123 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const vars1 = (result1.frames[2] as any).variables;
    const vars2 = (result2.frames[2] as any).variables;
    expect(vars1.a.value).toBe(vars2.a.value);
    expect(vars1.b.value).toBe(vars2.b.value);
    expect(vars1.c.value).toBe(vars2.c.value);
  });

  it("different seeds produce different results", () => {
    const result1 = interpret(`let x = Math.randomInt(0, 1000);`, { randomSeed: 1 });
    const result2 = interpret(`let x = Math.randomInt(0, 1000);`, { randomSeed: 2 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as any).variables.x.value;
    const x2 = (result2.frames[0] as any).variables.x.value;
    expect(x1).not.toBe(x2);
  });

  it("shifted bounds produce equivalent results with same seed", () => {
    const result1 = interpret(`let x = Math.randomInt(0, 4);`, { randomSeed: 42 });
    const result2 = interpret(`let x = Math.randomInt(1, 5) - 1;`, { randomSeed: 42 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as any).variables.x.value;
    const x2 = (result2.frames[0] as any).variables.x.value;
    expect(x1).toBe(x2);
  });
});
