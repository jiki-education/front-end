import { describe, it, expect } from "vitest";
import exercise from "../../src/exercises/adventures-in-poetry";
import { runExerciseTests } from "../runScenarioTest";

function run(src: string) {
  return runExerciseTests(exercise, src, "javascript");
}

function failures(src: string) {
  return run(src)
    .flatMap((r) => r.expects)
    .filter((e) => !e.pass)
    .map((e) => e.errorHtml ?? "");
}

describe("adventures-in-poetry code checks", () => {
  it("rejects &&", () => {
    const src = `
let poem = ""
while (true) {
  let found = move()
  if (found === "🏁") {
    break
  }
  if (found !== "" && !isEmoji(found)) {
    poem = poem + found
  }
}
recite(poem)
`;
    expect(failures(src).join("\n")).toContain("checks.noAndOrNot");
  });

  it("allows ||, which makes the guard list the shortest solution", () => {
    const src = `
let poem = ""
let words = 0
let needsSpace = false

while (true) {
  let found = move()

  if (found === "🏁") {
    break
  }
  if (found === "" || isEmoji(found)) {
    continue
  }
  if (found === "'" || found === ",") {
    poem = poem + found
    needsSpace = found === ","
    continue
  }
  if (needsSpace) {
    poem = poem + " "
  }
  poem = poem + found
  needsSpace = true
  words = words + 1
  if (words === 7) {
    break
  }
}

recite(poem)
`;
    expect(failures(src)).toEqual([]);
  });

  it("rejects a correct solution that avoids continue and break", () => {
    // Uses a flag to end the loop and `=== false` in place of `!`, so it slips
    // past the operator and nesting rules while teaching none of the lesson.
    const src = `
let poem = ""
let words = 0
let needsSpace = false
let walking = true

while (walking) {
  let found = move()
  let skip = found === "" || isEmoji(found) || found === "'" || found === "," || found === "🏁"
  let spacer = ""

  if (needsSpace) {
    spacer = " "
  }
  if (found === "'") {
    poem = poem + "'"
    needsSpace = false
  }
  if (found === ",") {
    poem = poem + ","
    needsSpace = true
  }
  if (skip === false) {
    poem = poem + spacer + found
    needsSpace = true
    words = words + 1
  }
  if (found === "🏁" || words === 7) {
    walking = false
  }
}

recite(poem)
`;
    const reported = failures(src).join("\n");
    expect(reported).toContain("checks.needsContinue");
    expect(reported).toContain("checks.needsBreak");
  });

  it("rejects a user-defined function", () => {
    const src = `
function skip(found) {
  return found === ""
}
let poem = ""
while (true) {
  let found = move()
  if (found === "🏁") {
    break
  }
  if (skip(found)) {
    continue
  }
  poem = poem + found
}
recite(poem)
`;
    expect(failures(src).join("\n")).toContain("checks.noFunctions");
  });

  it("rejects nesting past a loop and one if", () => {
    const src = `
let poem = ""
while (true) {
  let found = move()
  if (found === "🏁") {
    break
  }
  if (found !== "") {
    if (!isEmoji(found)) {
      poem = poem + found
    }
  }
}
recite(poem)
`;
    expect(failures(src).join("\n")).toContain("checks.tooDeeplyNested");
  });

  it("rejects reciting more than once", () => {
    const src = `
let poem = ""
while (true) {
  let found = move()
  if (found === "") {
    continue
  }
  if (found === "🏁") {
    break
  }
  recite(poem)
}
recite(poem)
`;
    expect(failures(src).join("\n")).toContain("checks.reciteOnce");
  });

  it("catches the flag-after-scenery ordering bug", () => {
    const src = `
let poem = ""
let needsSpace = false
while (true) {
  let found = move()
  if (found === "") {
    continue
  }
  if (isEmoji(found)) {
    continue
  }
  if (found === "🏁") {
    break
  }
  if (needsSpace) {
    poem = poem + " "
  }
  poem = poem + found
  needsSpace = true
}
recite(poem)
`;
    const results = run(src);
    expect(results.every((r) => r.status === "fail")).toBe(true);
  });
});
