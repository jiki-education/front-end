import { describe, expect, it } from "vitest";
import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("lower() method", () => {
  it("should convert uppercase to lowercase", () => {
    const code = `
text = "HELLO WORLD"
result = text.lower()
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello world");
  });

  it("should leave lowercase unchanged", () => {
    const code = `
text = "already lower"
result = text.lower()
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("already lower");
  });

  it("should handle mixed case", () => {
    const code = `
text = "MiXeD CaSe"
result = text.lower()
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("mixed case");
  });

  it("should handle empty string", () => {
    const code = `
text = ""
result = text.lower()
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("");
  });

  it("should handle strings with numbers and symbols", () => {
    const code = `
text = "HELLO123!@#"
result = text.lower()
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello123!@#");
  });

  it("should error when called with arguments", () => {
    const code = `
text = "HELLO"
result = text.lower("arg")
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(false);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("ERROR");
  });
});
