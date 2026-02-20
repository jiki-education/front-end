import { interpret } from "@javascript/interpreter";

describe("Footgun #12: void, delete, yield (excluded operators)", () => {
  // These are confusing operators permanently excluded from Jiki

  test("void is permanently excluded", () => {
    const { error } = interpret("void 0");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });

  test("delete is permanently excluded", () => {
    const { error } = interpret("let obj = { a: 1 }; delete obj.a");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });

  test("yield is permanently excluded", () => {
    const { error } = interpret("yield 5");
    expect(error).not.toBeNull();
    expect(error?.type).toBe("PermanentlyExcludedToken");
  });
});
