import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Footgun #17: sort() without comparator uses string comparison", () => {
  // In real JS: [10, 9, 80, 3].sort() gives [10, 3, 80, 9] (string sort!)
  // A beginner expects numeric sorting
  // Should either block sort() without a comparator on number arrays,
  // or provide a warning/educational message

  test.skip("sort() on number array without comparator should warn or block", () => {
    const code = `
      let arr = [10, 9, 80, 3, 21]
      arr.sort()
    `;
    const { frames } = interpret(code);
    // Should either produce an error or sort numerically
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    const sorted = lastFrame.variables.arr?.value?.map((v: any) => v.value);
    // A beginner expects [3, 9, 10, 21, 80] but real JS gives [10, 21, 3, 80, 9]
    expect(sorted).toEqual([3, 9, 10, 21, 80]);
  });

  test.skip("sort() on string array without comparator should work normally", () => {
    const code = `
      let arr = ["banana", "apple", "cherry"]
      arr.sort()
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
    const sorted = lastFrame.variables.arr?.value?.map((v: any) => v.value);
    expect(sorted).toEqual(["apple", "banana", "cherry"]);
  });
});
