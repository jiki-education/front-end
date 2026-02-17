import { interpret } from "@jikiscript/interpreter";
import { parse } from "@jikiscript/parser";
import { ContinueStatement, ForeachStatement, SetVariableStatement } from "@jikiscript/statement";
import { Location } from "@jikiscript/location";
import { FunctionCallExpression, ListExpression, LiteralExpression } from "@jikiscript/expression";
import { RuntimeError } from "@jikiscript/error";
import { Primitive } from "@jikiscript/jikiObjects";

const generateEchosContext = (echos: any[]) => {
  return {
    externalFunctions: [
      {
        name: "echo",
        func: (_: any, n: Primitive) => {
          echos.push(n.value.toString());
        },
        description: "",
      },
    ],
  };
};

describe("execute", () => {
  test("multiple times", () => {
    const echos: string[] = [];
    const { frames } = interpret(
      `
      repeat 3 times do
        echo("a")
      end
    `,
      generateEchosContext(echos)
    );
    expect(frames).toBeArrayOfSize(6);
    expect(frames[frames.length - 1].status).toBe("SUCCESS");
    expect(echos).toEqual(["a", "a", "a"]);
  });

  test("indexed by", () => {
    const echos: string[] = [];
    const { frames } = interpret(
      `
      repeat 3 times indexed by idx do
        echo(idx)
      end
    `,
      generateEchosContext(echos)
    );
    expect(frames).toBeArrayOfSize(6);
    expect(frames[frames.length - 1].status).toBe("SUCCESS");
    expect(echos).toEqual(["1", "2", "3"]);
  });

  test("continue", () => {
    const echos: string[] = [];

    const { frames } = interpret(
      `
      repeat 5 times indexed by idx do
        if idx == 3 or idx == 4 do
          continue 
        end
        echo(idx)
      end
    `,
      generateEchosContext(echos)
    );
    expect(frames).toBeArrayOfSize(15);
    expect(frames[frames.length - 1].status).toBe("SUCCESS");
    expect(echos).toEqual(["1", "2", "5"]);
  });
  test("next", () => {
    const echos: string[] = [];

    const { frames } = interpret(
      `
      repeat 5 times indexed by idx do
        if idx == 3 or idx == 4 do
          next 
        end
        echo(idx)
      end
    `,
      generateEchosContext(echos)
    );
    expect(frames).toBeArrayOfSize(15);
    expect(frames[frames.length - 1].status).toBe("SUCCESS");
    expect(echos).toEqual(["1", "2", "5"]);
  });

  test("break", () => {
    const echos: string[] = [];

    const { frames } = interpret(
      `
      repeat 5 times indexed by idx do
        if idx == 3 do
          break 
        end
        echo(idx)
      end
    `,
      generateEchosContext(echos)
    );
    expect(frames).toBeArrayOfSize(9);
    expect(frames[frames.length - 1].status).toBe("SUCCESS");
    expect(echos).toEqual(["1", "2"]);
  });

  test("counter does not leak", () => {
    const { frames } = interpret(
      `
      repeat 1 times indexed by idx do
      end
      log idx
    `,
      {}
    );
    const lastFrame = frames[frames.length - 1];
    expect(lastFrame.status).toBe("ERROR");
    expect(lastFrame.error).toBeInstanceOf(RuntimeError);
    expect(lastFrame.error?.message).toMatch(/VariableNotDeclared: name: idx/);
  });
  test.skip("counter does not leak with break", () => {
    const { frames } = interpret(
      `
      repeat 1 times indexed by idx do
      end
      log idx
    `,
      {}
    );
    const lastFrame = frames[frames.length - 1];
    expect(lastFrame.status).toBe("ERROR");
    expect(lastFrame.error).toBeInstanceOf(RuntimeError);
    expect(lastFrame.error?.message).toMatch(/VariableNotDeclared: name: idx/);
  });
});

describe("no-arg repeat (repeat forever)", () => {
  test("runs until exerciseFinished is called", () => {
    const echos: string[] = [];
    let callCount = 0;
    const { frames } = interpret(
      `
      repeat do
        echo("a")
      end
    `,
      {
        externalFunctions: [
          {
            name: "echo",
            func: (ctx: any, n: Primitive) => {
              echos.push(n.value.toString());
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
    expect(echos).toEqual(["a", "a", "a"]);
  });

  test("breaks at end of iteration, not mid-iteration", () => {
    const echos: string[] = [];
    let callCount = 0;
    const { frames } = interpret(
      `
      repeat do
        echo("before")
        echo("after")
      end
    `,
      {
        externalFunctions: [
          {
            name: "echo",
            func: (ctx: any, n: Primitive) => {
              echos.push(n.value.toString());
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
    // Should complete the first full iteration (both echoes) then stop
    expect(echos).toEqual(["before", "after"]);
  });

  test("repeat do...end works with break", () => {
    const echos: string[] = [];
    const { frames } = interpret(
      `
      repeat indexed by idx do
        if idx == 3 do
          break
        end
        echo(idx)
      end
    `,
      {
        externalFunctions: [
          {
            name: "echo",
            func: (_: any, n: Primitive) => {
              echos.push(n.value.toString());
            },
            description: "",
          },
        ],
      }
    );
    expect(echos).toEqual(["1", "2"]);
  });
});
