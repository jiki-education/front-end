import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Debug Nested", () => {
  it("debug first failure", () => {
    const code = `
      let x = [
        { something: [{ foo: [0, 1, 2, 3, 4, 5] }] }
      ];
      x[0].something[0]['foo'][5] = 'bar';
    `;
    const result = interpret(code);

    console.log("Success:", result.success);
    console.log("Error:", result.error);

    if (!result.success && result.error) {
      console.log("Error type:", result.error.type);
      console.log("Error message:", result.error.message);
      console.log("Error location:", result.error.location);
    }

    if (result.frames.length > 0) {
      for (let i = 0; i < result.frames.length; i++) {
        const frame = result.frames[i] as TestAugmentedFrame;
        console.log(`Frame ${i} status:`, frame.status);
        if (frame.error) {
          console.log(`Frame ${i} error:`, frame.error);
        }
      }
    }

    expect(result.success).toBe(true);
  });
});
