import { interpret } from "@javascript/interpreter";

describe("JavaScript repeatDelay", () => {
  describe("repeat loops", () => {
    test("frames are spaced by repeatDelay", () => {
      const { frames, error } = interpret(
        `
        repeat(3) {
          let x = 1
        }
        `,
        { languageFeatures: { repeatDelay: 200 } }
      );
      expect(error).toBeNull();

      // Find repeat statement frames (iteration frames)
      const repeatFrames = frames.filter(f => f.result?.type === "RepeatStatement");
      expect(repeatFrames).toHaveLength(3);

      // Each iteration should be spaced further apart due to repeatDelay
      // The gap between iteration 2 and iteration 1 should be larger than just the body frames
      const timeBetween1and2 = repeatFrames[1].time - repeatFrames[0].time;
      const timeBetween2and3 = repeatFrames[2].time - repeatFrames[1].time;

      // With repeatDelay of 200ms (* 1000 scale factor = 200000 microseconds),
      // the gap should include the delay
      expect(timeBetween1and2).toBeGreaterThanOrEqual(200000);
      expect(timeBetween2and3).toBeGreaterThanOrEqual(200000);
    });

    test("no delay when repeatDelay is 0", () => {
      const { frames: framesWithDelay } = interpret(
        `
        repeat(3) {
          let x = 1
        }
        `,
        { languageFeatures: { repeatDelay: 200 } }
      );

      const { frames: framesWithoutDelay } = interpret(
        `
        repeat(3) {
          let x = 1
        }
        `,
        { languageFeatures: { repeatDelay: 0 } }
      );

      const lastWithDelay = framesWithDelay[framesWithDelay.length - 1].time;
      const lastWithoutDelay = framesWithoutDelay[framesWithoutDelay.length - 1].time;
      expect(lastWithDelay).toBeGreaterThan(lastWithoutDelay);
    });

    test("no delay when repeatDelay is not set", () => {
      const { frames: framesWithDelay } = interpret(
        `
        repeat(3) {
          let x = 1
        }
        `,
        { languageFeatures: { repeatDelay: 200 } }
      );

      const { frames: framesDefault } = interpret(`
        repeat(3) {
          let x = 1
        }
      `);

      const lastWithDelay = framesWithDelay[framesWithDelay.length - 1].time;
      const lastDefault = framesDefault[framesDefault.length - 1].time;
      expect(lastWithDelay).toBeGreaterThan(lastDefault);
    });

    test("forever repeat also applies delay", () => {
      let callCount = 0;
      const { frames, error } = interpret(
        `
        repeat() {
          echo("a")
        }
        `,
        {
          languageFeatures: { repeatDelay: 100 },
          externalFunctions: [
            {
              name: "echo",
              func: (ctx: any, _n: any) => {
                callCount++;
                if (callCount >= 3) {
                  ctx.exerciseFinished();
                }
              },
              description: "",
            },
          ],
        }
      );
      expect(error).toBeNull();

      const repeatFrames = frames.filter(f => f.result?.type === "RepeatStatement");
      expect(repeatFrames.length).toBeGreaterThanOrEqual(3);

      const timeBetween1and2 = repeatFrames[1].time - repeatFrames[0].time;
      expect(timeBetween1and2).toBeGreaterThanOrEqual(100000);
    });
  });

  describe("for loops", () => {
    test("frames are spaced by repeatDelay", () => {
      const { frames, error } = interpret(
        `
        for (let i = 0; i < 3; i++) {
          let x = 1
        }
        `,
        { languageFeatures: { repeatDelay: 200 } }
      );
      expect(error).toBeNull();

      const lastFrameTime = frames[frames.length - 1].time;
      // With 3 iterations and 200ms delay each (* 1000 = 200000 microseconds each),
      // total time should include at least 600000 microseconds of delay
      expect(lastFrameTime).toBeGreaterThanOrEqual(600000);
    });

    test("no extra delay without repeatDelay", () => {
      const { frames: framesWithDelay } = interpret(
        `
        for (let i = 0; i < 3; i++) {
          let x = 1
        }
        `,
        { languageFeatures: { repeatDelay: 200 } }
      );

      const { frames: framesDefault } = interpret(`
        for (let i = 0; i < 3; i++) {
          let x = 1
        }
      `);

      const lastWithDelay = framesWithDelay[framesWithDelay.length - 1].time;
      const lastDefault = framesDefault[framesDefault.length - 1].time;
      expect(lastWithDelay).toBeGreaterThan(lastDefault);
    });
  });

  describe("while loops", () => {
    test("frames are spaced by repeatDelay", () => {
      const { frames, error } = interpret(
        `
        let i = 0
        while (i < 3) {
          i = i + 1
        }
        `,
        { languageFeatures: { repeatDelay: 200 } }
      );
      expect(error).toBeNull();

      const lastFrameTime = frames[frames.length - 1].time;
      // With 3 iterations and 200ms delay each (* 1000 = 200000 microseconds each),
      // total time should include at least 600000 microseconds of delay
      expect(lastFrameTime).toBeGreaterThanOrEqual(600000);
    });

    test("no extra delay without repeatDelay", () => {
      const { frames: framesWithDelay } = interpret(
        `
        let i = 0
        while (i < 3) {
          i = i + 1
        }
        `,
        { languageFeatures: { repeatDelay: 200 } }
      );

      const { frames: framesDefault } = interpret(`
        let i = 0
        while (i < 3) {
          i = i + 1
        }
      `);

      const lastWithDelay = framesWithDelay[framesWithDelay.length - 1].time;
      const lastDefault = framesDefault[framesDefault.length - 1].time;
      expect(lastWithDelay).toBeGreaterThan(lastDefault);
    });
  });
});
