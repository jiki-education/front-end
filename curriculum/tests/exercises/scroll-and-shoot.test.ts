import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import exercise from "../../src/exercises/scroll-and-shoot";
import { runExerciseTests } from "../runScenarioTest";

const dir = join(__dirname, "../../src/exercises/scroll-and-shoot");
const solution = readFileSync(join(dir, "solution.javascript"), "utf-8");

describe("scroll-and-shoot", () => {
  it("the run-forever solution passes every wave", () => {
    const results = runExerciseTests(exercise, solution, "javascript");
    const failed = results.filter((r) => r.status !== "pass");
    expect(
      failed.map(
        (f) =>
          `${f.slug}: ${f.expects
            .filter((e) => !e.pass)
            .map((e) => e.errorHtml)
            .join("; ")}`
      )
    ).toEqual([]);
  });

  it("the final wave rejects a counted repeat(n)", () => {
    // A counted-repeat solution: the code check on full-rows must reject it
    // regardless of the (respawn-randomised) game outcome.
    const countedRepeat = solution.replace("repeat()", "repeat(80)");
    const results = runExerciseTests(exercise, countedRepeat, "javascript");
    const fullRows = results.find((r) => r.slug === "full-rows");

    expect(fullRows).toBeDefined();
    expect(
      fullRows!.expects.some((e) => !e.pass && e.errorHtml != null && e.errorHtml.includes("noRepeatWithArg"))
    ).toBe(true);
  });
});
