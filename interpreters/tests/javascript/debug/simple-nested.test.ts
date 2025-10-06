import { interpret } from "@javascript/interpreter";

describe("Debug Simple Nested", () => {
  it("simple array with object", () => {
    const code = `let x = [{ a: 1 }];`;
    const result = interpret(code);

    console.log("Success:", result.success);
    if (!result.success && result.error) {
      console.log("Error:", result.error.type, result.error.message);
    }

    expect(result.success).toBe(true);
  });

  it("nested object in array", () => {
    const code = `let x = [{ something: [1, 2] }];`;
    const result = interpret(code);

    console.log("Success:", result.success);
    if (!result.success && result.error) {
      console.log("Error:", result.error.type, result.error.message);
    }

    expect(result.success).toBe(true);
  });
});
