import { describe, expect, it } from "vitest";
import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Python string attribute access", () => {
  it("should return function object for upper", () => {
    const code = `
text = "hello"
func = text.upper
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.func?.type).toBe("function");
  });

  it("should return function object for lower", () => {
    const code = `
text = "HELLO"
func = text.lower
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.func?.type).toBe("function");
  });

  it("should differentiate between property access and method call", () => {
    const code = `
text = "hello"
func = text.upper
result = text.upper()
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.func?.type).toBe("function");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("HELLO");
  });
});
