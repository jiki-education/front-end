import { interpret } from "@javascript/interpreter";

describe("Footgun #16: Assignment in conditional (if (x = 5))", () => {
  // In real JS: if (x = 5) assigns 5 to x, then checks truthiness (always true)
  // A beginner writing if (x = 5) almost certainly meant if (x === 5)
  // This should be blocked or warned about

  test.skip("assignment in if condition should be blocked", () => {
    const { frames } = interpret("let x = 0; if (x = 5) { let y = 1 }");
    // Should produce an error rather than silently assigning
    expect(frames.find(f => f.status === "ERROR")).toBeDefined();
  });

  test.skip("assignment in while condition should be blocked", () => {
    const { frames } = interpret("let x = 0; while (x = 1) { break }");
    expect(frames.find(f => f.status === "ERROR")).toBeDefined();
  });
});
