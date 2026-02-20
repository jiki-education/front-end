import { interpret } from "@javascript/interpreter";

describe("Footgun #9: var keyword (hoisting and function scoping)", () => {
  // In real JS: var has confusing hoisting and function scoping
  // Jiki permanently excludes var from the scanner

  test("var is permanently excluded", () => {
    const { error } = interpret("var x = 5");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });

  test("var in for loop is permanently excluded", () => {
    const { error } = interpret("for (var i = 0; i < 3; i++) {}");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });
});
