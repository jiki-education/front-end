import { interpret } from "@javascript/interpreter";

// exerciseFinished() (called by exercises when the goal is reached, e.g. the
// maze character lands on the target) halts execution at the end of the
// current statement. Nothing else runs: no further loop iterations of any
// loop type, no statements later in the block, no statements after the loop.

function finishingEcho(echos: string[], finishOn: string) {
  return {
    externalFunctions: [
      {
        name: "echo",
        func: (ctx: any, n: any) => {
          const value = n.value.toString();
          echos.push(value);
          if (value === finishOn) {
            ctx.exerciseFinished();
          }
        },
        description: "",
      },
    ],
  };
}

describe("exerciseFinished halts execution", () => {
  test("counted repeat stops before its remaining iterations", () => {
    const echos: string[] = [];
    const { error } = interpret(
      `
      repeat(50) {
        echo("step")
      }
      `,
      finishingEcho(echos, "step")
    );
    expect(error).toBeNull();
    expect(echos).toEqual(["step"]);
  });

  test("counted repeat: remaining statements in the finishing iteration are skipped", () => {
    const echos: string[] = [];
    const { error } = interpret(
      `
      repeat(3) {
        echo("finish")
        echo("skipped")
      }
      `,
      finishingEcho(echos, "finish")
    );
    expect(error).toBeNull();
    expect(echos).toEqual(["finish"]);
  });

  test("while loop stops", () => {
    const echos: string[] = [];
    const { error } = interpret(
      `
      let i = 0
      while (i < 50) {
        i = i + 1
        echo("step")
      }
      `,
      finishingEcho(echos, "step")
    );
    expect(error).toBeNull();
    expect(echos).toEqual(["step"]);
  });

  test("for loop stops", () => {
    const echos: string[] = [];
    const { error } = interpret(
      `
      for (let i = 0; i < 50; i++) {
        echo("step")
      }
      `,
      finishingEcho(echos, "step")
    );
    expect(error).toBeNull();
    expect(echos).toEqual(["step"]);
  });

  test("for-of loop stops", () => {
    const echos: string[] = [];
    const { error } = interpret(
      `
      for (const x of ["a", "b", "c"]) {
        echo(x)
      }
      `,
      finishingEcho(echos, "b")
    );
    expect(error).toBeNull();
    expect(echos).toEqual(["a", "b"]);
  });

  test("statements after the loop do not run", () => {
    const echos: string[] = [];
    const { error } = interpret(
      `
      repeat(5) {
        echo("step")
      }
      echo("after-loop")
      `,
      finishingEcho(echos, "step")
    );
    expect(error).toBeNull();
    expect(echos).toEqual(["step"]);
  });

  test("remaining statements in a function body do not run", () => {
    const echos: string[] = [];
    const { error } = interpret(
      `
      function doSteps() {
        echo("finish")
        echo("skipped-in-function")
      }
      doSteps()
      echo("after-call")
      `,
      finishingEcho(echos, "finish")
    );
    expect(error).toBeNull();
    expect(echos).toEqual(["finish"]);
  });

  test("no further frames are generated after the finishing statement", () => {
    const echos: string[] = [];
    const { frames: finishedFrames, error } = interpret(
      `
      repeat(50) {
        echo("step")
      }
      `,
      finishingEcho(echos, "step")
    );
    expect(error).toBeNull();

    const { frames: fullFrames } = interpret(
      `
      repeat(50) {
        echo("step")
      }
      `,
      {
        externalFunctions: [{ name: "echo", func: (_ctx: any, _n: any) => {}, description: "" }],
      }
    );

    // The finished run stops after the first iteration; the unfinished run
    // executes all 50 iterations and so produces far more frames.
    expect(finishedFrames.length).toBeLessThan(fullFrames.length / 10);
  });
});
