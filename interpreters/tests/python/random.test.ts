import { describe, it, expect } from "vitest";
import { interpret } from "../../src/python/interpreter";
import type { TestAugmentedFrame } from "../../src/shared/frames";

describe("random.randint()", () => {
  it("returns integer within range [min, max] (inclusive)", () => {
    for (let i = 0; i < 50; i++) {
      const result = interpret(`x = random.randint(1, 10)`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(10);
      expect(Number.isInteger(x)).toBe(true);
    }
  });

  it("works with positive ranges", () => {
    for (let i = 0; i < 20; i++) {
      const result = interpret(`x = random.randint(5, 15)`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
      expect(x).toBeGreaterThanOrEqual(5);
      expect(x).toBeLessThanOrEqual(15);
    }
  });

  it("works with negative ranges", () => {
    for (let i = 0; i < 20; i++) {
      const result = interpret(`x = random.randint(-10, -1)`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
      expect(x).toBeGreaterThanOrEqual(-10);
      expect(x).toBeLessThanOrEqual(-1);
    }
  });

  it("works with mixed ranges (negative to positive)", () => {
    for (let i = 0; i < 20; i++) {
      const result = interpret(`x = random.randint(-5, 5)`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
      expect(x).toBeGreaterThanOrEqual(-5);
      expect(x).toBeLessThanOrEqual(5);
    }
  });

  it("works when min equals max (single possible value)", () => {
    const result = interpret(`x = random.randint(7, 7)`);
    expect(result.success).toBe(true);
    const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x).toBe(7);
  });

  it("can be used in expressions", () => {
    const result = interpret(`x = random.randint(1, 1) + 5`);
    expect(result.success).toBe(true);
    const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x).toBe(6);
  });

  it("can be used with print()", () => {
    const result = interpret(`print(random.randint(5, 5))`);
    expect(result.success).toBe(true);
    expect(result.logLines[0].output).toBe("5");
  });

  it("truncates float arguments to integers", () => {
    // 1.9 truncates to 1, 3.1 truncates to 3, so range is [1, 3]
    for (let i = 0; i < 50; i++) {
      const result = interpret(`x = random.randint(1.9, 3.1)`);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(3);
      expect(Number.isInteger(x)).toBe(true);
    }
  });
});

describe("random.randint() error handling", () => {
  it("throws TypeError for non-number first argument", () => {
    const result = interpret(`random.randint("a", 10)`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect((result.frames[0] as TestAugmentedFrame).error?.type).toBe("TypeError");
  });

  it("throws TypeError for non-number second argument", () => {
    const result = interpret(`random.randint(1, True)`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect((result.frames[0] as TestAugmentedFrame).error?.type).toBe("TypeError");
  });

  it("throws ValueError when min > max", () => {
    const result = interpret(`random.randint(10, 1)`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect((result.frames[0] as TestAugmentedFrame).error?.type).toBe("ValueError");
  });
});

describe("random module", () => {
  it("throws error for non-existent methods", () => {
    const result = interpret(`random.notAMethod()`);
    expect(result.success).toBe(false);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect((result.frames[0] as TestAugmentedFrame).error?.type).toBe("AttributeError");
  });
});

describe("random.randint() with randomSeed", () => {
  it("produces deterministic results with the same seed", () => {
    const result1 = interpret(`x = random.randint(0, 100)`, { randomSeed: 42 });
    const result2 = interpret(`x = random.randint(0, 100)`, { randomSeed: 42 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as TestAugmentedFrame).variables?.x?.value;
    const x2 = (result2.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x1).toBe(x2);
  });

  it("produces deterministic sequences across multiple calls", () => {
    const code = `
a = random.randint(0, 100)
b = random.randint(0, 100)
c = random.randint(0, 100)`;
    const result1 = interpret(code, { randomSeed: 123 });
    const result2 = interpret(code, { randomSeed: 123 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const vars1 = (result1.frames[2] as TestAugmentedFrame).variables;
    const vars2 = (result2.frames[2] as TestAugmentedFrame).variables;
    expect(vars1?.a?.value).toBe(vars2?.a?.value);
    expect(vars1?.b?.value).toBe(vars2?.b?.value);
    expect(vars1?.c?.value).toBe(vars2?.c?.value);
  });

  it("different seeds produce different results", () => {
    const result1 = interpret(`x = random.randint(0, 1000)`, { randomSeed: 1 });
    const result2 = interpret(`x = random.randint(0, 1000)`, { randomSeed: 2 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as TestAugmentedFrame).variables?.x?.value;
    const x2 = (result2.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x1).not.toBe(x2);
  });

  it("shifted bounds produce equivalent results with same seed", () => {
    const result1 = interpret(`x = random.randint(0, 4)`, { randomSeed: 42 });
    const result2 = interpret(`x = random.randint(1, 5) - 1`, { randomSeed: 42 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as TestAugmentedFrame).variables?.x?.value;
    const x2 = (result2.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x1).toBe(x2);
  });
});
