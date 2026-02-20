import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Footgun #18: String index assignment (silent no-op)", () => {
  // In real JS: str[0] = "H" silently does nothing (strings are immutable)
  // A beginner expects it to modify the string like an array
  // This should produce an error rather than silently failing

  test.skip("assigning to a string index should produce an error", () => {
    const code = `
      let str = "hello"
      str[0] = "H"
    `;
    const { frames } = interpret(code);
    // Should produce an error, not silently do nothing
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
  });

  test.skip("string should remain immutable even without error", () => {
    const code = `
      let str = "hello"
      str[0] = "H"
      str
    `;
    const { frames } = interpret(code);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // Whether or not we error, the string should not change
    expect(lastFrame.variables.str?.value).toBe("hello");
  });
});
