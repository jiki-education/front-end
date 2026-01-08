import { test, expect, describe } from "vitest";
import { interpret, evaluateFunction, EvaluationContext } from "@jikiscript/interpreter";
import type { ExecutionContext } from "@jikiscript/executor";
import { Number, unwrapJikiObject } from "@jikiscript/jikiObjects";
import type { TestAugmentedFrame } from "@shared/frames";
import type { StaticError } from "@jikiscript/error";

describe("statements", () => {
  describe("set expression", () => {
    test("number", () => {
      const { frames, error } = interpret("set x to 1");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
    });

    describe("unary", () => {
      test("negation", () => {
        const { frames } = interpret("set x to !true");
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
          x: false,
        });
      });

      test("minus", () => {
        const { frames } = interpret("set x to -3");
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].status).toBe("SUCCESS");
        expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: -3 });
      });
    });

    describe("binary", () => {
      describe("arithmetic", () => {
        test("plus", () => {
          const { frames } = interpret("set x to 2 + 3");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 5 });
        });

        test("minus", () => {
          const { frames } = interpret("set x to 7 - 6");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
        });

        test("division", () => {
          const { frames } = interpret("set x to 20 / 5");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 4 });
        });

        test("multiplication", () => {
          const { frames } = interpret("set x to 4 * 2");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 8 });
        });

        test("remainder", () => {
          const { frames } = interpret("set x to 4 % 3");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
        });
      });

      describe("comparison", () => {
        test("equality with is - true", () => {
          const { frames, error } = interpret("set x to (2 is 2)");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
            x: true,
          });
        });

        test("equality with equals - true", () => {
          const { frames } = interpret("set x to 2 equals 2");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
            x: true,
          });
        });

        test("equality with is - false", () => {
          const { frames } = interpret('set x to (2 is "2")');
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
            x: false,
          });
        });

        test("equality with equals", () => {
          const { frames } = interpret('set x to 2 equals "2"');
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
            x: false,
          });
        });

        // TODO: Decide what syntax we want for this.
        test.skip("inequality", () => {
          const { frames } = interpret('set x to 2 != "2"');
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
            x: false,
          });
        });
      });

      describe("logical", () => {
        test("and", () => {
          const { frames } = interpret("set x to true and false");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
            x: false,
          });
        });

        test("or", () => {
          const { frames } = interpret("set x to true or false");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
            x: true,
          });
        });

        describe("truthiness doesn't exit", () => {
          test("and", () => {
            const { frames } = interpret('set x to true and "asd"');
            expect(frames).toBeArrayOfSize(1);
            expect(frames[0].status).toBe("ERROR");
          });

          test("or", () => {
            const { frames } = interpret("set x to false or 0");
            expect(frames).toBeArrayOfSize(1);
            expect(frames[0].status).toBe("ERROR");
          });
        });
      });

      describe("strings", () => {
        test.skip("plus", () => {
          const { frames } = interpret('set x to "sw" + "eet" ');
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].status).toBe("SUCCESS");
          expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
            x: "sweet",
          });
        });
      });
    });

    describe("assignment", () => {
      test("regular", () => {
        const { frames } = interpret(`
          set x to 2
          change x to 3
        `);
        expect(frames).toBeArrayOfSize(2);
        expect(frames[0].status).toBe("SUCCESS");
        expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 2 });
        expect(frames[1].status).toBe("SUCCESS");
        expect(unwrapJikiObject((frames[1] as TestAugmentedFrame).variables)).toMatchObject({ x: 3 });
      });
    });
  });

  describe("variable", () => {
    test("declare and use", () => {
      const { frames } = interpret("set x to 2");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 2 });
    });

    test("errors if declared twice", () => {
      const { error, frames } = interpret(`
        set pos to 10
        set pos to 20
      `);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].error!.category).toBe("RuntimeError");
      expect(frames[1].error!.type).toBe("VariableAlreadyDeclaredInScope");
    });

    test("declare and use", () => {
      const { frames } = interpret(`
        set x to 2
        set y to x + 1
      `);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 2 });
      expect(frames[1].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[1] as TestAugmentedFrame).variables)).toMatchObject({
        x: 2,
        y: 3,
      });
    });
  });

  describe("change", () => {
    test("changes variable correctly", () => {
      const { error, frames } = interpret(`
        set pos to 10
        change pos to 20
      `);
      expect(frames).toBeArrayOfSize(2);
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ pos: 10 });
      expect(unwrapJikiObject((frames[1] as TestAugmentedFrame).variables)).toMatchObject({ pos: 20 });
    });

    test("errors if not declared", () => {
      const { error, frames } = interpret(`
        change pos to 20
      `);
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].error!.category).toBe("RuntimeError");
      expect(frames[0].error!.type).toBe("VariableNotDeclared");
    });
  });

  describe("scope", () => {
    test("declared variable can be used in blocks", () => {
      const { error, frames } = interpret(`
        set pos to 10
        repeat 5 times do
          change pos to pos + 10
        end
      `);
      expect(frames).toBeArrayOfSize(11);
      expect(unwrapJikiObject((frames[10] as TestAugmentedFrame).variables)).toMatchObject({ pos: 60 });
    });

    test("declared variable is persisted after repeat", () => {
      const { error, frames } = interpret(`
        set pos to 10
        repeat 5 times do
          change pos to pos + 10
        end
        change pos to pos + 10
      `);
      expect(frames).toBeArrayOfSize(12);
      expect(unwrapJikiObject((frames[11] as TestAugmentedFrame).variables)).toMatchObject({ pos: 70 });
    });

    test("declared variable is persisted after if", () => {
      const { error, frames } = interpret(`
        set pos to 10
        if pos is 10 do
          change pos to pos + 10
        end
        change pos to pos + 5
      `);
      expect(frames).toBeArrayOfSize(4);
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ pos: 10 });
      expect(unwrapJikiObject((frames[1] as TestAugmentedFrame).variables)).toMatchObject({ pos: 10 });
      // expect(unwrapJikiObject((frames[2] as TestAugmentedFrame).variables)).toMatchObject({ pos: 20 })
      expect(unwrapJikiObject((frames[3] as TestAugmentedFrame).variables)).toMatchObject({ pos: 25 });
    });
  });

  describe("repeat", () => {
    test("once", () => {
      const { error, frames } = interpret(`
        set x to 0
        repeat 1 times do
          change x to x + 1
        end
      `);
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 0 });
      expect(frames[1].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[1] as TestAugmentedFrame).variables)).toMatchObject({ x: 0 });
      expect(frames[2].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[2] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
    });

    test("multiple times", () => {
      const { frames } = interpret(`
        set x to 0
        repeat 3 times do
          change x to x + 1
        end
      `);

      expect(frames).toBeArrayOfSize(7);
      expect(frames[0].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 0 });
      expect(frames[1].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[1] as TestAugmentedFrame).variables)).toMatchObject({ x: 0 });
      expect(frames[2].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[2] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
      expect(frames[3].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[3] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
      expect(frames[4].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[4] as TestAugmentedFrame).variables)).toMatchObject({ x: 2 });
      expect(frames[5].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[5] as TestAugmentedFrame).variables)).toMatchObject({ x: 2 });
      expect(frames[6].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[6] as TestAugmentedFrame).variables)).toMatchObject({ x: 3 });
    });
  });

  describe("block", () => {
    test("non-nested", () => {
      const { frames } = interpret(`
        do
          set x to 1
          set y to 2
        end
      `);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
      expect(frames[1].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[1] as TestAugmentedFrame).variables)).toMatchObject({
        x: 1,
        y: 2,
      });
    });

    test("nested", () => {
      const { frames } = interpret(`
        do
          set x to 1
          do
            set y to 2
          end
        end
      `);
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
      expect(frames[1].status).toBe("SUCCESS");
      expect(unwrapJikiObject((frames[1] as TestAugmentedFrame).variables)).toMatchObject({ y: 2 });
    });
  });
});

describe("frames", () => {
  describe("single statement", () => {
    test("literal", () => {
      const { frames } = interpret("log 125");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].line).toBe(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].code).toBe("log 125");
      expect(frames[0].error).toBeNil();
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toBeEmpty();
    });

    test("call", () => {
      const echoFunction = (_interpreter: any, _n: any) => {};
      const context = {
        externalFunctions: [
          {
            name: "echo",
            func: echoFunction,
            description: "",
          },
        ],
      };
      const { error, frames } = interpret("echo(1)", context);
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].line).toBe(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].code).toBe("echo(1)");
      expect(frames[0].error).toBeNil();
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toBeEmpty();
    });

    test("variable", () => {
      const { frames } = interpret("set x to 1");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].line).toBe(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].code).toBe("set x to 1");
      expect(frames[0].error).toBeNil();
      expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({ x: 1 });
    });
  });

  describe("multiple statements", () => {
    test("multiple calls", () => {
      const context = {
        externalFunctions: [
          {
            name: "echo",
            func: (_: any, n: any) => {},
            description: "",
          },
        ],
      };
      const { frames } = interpret(
        `
          echo(1)
          echo(2)
        `,
        context
      );
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].line).toBe(2);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].code).toBe("echo(1)");
      expect(frames[0].error).toBeNil();
      expect(frames[1].line).toBe(3);
      expect(frames[1].status).toBe("SUCCESS");
      expect(frames[1].code).toBe("echo(2)");
      expect(frames[1].error).toBeNil();
    });
  });

  test("no error", () => {
    const { frames, error } = interpret("log 125");
    expect(frames).not.toBeEmpty();
    expect(error).toBeNull();
  });
});

describe("timing", () => {
  describe("single statement", () => {
    test("success", () => {
      const context = {
        externalFunctions: [{ name: "echo", func: (_: any, _n: any) => {}, description: "" }],
      };
      const { frames } = interpret("echo(1)", context);
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].time).toBe(0);
    });
  });

  describe("multiple statements", () => {
    test("all successes", () => {
      const context = {
        externalFunctions: [{ name: "echo", func: (_: any, _n: any) => {}, description: "" }],
      };
      const { frames } = interpret(
        `
          echo(1)
          echo(2)
        `,
        context
      );
      expect(frames).toBeArrayOfSize(2);
      expect(frames[0].time).toBe(0);
      expect(frames[1].time).toBeCloseTo(1);
      expect(frames[1].timeInMs).toBeCloseTo(0.001); // 1 microsecond = 0.001ms (precise, not rounded)
    });
  });

  describe("execution context", () => {
    test("from non-user code", () => {
      const advanceTimeFunction = ({ fastForward }: ExecutionContext, n: Number) => fastForward(n.value);
      const context = {
        externalFunctions: [
          {
            name: "advanceTime",
            func: advanceTimeFunction,
            description: "",
          },
        ],
      };
      const { frames } = interpret(
        `
          log 1
          advanceTime(5)
          log 2
        `,
        context
      );
      expect(frames).toBeArrayOfSize(3);
      expect(frames[0].time).toBe(0);
      expect(frames[1].time).toBeCloseTo(5001);
      expect(frames[1].timeInMs).toBeCloseTo(5.001); // 5001 microseconds = 5.001ms (precise, not rounded)
      expect(frames[2].time).toBeCloseTo(5002);
      expect(frames[2].timeInMs).toBeCloseTo(5.002); // 5002 microseconds = 5.002ms (precise, not rounded)
    });

    test("from user code is not possible", () => {
      const { frames } = interpret("fastForward(100)");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("ERROR");
      expect(frames[0].time).toBe(0);
    });

    test("manipulate state", () => {
      const state = { count: 10 };
      const incrementFunction = ({ state }: ExecutionContext) => {
        state.count++;
      };
      const context = {
        externalFunctions: [
          {
            name: "increment",
            func: incrementFunction,
            description: "",
          },
        ],
        state,
      };
      const { frames } = interpret("increment()", context);
      expect(state.count).toBe(11);

      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].status).toBe("SUCCESS");
      expect(frames[0].time).toBe(0);
    });
  });
});

describe("errors", () => {
  test("scanner", () => {
    const { frames, error } = interpret("let 123#");
    expect(frames).toBeEmpty();
    expect(error).not.toBeNull();
    expect((error as StaticError)!.category).toBe("SyntaxError");
    expect((error as StaticError)!.type).toBe("UnknownCharacterInSource");
    expect((error as StaticError)!.context?.character).toBe("#");
  });

  test("parser", () => {
    const { frames, error } = interpret('"abc');
    expect(frames).toBeEmpty();
    expect(error).not.toBeNull();
    expect((error as StaticError)!.category).toBe("SyntaxError");
    expect((error as StaticError)!.type).toBe("MissingDoubleQuoteToTerminateStringLiteral");
    expect((error as StaticError)!.context).toBeNull;
  });

  describe("interpret", () => {
    describe("call", () => {
      test("non-callable", () => {
        const { frames, error } = interpret("1()");
        expect(error).not.toBeNull();

        expect(error!.type).toBe("InvalidFunctionNameExpression");
      });

      test("forgetting brackets", () => {
        const echoFunction = (_interpreter: any, _n: any) => {};
        const context = {
          externalFunctions: [{ name: "echo", func: echoFunction, description: "" }],
        };
        const { frames } = interpret("set x to echo", context);
        expect(frames[0].status).toBe("ERROR");
      });

      describe("arity", () => {
        describe("no optional parameters", () => {
          test("too many arguments", () => {
            const context = {
              externalFunctions: [
                {
                  name: "echo",
                  func: (_: any) => {},
                  description: "",
                },
              ],
            };
            const { frames, error } = interpret("echo(1)", context);

            expect(frames).toBeArrayOfSize(1);
            expect(frames[0].line).toBe(1);
            expect(frames[0].status).toBe("ERROR");
            expect(frames[0].code).toBe("echo(1)");
            expect(frames[0].error).not.toBeNull();
            expect(frames[0].error!.category).toBe("RuntimeError");
            expect(frames[0].error!.type).toBe("RangeErrorTooManyArgumentsForFunctionCall");
            expect(frames[0].error!.message).toBe("TooManyArguments: arity: 0, numberOfArgs: 1");
            expect(error).toBeNull();
          });

          test("too few arguments", () => {
            const context = {
              externalFunctions: [
                {
                  name: "echo",
                  func: (_int: any, _: any) => {},
                  description: "",
                },
              ],
            };
            const { frames, error } = interpret("echo()", context);
            expect(frames).toBeArrayOfSize(1);
            expect(frames[0].line).toBe(1);
            expect(frames[0].status).toBe("ERROR");
            expect(frames[0].code).toBe("echo()");
            expect(frames[0].error).not.toBeNull();
            expect(frames[0].error!.category).toBe("RuntimeError");
            expect(frames[0].error!.type).toBe("RangeErrorTooFewArgumentsForFunctionCall");
            expect(frames[0].error!.message).toBe("TooFewArguments: arity: 1, numberOfArgs: 0");
            expect(error).toBeNull();
          });
        });
      });

      describe("unknown function", () => {
        test("not misspelled", () => {
          const { frames, error } = interpret("foo()");
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].line).toBe(1);
          expect(frames[0].status).toBe("ERROR");
          expect(frames[0].code).toBe("foo");
          expect(frames[0].error).not.toBeNull();
          expect(frames[0].error!.category).toBe("RuntimeError");
          expect(frames[0].error!.type).toBe("FunctionNotFoundInScope");
          expect(frames[0].error!.message).toBe("CouldNotFindFunction: name: foo");
          expect(error).toBeNull();
        });

        test("misspelled", () => {
          const { frames, error } = interpret(`
            function foobar do
              return 1
            end

            foobor()
          `);
          expect(frames).toBeArrayOfSize(1);
          expect(frames[0].line).toBe(6);
          expect(frames[0].status).toBe("ERROR");
          expect(frames[0].code).toBe("foobor");
          expect(frames[0].error).not.toBeNull();
          expect(frames[0].error!.message).toBe("CouldNotFindFunctionWithSuggestion: name: foobor, suggestion: foobar");
          expect(frames[0].error!.category).toBe("RuntimeError");
          expect(frames[0].error!.type).toBe("FunctionNotFoundWithSimilarNameSuggestion");
          expect(error).toBeNull();
        });
      });

      test("missing parentheses within set", () => {
        const context = {
          externalFunctions: [{ name: "y", func: (_: any) => {}, description: "" }],
        };
        const { error, frames } = interpret(`set x to y`, context);
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].line).toBe(1);
        expect(frames[0].status).toBe("ERROR");
        expect(frames[0].code).toBe("y");
        expect(frames[0].error).not.toBeNull();
        expect(frames[0].error!.category).toBe("RuntimeError");
        expect(frames[0].error!.type).toBe("UnexpectedUncalledFunctionInExpression");
        expect(frames[0].error!.message).toBe("UnexpectedUncalledFunction: name: y");

        expect(error).toBeNull();
      });

      test("after success", () => {
        const { frames, error } = interpret(`
          log 123
          foo()
        `);
        expect(frames).toBeArrayOfSize(2);
        expect(frames[0].line).toBe(2);
        expect(frames[0].status).toBe("SUCCESS");
        expect(frames[0].code).toBe("log 123");
        expect(frames[0].error).toBeNil();
        expect(frames[1].line).toBe(3);
        expect(frames[1].status).toBe("ERROR");
        expect(frames[1].code).toBe("foo");
        expect(frames[1].error).not.toBeNull();
        expect(frames[1].error!.category).toBe("RuntimeError");
        expect(frames[1].error!.type).toBe("FunctionNotFoundInScope");
        expect(frames[1].error!.message).toBe("CouldNotFindFunction: name: foo");
        expect(error).toBeNull();
      });

      test("stop execution after error", () => {
        const { frames, error } = interpret(`
          foo()
          set x to 123
        `);
        expect(frames).toBeArrayOfSize(1);
        expect(frames[0].line).toBe(2);
        expect(frames[0].status).toBe("ERROR");
        expect(frames[0].code).toBe("foo");
        expect(frames[0].error).not.toBeNull();
        expect(frames[0].error!.category).toBe("RuntimeError");
        expect(frames[0].error!.type).toBe("FunctionNotFoundInScope");
        expect(frames[0].error!.message).toBe("CouldNotFindFunction: name: foo");
        expect(error).toBeNull();
      });
    });
  });

  describe("suggestions", () => {
    test("function name differs by one letter", () => {
      const code = `
        function move do
        end
        m0ve()
      `;
      const { frames, error } = interpret(code, {});
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].error).not.toBeNull();
      expect(frames[0].error!.context).toMatchObject({
        didYouMean: {
          function: "move",
          variable: null,
        },
      });
    });

    // Recursion isn't supported in JikiScript (yet?)
    test.skip("recursive function name differs by one letter", () => {
      const code = `
        function move do
          m0ve()
        end
      `;
      const { frames, error } = evaluateFunction(code, {}, "move");
      expect(frames).toBeArrayOfSize(1);
      expect(frames[0].error).not.toBeNull();
      expect(frames[0].error!.context).toMatchObject({
        didYouMean: {
          function: "move",
          variable: null,
        },
      });
    });

    test("variable name differs by one letter", () => {
      const code = `set size to 23
                    set x to saize + 5`;
      const { frames } = interpret(code, {});

      expect(frames).toBeArrayOfSize(2);
      expect(frames[1].error).not.toBeNull();
      expect(frames[1].error!.context).toMatchObject({
        didYouMean: {
          function: null,
          variable: "size",
        },
      });
    });
  });
});

describe("context", () => {
  describe("wrap top-level statements", () => {
    // TODO: This test doesn't make a huge amount of sense to me.
    test.skip("wrap non-function statements", () => {
      const code = `
        function move with x, y do
          return x + y
        end

        set x to 1
        set y to 2
        move(x, y)
      `;
      const { frames } = evaluateFunction(code, { wrapTopLevelStatements: true }, "main");
      expect(frames).toBeArrayOfSize(4);
      expect(unwrapJikiObject(frames[3].result?.jikiObject)).toBe(3);
    });

    test("don't wrap function declarations", () => {
      const { value, frames } = evaluateFunction(
        `
        function move do
          return 1
        end
      `,
        {},
        "move"
      );
      expect(value).toBe(1);
      expect(frames).toBeArrayOfSize(1);
      expect(unwrapJikiObject(frames[0].result?.jikiObject)).toBe(1);
    });
  });
});

describe("custom functions", () => {
  test("no args", () => {
    const fnCode = `
      function my#foobar do
        return "Yes"
      end
    `;
    const customFunction = {
      name: "my#foobar",
      arity: 0,
      description: "",
      code: fnCode,
    };
    const context: EvaluationContext = {
      customFunctions: [customFunction],
    };
    const { value, frames, error } = evaluateFunction(
      `function move do
        return my#foobar()
      end`,
      context,
      "move"
    );
    expect(value).toBe("Yes");
    expect(frames).toBeArrayOfSize(1);
    expect(unwrapJikiObject(frames[0].result?.jikiObject)).toBe("Yes");
  });

  test("args123", () => {
    const fnCode = `
      function my#foobar with param do
        return param
      end
    `;
    const customFunction = {
      name: "my#foobar",
      arity: 1,
      description: "",
      code: fnCode,
    };
    const context: EvaluationContext = {
      customFunctions: [customFunction],
    };
    const { value, frames, error } = evaluateFunction(
      `function move do
        return my#foobar("Food")
      end`,
      context,
      "move"
    );
    expect(value).toBe("Food");
    expect(frames).toBeArrayOfSize(1);
    expect(unwrapJikiObject(frames[0].result?.jikiObject)).toBe("Food");
  });

  test("functions that rely on functions", () => {
    const indexOfCode = `
      function my#index_of with list do
        return 1
      end`;
    const indexOfFunction = {
      name: "my#index_of",
      arity: 1,
      description: "",
      code: indexOfCode,
    };

    const startsWithCode = `
      function my#starts_with with list, thing do
        return my#index_of(list) == 1
      end`;
    const startsWithFunction = {
      name: "my#starts_with",
      arity: 2,
      description: "",
      code: startsWithCode,
    };

    const context: EvaluationContext = {
      customFunctions: [indexOfFunction, startsWithFunction],
    };
    const { value, frames, error } = evaluateFunction(
      `function do_something do
        return my#starts_with("food", "f")
      end`,
      context,
      "do_something"
    );
    expect(value).toBe(true);
    expect(frames).toBeArrayOfSize(1);
    expect(unwrapJikiObject(frames[0].result?.jikiObject)).toBe(true);
  });
});

describe("stdlib function filtering", () => {
  test("allowed stdlib function is available", () => {
    const { value, frames } = evaluateFunction(
      'function test do\n  return concatenate("a", "b")\nend',
      {
        externalFunctions: [],
        languageFeatures: { allowedStdlibFunctions: ["concatenate"] },
      },
      "test"
    );
    expect(value).toBe("ab");
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("SUCCESS");
  });

  test("non-allowed stdlib function is not available", () => {
    const { frames } = evaluateFunction(
      'function test do\n  return concatenate("a", "b")\nend',
      {
        externalFunctions: [],
        languageFeatures: { allowedStdlibFunctions: ["to_upper_case"] }, // concatenate not in list
      },
      "test"
    );
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error!.type).toBe("FunctionNotFoundInScope");
  });

  test("multiple stdlib functions can be allowed", () => {
    const { value, frames } = evaluateFunction(
      'function test do\n  return to_upper_case(concatenate("hello", " world"))\nend',
      {
        externalFunctions: [],
        languageFeatures: { allowedStdlibFunctions: ["concatenate", "to_upper_case"] },
      },
      "test"
    );
    expect(value).toBe("HELLO WORLD");
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("SUCCESS");
  });

  test("exercise-specific functions work alongside stdlib", () => {
    const customFunc = (_: ExecutionContext, x: Number) => new Number(x.value);
    const { value, frames } = evaluateFunction(
      "function test do\n  return number_to_string(custom(1))\nend",
      {
        externalFunctions: [
          {
            name: "custom",
            func: customFunc,
            description: "custom function",
          },
        ],
        languageFeatures: { allowedStdlibFunctions: ["number_to_string"] },
      },
      "test"
    );
    expect(value).toBe("1");
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("SUCCESS");
  });

  test("empty allowedStdlibFunctions list means no stdlib functions", () => {
    const { frames } = evaluateFunction(
      'function test do\n  return concatenate("a", "b")\nend',
      {
        externalFunctions: [],
        languageFeatures: { allowedStdlibFunctions: [] },
      },
      "test"
    );
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error!.type).toBe("FunctionNotFoundInScope");
  });

  test("no allowedStdlibFunctions means no auto-merge", () => {
    const { frames } = evaluateFunction(
      'function test do\n  return concatenate("a", "b")\nend',
      {
        externalFunctions: [],
        // No languageFeatures.allowedStdlibFunctions specified
      },
      "test"
    );
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("ERROR");
    expect(frames[0].error!.type).toBe("FunctionNotFoundInScope");
  });

  test("stdlib functions work in interpret() as well", () => {
    const { frames } = interpret('set result to concatenate("hello", " ", "world")', {
      languageFeatures: { allowedStdlibFunctions: ["concatenate"] },
    });
    expect(frames).toBeArrayOfSize(1);
    expect(frames[0].status).toBe("SUCCESS");
    expect(unwrapJikiObject((frames[0] as TestAugmentedFrame).variables)).toMatchObject({
      result: "hello world",
    });
  });
});
