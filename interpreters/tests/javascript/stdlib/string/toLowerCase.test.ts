import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("String toLowerCase() method", () => {
  test("converts uppercase to lowercase", () => {
    const result = interpret(`
      let str = "HELLO WORLD";
      str.toLowerCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("hello world");
  });

  test("leaves lowercase unchanged", () => {
    const result = interpret(`
      let str = "already lower";
      str.toLowerCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("already lower");
  });

  test("handles mixed case", () => {
    const result = interpret(`
      let str = "MiXeD CaSe";
      str.toLowerCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("mixed case");
  });

  test("handles empty string", () => {
    const result = interpret(`
      let str = "";
      str.toLowerCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("");
  });

  test("handles strings with numbers and symbols", () => {
    const result = interpret(`
      let str = "HELLO123!@#";
      str.toLowerCase();
    `);

    expect(result.error).toBe(null);
    expect(result.success).toBe(true);
    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.result?.jikiObject?.value).toBe("hello123!@#");
  });

  test("requires no arguments", () => {
    const result = interpret(`
      let str = "HELLO";
      str.toLowerCase("arg");
    `);

    expect(result.success).toBe(false);
    expect(result.error).toBe(null);
    const errorFrame = result.frames.find(f => (f as TestAugmentedFrame).status === "ERROR");
    expect(errorFrame).toBeDefined();
    expect((errorFrame as TestAugmentedFrame)?.error?.type).toBe("InvalidNumberOfArguments");
  });
});
