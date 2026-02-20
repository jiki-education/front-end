import { interpret } from "@javascript/interpreter";

describe("Footgun #25: Sparse arrays and Array() constructor", () => {
  // In real JS: Array(3) creates [empty x 3] (sparse), not [3]
  // And [1,,3] creates holes that different methods treat inconsistently
  // These are confusing for beginners and should be blocked

  test.skip("Array(3) should not create a sparse array", () => {
    // Array() constructor is not currently available but if added,
    // Array(3) should create [3] or throw an error, not [empty x 3]
    const code = "let arr = Array(3)";
    const { frames } = interpret(code);
    // Should either error or create [3], not sparse array
  });

  test.skip("sparse array literal should be a syntax error", () => {
    const { error } = interpret("let arr = [1, , 3]");
    expect(error).not.toBeNull();
  });

  test.skip("accessing beyond array bounds should error", () => {
    const code = `
      let arr = [1, 2, 3]
      arr[10]
    `;
    const { frames } = interpret(code);
    // In real JS: returns undefined silently
    // Should this error in educational mode?
    const lastFrame = frames[frames.length - 1];
    expect(lastFrame.status).toBe("ERROR");
  });
});
