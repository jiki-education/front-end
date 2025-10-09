import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String properties", () => {
  describe("length property", () => {
    test("returns correct length for simple string", () => {
      const result = interpret(`
        let str = "hello";
        str.length;
      `);

      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(5);
    });

    test("returns 0 for empty string", () => {
      const result = interpret(`
        let str = "";
        str.length;
      `);

      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(0);
    });

    test("works with string containing spaces", () => {
      const result = interpret(`
        let str = "hello world";
        str.length;
      `);

      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(11);
    });

    test("works with string containing special characters", () => {
      const result = interpret(`
        let str = "hello\\nworld";
        str.length;
      `);

      expect(result.error).toBe(null);
      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value).toBe(11); // \n counts as 1 character
    });

    test("gives runtime error when using computed access for length", () => {
      const result = interpret(`
        let str = "hello";
        str["length"];
      `);

      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame)?.error?.message).toBe(
        "TypeError: message: Cannot use computed property access for stdlib members"
      );
    });

    test("gives runtime error for unknown property", () => {
      const result = interpret(`
        let str = "hello";
        str.unknownProperty;
      `);

      expect(result.success).toBe(false);
      expect(result.error).toBe(null);
      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("PropertyNotFound");
      expect((errorFrame as TestAugmentedFrame)?.error?.context?.property).toBe("unknownProperty");
    });
  });
});
