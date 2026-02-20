import { interpret } from "@javascript/interpreter";

describe("Footgun #10: with statement", () => {
  // In real JS: with creates ambiguous scope, deprecated in strict mode
  // Jiki permanently excludes with from the scanner

  test("with is permanently excluded", () => {
    const { error } = interpret("with ({}) {}");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });
});
