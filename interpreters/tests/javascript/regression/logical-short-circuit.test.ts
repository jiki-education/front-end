import { describe, test, expect } from "vitest";
import type { TestAugmentedFrame } from "@shared/frames";
import { interpret } from "@javascript/interpreter";

// Regression for a forum-reported bug: the right side of a `&&`/`||` chain was
// evaluated eagerly, so a short-circuited sub-expression that would throw (e.g.
// an out-of-bounds index access) still crashed the program even though real
// JavaScript would never reach it.
describe("JavaScript logical short-circuit regression tests", () => {
  test("&& does not evaluate the right side when the left is false", () => {
    // name[person.length] would be name[4] on a 4-char string and throw, but the
    // false left side (person !== name) must short-circuit before it is reached.
    const code = `
      let name = "Cher";
      let person = "Cher";
      let result = false;
      if (person !== name && name[person.length] === " ") {
        result = true;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const finalFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(finalFrame.status).toBe("SUCCESS");
    expect(finalFrame.variables.result.value).toBe(false);
  });

  test("|| does not evaluate the right side when the left is true", () => {
    const code = `
      let name = "Cher";
      let person = "Cher";
      let result = false;
      if (person === name || name[person.length] === " ") {
        result = true;
      }
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const finalFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(finalFrame.status).toBe("SUCCESS");
    expect(finalFrame.variables.result.value).toBe(true);
  });

  test("the out-of-bounds access still throws when actually reached", () => {
    const code = `
      let name = "Cher";
      let x = name[10];
    `;
    const { frames } = interpret(code);
    const errorFrame = frames.find(f => (f as TestAugmentedFrame).status === "ERROR") as TestAugmentedFrame;
    expect(errorFrame).toBeDefined();
    expect(errorFrame.error?.type).toBe("StringIndexOutOfRange");
  });

  test("full after-party style condensed expression works for exact match", () => {
    const code = `
      function matches(person, name) {
        return person === name || (name.startsWith(person) && person.length <= name.length && name[person.length] === " ");
      }
      let a = matches("Cher", "Cher");
      let b = matches("Cheryl", "Cher");
      let c = matches("Cher", "Cher Lloyd");
    `;
    const { frames, error } = interpret(code);
    expect(error).toBeNull();
    const finalFrame = frames[frames.length - 1] as TestAugmentedFrame;
    expect(finalFrame.status).toBe("SUCCESS");
    expect(finalFrame.variables.a.value).toBe(true);
    expect(finalFrame.variables.b.value).toBe(false);
    expect(finalFrame.variables.c.value).toBe(true);
  });
});
