import { interpret } from "@python/interpreter";
import type { TestAugmentedFrame } from "@shared/frames";

describe("Python Concepts - Repeat", () => {
  describe("basic repeat", () => {
    test("runs until exerciseFinished is called", () => {
      const echos: string[] = [];
      let callCount = 0;
      const { frames, error } = interpret(
        `repeat:
    echo("a")`,
        {
          externalFunctions: [
            {
              name: "echo",
              func: (ctx: any, n: any) => {
                echos.push(n.toString());
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
      expect(echos).toEqual(["a", "a", "a"]);
    });

    test("breaks at end of iteration, not mid-iteration", () => {
      const echos: string[] = [];
      let callCount = 0;
      const { frames, error } = interpret(
        `repeat:
    echo("before")
    echo("after")`,
        {
          externalFunctions: [
            {
              name: "echo",
              func: (ctx: any, n: any) => {
                echos.push(n.toString());
                callCount++;
                if (callCount === 1) {
                  ctx.exerciseFinished();
                }
              },
              description: "",
            },
          ],
        }
      );
      expect(error).toBeNull();
      expect(echos).toEqual(["before", "after"]);
    });
  });

  describe("break and continue", () => {
    test("break exits the loop", () => {
      const code = `count = 0
repeat:
    count = count + 1
    if count == 3:
        break`;
      const { frames, error } = interpret(code);
      expect(error).toBeNull();
      const lastFrame = frames[frames.length - 1] as TestAugmentedFrame;
      expect(lastFrame.variables.count.value).toBe(3);
    });

    test("continue skips to next iteration", () => {
      const echos: string[] = [];
      let callCount = 0;
      const code = `count = 0
repeat:
    count = count + 1
    if count == 2:
        continue
    echo(count)`;
      const { frames, error } = interpret(code, {
        externalFunctions: [
          {
            name: "echo",
            func: (ctx: any, n: any) => {
              echos.push(n.toString());
              callCount++;
              if (callCount >= 3) {
                ctx.exerciseFinished();
              }
            },
            description: "",
          },
        ],
      });
      expect(error).toBeNull();
      // count=1 echoes "1", count=2 continues, count=3 echoes "3", count=4 echoes "4" (triggers finish)
      expect(echos).toEqual(["1", "3", "4"]);
    });
  });
});
