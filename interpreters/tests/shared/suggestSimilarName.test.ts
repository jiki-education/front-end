import { suggestSimilarName } from "@shared/suggestSimilarName";

describe("suggestSimilarName", () => {
  test("suggests a name that differs only in capitalisation", () => {
    expect(suggestSimilarName("turnright", ["move", "turnRight"])).toBe("turnRight");
  });

  test("suggests a capitalisation fix even for single-letter names", () => {
    expect(suggestSimilarName("x", ["X"])).toBe("X");
  });

  test("suggests a name one edit away", () => {
    expect(suggestSimilarName("tunRight", ["turnRight"])).toBe("turnRight");
    expect(suggestSimilarName("m0ve", ["move"])).toBe("move");
  });

  test("suggests a name two edits away when the name is long enough", () => {
    expect(suggestSimilarName("trnRigt", ["turnRight"])).toBe("turnRight");
  });

  test("does not suggest a name three edits away", () => {
    expect(suggestSimilarName("trnRgt", ["turnRight"])).toBeNull();
  });

  test("does not suggest a different short name", () => {
    expect(suggestSimilarName("x", ["y"])).toBeNull();
    expect(suggestSimilarName("ab", ["ac"])).toBeNull();
  });

  test("prefers the closest candidate", () => {
    expect(suggestSimilarName("turnleft", ["turnLift", "turnLeft"])).toBe("turnLeft");
  });

  test("never suggests the name itself", () => {
    expect(suggestSimilarName("move", ["move"])).toBeNull();
  });

  test("returns null when there are no candidates", () => {
    expect(suggestSimilarName("move", [])).toBeNull();
  });
});
