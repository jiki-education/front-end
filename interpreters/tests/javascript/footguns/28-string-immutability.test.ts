import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Footgun #28: String method immutability (forgetting to reassign)", () => {
  // In real JS: str.toUpperCase() returns a NEW string, doesn't modify str
  // A beginner writes str.toUpperCase() and expects str to change
  // The method call succeeds but the result is discarded

  test.skip("calling string method without reassigning should warn", () => {
    const code = `
      let name = "alice"
      name.toUpperCase()
      name
    `;
    const { frames } = interpret(code);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // name is still "alice" - the toUpperCase() result was discarded
    // Should we warn when a string method return value is unused?
    expect(lastFrame.variables.name?.value).toBe("alice");
  });

  test.skip("calling replace without reassigning should warn", () => {
    const code = `
      let name = "alice"
      name.replace("a", "A")
      name
    `;
    const { frames } = interpret(code);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // name is still "alice"
    expect(lastFrame.variables.name?.value).toBe("alice");
  });

  test.skip("reassigning string method result works correctly", () => {
    const code = `
      let name = "alice"
      name = name.toUpperCase()
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(lastFrame.variables.name?.value).toBe("ALICE");
  });
});
