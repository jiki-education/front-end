import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Footgun #20: Prefix vs postfix increment/decrement in expressions", () => {
  // In real JS: let b = a++ gives b the OLD value of a
  // A beginner expects b to get the new (incremented) value
  // Using ++ in expressions (not standalone) is confusing and error-prone

  test.skip("postfix ++ in assignment gives old value (confusing)", () => {
    const code = `
      let a = 5
      let b = a++
    `;
    const { frames } = interpret(code);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // In real JS: b === 5 (old value), a === 6
    // This is confusing - should we block ++ in expressions?
    // Or ensure it gives the new value?
    expect(lastFrame.variables.b?.value).toBe(5);
    expect(lastFrame.variables.a?.value).toBe(6);
  });

  test.skip("prefix ++ in assignment gives new value", () => {
    const code = `
      let a = 5
      let b = ++a
    `;
    const { frames } = interpret(code);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // In real JS: b === 6 (new value), a === 6
    expect(lastFrame.variables.b?.value).toBe(6);
    expect(lastFrame.variables.a?.value).toBe(6);
  });

  test.skip("mixing prefix and postfix in expressions should be blocked", () => {
    // x++ + ++x is extremely confusing
    const code = `
      let x = 1
      let result = x++ + ++x
    `;
    const { frames } = interpret(code);
    // Should produce an error or at least a clear educational message
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
  });
});
