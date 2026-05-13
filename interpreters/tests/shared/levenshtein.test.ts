import { levenshtein } from "@shared/levenshtein";

describe("levenshtein", () => {
  test("identical strings have distance 0", () => {
    expect(levenshtein("const", "const")).toBe(0);
  });

  test("empty strings", () => {
    expect(levenshtein("", "")).toBe(0);
    expect(levenshtein("", "abc")).toBe(3);
    expect(levenshtein("abc", "")).toBe(3);
  });

  test("single substitution", () => {
    expect(levenshtein("cons", "cont")).toBe(1);
  });

  test("single insertion", () => {
    expect(levenshtein("cons", "const")).toBe(1);
  });

  test("single deletion", () => {
    expect(levenshtein("constt", "const")).toBe(1);
  });

  test("multiple edits", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
    expect(levenshtein("lt", "let")).toBe(1);
    expect(levenshtein("vr", "var")).toBe(1);
  });

  test("completely different strings", () => {
    expect(levenshtein("xyzzy", "const")).toBeGreaterThan(2);
  });
});
