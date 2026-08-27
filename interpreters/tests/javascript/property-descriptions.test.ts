import { interpret } from "@javascript/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

function description(code: string): string {
  const { frames, error } = interpret(code);
  expect(error).toBeNull();
  return (frames as TestAugmentedFrame[])[frames.length - 1].description;
}

describe("member expression descriptions", () => {
  test("a property read on an array is not described as an index read", () => {
    const html = description("let n = [1, 2, 3].length;");

    expect(html).toContain("Jiki got the <code");
    expect(html).toContain("length");
    expect(html).toContain("of the array");
    expect(html).not.toContain("at index");
  });

  test("a property read on a string is not described as a character read", () => {
    const html = description('let n = "ab".length;');

    expect(html).toContain("of the string");
    expect(html).not.toContain("at index");
    expect(html).not.toContain("character");
  });

  test("an index read is still described as an index read", () => {
    const html = description("let x = [7, 8][1];");

    expect(html).toContain("Jiki got the item at index 1 in the array");
  });

  test("a character read is still described as a character read", () => {
    const html = description('let c = "abc"[1];');

    expect(html).toContain("Jiki got the character at index 1 in the string");
  });
});
