import { describe, expect, it } from "vitest";
import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("immutability", () => {
  it("upper() should not modify original string", () => {
    const code = `
text = "hello"
result = text.upper()
original = text
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.original?.value ?? lastFrame.variables?.original).toBe("hello");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("HELLO");
  });

  it("lower() should not modify original string", () => {
    const code = `
text = "HELLO"
result = text.lower()
original = text
      `.trim();
    const result = interpret(code);
    expect(result.success).toBe(true);

    const lastFrame = result.frames[result.frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.status).toBe("SUCCESS");
    expect(lastFrame.variables?.original?.value ?? lastFrame.variables?.original).toBe("HELLO");
    expect(lastFrame.variables?.result?.value ?? lastFrame.variables?.result).toBe("hello");
  });
});
