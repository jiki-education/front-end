import { describe, expect, test } from "vitest";
import { interpret } from "../../src/javascript/interpreter";

// Type for frames augmented in test environment
interface TestAugmentedFrame {
  status: "SUCCESS" | "ERROR";
  result?: any;
  variables?: Record<string, any>;
  description?: string;
  error?: {
    type: string;
    message?: string;
    context?: any;
  };
}

describe("JavaScript string methods", () => {
  describe("toUpperCase() method", () => {
    test("converts lowercase to uppercase", () => {
      const result = interpret(`
        let text = "hello world";
        text.toUpperCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("HELLO WORLD");
    });

    test("leaves uppercase unchanged", () => {
      const result = interpret(`
        let text = "ALREADY UPPER";
        text.toUpperCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("ALREADY UPPER");
    });

    test("handles mixed case", () => {
      const result = interpret(`
        let text = "MiXeD CaSe";
        text.toUpperCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("MIXED CASE");
    });

    test("handles empty string", () => {
      const result = interpret(`
        let text = "";
        text.toUpperCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("");
    });

    test("errors with arguments", () => {
      const result = interpret(`
        let text = "hello";
        text.toUpperCase("arg");
      `);

      expect(result.success).toBe(false);
      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame)?.error?.type).toBeTruthy();
    });
  });

  describe("toLowerCase() method", () => {
    test("converts uppercase to lowercase", () => {
      const result = interpret(`
        let text = "HELLO WORLD";
        text.toLowerCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("hello world");
    });

    test("leaves lowercase unchanged", () => {
      const result = interpret(`
        let text = "already lower";
        text.toLowerCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("already lower");
    });

    test("handles mixed case", () => {
      const result = interpret(`
        let text = "MiXeD CaSe";
        text.toLowerCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("mixed case");
    });

    test("handles empty string", () => {
      const result = interpret(`
        let text = "";
        text.toLowerCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("");
    });

    test("errors with arguments", () => {
      const result = interpret(`
        let text = "HELLO";
        text.toLowerCase("arg");
      `);

      expect(result.success).toBe(false);
      const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
      expect(errorFrame).toBeDefined();
      expect((errorFrame as TestAugmentedFrame)?.error?.type).toBeTruthy();
    });
  });

  describe("method chaining", () => {
    test("can chain toUpperCase and toLowerCase", () => {
      const result = interpret(`
        let text = "Hello";
        text.toUpperCase().toLowerCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("hello");
    });

    test("can chain toLowerCase and toUpperCase", () => {
      const result = interpret(`
        let text = "Hello";
        text.toLowerCase().toUpperCase();
      `);

      expect(result.success).toBe(true);
      const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.status).toBe("SUCCESS");
      expect(lastFrame.result?.jikiObject?.value ?? lastFrame.result?.value).toBe("HELLO");
    });
  });
});
