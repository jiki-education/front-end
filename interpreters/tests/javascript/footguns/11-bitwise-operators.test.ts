import { interpret } from "@javascript/interpreter";

describe("Footgun #11: Bitwise operators (& vs &&, | vs ||)", () => {
  // In real JS: true & false === 0 (bitwise), easily confused with && and ||
  // Jiki permanently excludes all bitwise operators

  test("& (bitwise AND) is permanently excluded", () => {
    const { error } = interpret("5 & 3");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });

  test("| (bitwise OR) is permanently excluded", () => {
    const { error } = interpret("5 | 3");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });

  test("^ (bitwise XOR) is permanently excluded", () => {
    const { error } = interpret("5 ^ 3");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });

  test("~ (bitwise NOT) is permanently excluded", () => {
    const { error } = interpret("~5");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });
});
