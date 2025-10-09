import { describe, expect, it } from "vitest";
import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("method chaining", () => {
  it("should chain upper and lower", () => {
    const code = `
text = "Hello"
result = text.upper().lower()
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello");
  });

  it("should chain lower and upper", () => {
    const code = `
text = "Hello"
result = text.lower().upper()
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("HELLO");
  });
});
