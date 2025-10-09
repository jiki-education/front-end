import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String toUpperCase() method", () => {
  test("converts lowercase to uppercase", () => {
    const result = interpret(`
      let str = "hello world";
      str.toUpperCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("HELLO WORLD");
  });

  test("leaves uppercase unchanged", () => {
    const result = interpret(`
      let str = "ALREADY UPPER";
      str.toUpperCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("ALREADY UPPER");
  });

  test("handles mixed case", () => {
    const result = interpret(`
      let str = "MiXeD CaSe";
      str.toUpperCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("MIXED CASE");
  });

  test("handles empty string", () => {
    const result = interpret(`
      let str = "";
      str.toUpperCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("");
  });

  test("handles strings with numbers and symbols", () => {
    const result = interpret(`
      let str = "hello123!@#";
      str.toUpperCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("HELLO123!@#");
  });

  test("requires no arguments", () => {
    const result = interpret(`
      let str = "hello";
      str.toUpperCase("arg");
    `);

    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
