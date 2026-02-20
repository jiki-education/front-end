import { interpret } from "@javascript/interpreter";

describe("Footgun #19: for...in on arrays gives string keys, not values", () => {
  // In real JS: for (let x in [10,20,30]) iterates "0","1","2" (string keys!)
  // A beginner expects it to iterate the values 10, 20, 30
  // for...in should be blocked on arrays (use for...of instead)

  test.skip("for...in on array should be blocked or warn", () => {
    const code = `
      let arr = [10, 20, 30]
      for (let x in arr) {
        let y = x
      }
    `;
    const { frames } = interpret(code);
    // Should produce an error directing users to use for...of instead
    const errorFrame = frames.find(f => f.status === "ERROR");
    expect(errorFrame).toBeDefined();
  });

  test.skip("for...of on array works correctly (the right way)", () => {
    const code = `
      let sum = 0
      for (let x of [10, 20, 30]) {
        sum = sum + x
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    // for...of gives the actual values
  });
});
