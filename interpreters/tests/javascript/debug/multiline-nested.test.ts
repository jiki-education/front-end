import { interpret } from "@javascript/interpreter";

describe("Debug Multiline Nested", () => {
  it("multiline nested - single line version", () => {
    const code = `let x = [{ something: [{ foo: [0, 1, 2, 3, 4, 5] }] }];`;
    const result = interpret(code);

    console.log("Success:", result.success);
    if (!result.success && result.error) {
      console.log("Error:", result.error.type, "at line", result.error.location.line);
    }

    expect(result.success).toBe(true);
  });

  it("multiline nested - formatted version", () => {
    const code = `
let x = [
  { something: [{ foo: [0, 1, 2, 3, 4, 5] }] }
];`;
    const result = interpret(code);

    console.log("Success:", result.success);
    if (!result.success && result.error) {
      console.log("Error:", result.error.type, "at line", result.error.location.line);
      console.log("Location:", result.error.location);
    }

    expect(result.success).toBe(true);
  });
});
