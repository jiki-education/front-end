import { interpret } from "@javascript/interpreter";

describe("Footgun #22: String comparison is lexicographic, not numeric", () => {
  // In real JS: "10" > "9" is false because "1" < "9" (character comparison)
  // A beginner comparing string numbers expects numeric comparison
  // Should we block comparison operators on strings, or warn?

  test.skip('"10" > "9" should warn or handle educationally', () => {
    const { frames } = interpret('"10" > "9"');
    // In real JS: false (lexicographic: "1" < "9")
    // Beginner expects: true (numeric: 10 > 9)
    // Should the interpreter block this or return a helpful error?
    expect(frames[0].status).toBe("ERROR");
  });

  test.skip('"a" < "B" case sensitivity should be handled', () => {
    const { frames } = interpret('"a" < "B"');
    // In real JS: false (lowercase 'a' is 97, uppercase 'B' is 66)
    // Beginner expects: true (alphabetical)
  });

  test.skip("comparison of number strings should warn", () => {
    const code = `
      let a = "100"
      let b = "99"
      let result = a > b
    `;
    const { frames } = interpret(code);
    // Should produce an educational message about string vs number comparison
  });
});
