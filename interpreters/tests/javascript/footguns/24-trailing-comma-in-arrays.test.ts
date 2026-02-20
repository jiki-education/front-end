import { interpret } from "@javascript/interpreter";

describe("Footgun #24: Trailing commas in array literals", () => {
  // In real JS: [1, 2, 3,] is valid with length 3 (trailing comma ignored)
  // And [1,,3] creates a sparse array with a "hole" at index 1
  // Jiki already blocks trailing commas with TrailingCommaInArray

  test.skip("trailing comma in array literal should be blocked", () => {
    const { error } = interpret("[1, 2, 3,]");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("TrailingCommaInArray");
  });

  test.skip("sparse array [1,,3] should be blocked", () => {
    // Double comma creates a hole - this should be a syntax error
    const { error } = interpret("[1,,3]");
    expect(error).not.toBeNull();
  });

  test.skip("normal array literals work fine", () => {
    const { frames, error } = interpret("[1, 2, 3]");
    expect(error).toBeNull();
    expect(frames[0].status).toBe("SUCCESS");
  });
});
