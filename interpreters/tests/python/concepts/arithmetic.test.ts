import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";
describe("arithmetic concepts", () => {
  describe("integer literals", () => {
    test("simple integer", () => {
      const { frames, error } = interpret("42");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).description).toContain("42");
    });

    test("zero", () => {
      const { frames, error } = interpret("0");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).description).toContain("0");
    });

    test("negative integer via literal", () => {
      const { frames, error } = interpret("-5");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).description).toContain("-5");
    });
  });

  describe("floating point literals", () => {
    test("simple float", () => {
      const { frames, error } = interpret("3.14");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).description).toContain("3.14");
    });

    test("scientific notation", () => {
      const { frames, error } = interpret("1.5e2");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).description).toContain("150");
    });

    test("negative scientific notation", () => {
      const { frames, error } = interpret("2e-3");
      expect(error).toBeNull();
      expect(frames).toBeArrayOfSize(1);
      expect((frames[0] as TestAugmentedFrame).description).toContain("0.002");
    });
  });
});
