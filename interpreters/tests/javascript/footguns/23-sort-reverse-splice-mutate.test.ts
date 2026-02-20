import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Footgun #23: sort(), reverse(), splice() mutate the original array", () => {
  // In real JS: const sorted = arr.sort() mutates arr AND returns the same reference
  // A beginner expects sort() to return a new sorted array
  // Should we make these return new arrays, or provide educational warnings?

  test.skip("sort() mutates the original array (surprising behavior)", () => {
    const code = `
      let arr = [3, 1, 2]
      let sorted = arr.sort()
    `;
    const { frames } = interpret(code);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // In real JS: arr is now [1, 2, 3] (mutated!)
    // Should arr remain [3, 1, 2] in educational mode?
    const arrValues = lastFrame.variables.arr?.value?.map((v: any) => v.value);
    // TODO: Decide if we want to preserve the original or match JS behavior
  });

  test.skip("reverse() mutates the original array (surprising behavior)", () => {
    const code = `
      let arr = [1, 2, 3]
      let reversed = arr.reverse()
    `;
    const { frames } = interpret(code);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // In real JS: arr is now [3, 2, 1] (mutated!)
    const arrValues = lastFrame.variables.arr?.value?.map((v: any) => v.value);
    // TODO: Decide behavior
  });

  test.skip("splice() mutates the original array (surprising behavior)", () => {
    const code = `
      let arr = [1, 2, 3, 4, 5]
      let removed = arr.splice(1, 2)
    `;
    const { frames } = interpret(code);
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    // In real JS: arr is now [1, 4, 5] (mutated!), removed is [2, 3]
    // TODO: Decide behavior
  });
});
