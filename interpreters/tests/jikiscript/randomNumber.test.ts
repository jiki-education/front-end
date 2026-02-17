import { describe, it, expect } from "vitest";
import { interpret } from "@jikiscript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("random_number()", () => {
  const context = {
    languageFeatures: { allowedStdlibFunctions: ["random_number"] },
  };

  it("returns an integer within the specified range (inclusive)", () => {
    for (let i = 0; i < 50; i++) {
      const result = interpret(`set x to random_number(1, 10)`, context);
      expect(result.success).toBe(true);
      const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
      expect(Number.isInteger(x)).toBe(true);
      expect(x).toBeGreaterThanOrEqual(1);
      expect(x).toBeLessThanOrEqual(10);
    }
  });

  it("returns the only possible value when min equals max", () => {
    const result = interpret(`set x to random_number(5, 5)`, context);
    expect(result.success).toBe(true);
    const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x).toBe(5);
  });

  it("can be used in expressions", () => {
    const result = interpret(`set x to random_number(1, 1) + 10`, context);
    expect(result.success).toBe(true);
    const x = (result.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x).toBe(11);
  });

  it("throws error when min > max", () => {
    const result = interpret(`set x to random_number(10, 1)`, context);
    expect(result.frames).toHaveLength(1);
    expect(result.frames[0].status).toBe("ERROR");
    expect((result.frames[0] as TestAugmentedFrame).error?.type).toBe("LogicErrorInExecution");
  });
});

describe("random_number() with randomSeed", () => {
  const context = {
    languageFeatures: { allowedStdlibFunctions: ["random_number"] },
  };

  it("produces deterministic results with the same seed", () => {
    const result1 = interpret(`set x to random_number(0, 100)`, { ...context, randomSeed: 42 });
    const result2 = interpret(`set x to random_number(0, 100)`, { ...context, randomSeed: 42 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as TestAugmentedFrame).variables?.x?.value;
    const x2 = (result2.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x1).toBe(x2);
  });

  it("produces deterministic sequences across multiple calls", () => {
    const code = `set a to random_number(0, 100)
set b to random_number(0, 100)
set c to random_number(0, 100)`;
    const result1 = interpret(code, { ...context, randomSeed: 123 });
    const result2 = interpret(code, { ...context, randomSeed: 123 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const vars1 = (result1.frames[2] as TestAugmentedFrame).variables;
    const vars2 = (result2.frames[2] as TestAugmentedFrame).variables;
    expect(vars1?.a?.value).toBe(vars2?.a?.value);
    expect(vars1?.b?.value).toBe(vars2?.b?.value);
    expect(vars1?.c?.value).toBe(vars2?.c?.value);
  });

  it("different seeds produce different results", () => {
    const result1 = interpret(`set x to random_number(0, 1000)`, { ...context, randomSeed: 1 });
    const result2 = interpret(`set x to random_number(0, 1000)`, { ...context, randomSeed: 2 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as TestAugmentedFrame).variables?.x?.value;
    const x2 = (result2.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x1).not.toBe(x2);
  });

  it("shifted bounds produce equivalent results with same seed", () => {
    const result1 = interpret(`set x to random_number(0, 4)`, { ...context, randomSeed: 42 });
    const result2 = interpret(`set x to random_number(1, 5) - 1`, { ...context, randomSeed: 42 });
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
    const x1 = (result1.frames[0] as TestAugmentedFrame).variables?.x?.value;
    const x2 = (result2.frames[0] as TestAugmentedFrame).variables?.x?.value;
    expect(x1).toBe(x2);
  });
});
