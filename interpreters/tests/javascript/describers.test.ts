import { describe, expect, test } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";
import { interpret } from "@javascript/interpreter";
import { describeFrame } from "@javascript/frameDescribers";

describe("describers", () => {
  describe("frames and descriptions", () => {
    test("simple arithmetic expression", () => {
      const code = "3 + 4;";
      const result = interpret(code);

      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);

      const frame = result.frames[0];
      const description = describeFrame(frame);

      expect(description).toContain("JavaScript");
      expect(description).toContain("Steps JavaScript Took");
      expect(description).toContain("7");
    });

    test("string concatenation", () => {
      const code = '"hello" + " world";';
      const result = interpret(code);

      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);

      const frame = result.frames[0];
      const description = describeFrame(frame);

      expect(description).toContain("JavaScript");
      expect(description).toContain("hello world");
    });

    test("boolean expression", () => {
      const code = "true && false;";
      const result = interpret(code);

      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);

      const frame = result.frames[0];
      const description = describeFrame(frame);

      expect(description).toContain("JavaScript");
      expect(description).toContain("false");
    });

    test("grouping expression", () => {
      const code = "(5 + 3) * 2;";
      const result = interpret(code);

      expect(result.frames.length).toBeGreaterThan(0);
      expect(result.success).toBe(true);

      const frame = result.frames[0];
      const description = describeFrame(frame);

      expect(description).toContain("JavaScript");
      expect(description).toContain("16");
    });
  });
});
