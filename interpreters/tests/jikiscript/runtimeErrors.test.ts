import { RuntimeErrorType } from "@jikiscript/error";
import { Frame } from "@shared/frames";
import { EvaluationContext, interpret } from "@jikiscript/interpreter";
import { Location, Span } from "@jikiscript/location";
import * as Jiki from "@jikiscript/jikiObjects";

const location = new Location(0, new Span(0, 0), new Span(0, 0));
const getNameFunction = {
  name: "get_name",
  func: (_interpreter: any) => {
    return new Jiki.String("Jeremy");
  },
  description: "",
};

function expectFrameToBeError(frame: Frame, code: string, type: RuntimeErrorType) {
  expect(frame.code.trim()).toBe(code.trim());
  expect(frame.status).toBe("ERROR");
  expect(frame.error).not.toBeNull();
  expect(frame.error!.category).toBe("RuntimeError");
  expect(frame.error!.type).toBe(type);
}

describe("UnexpectedUncalledFunctionInExpression", () => {
  test("in a equation with a +", () => {
    const code = "log get_name + 1";
    const context = { externalFunctions: [getNameFunction] };
    const { frames } = interpret(code, context);
    expectFrameToBeError(frames[0], "get_name", "UnexpectedUncalledFunctionInExpression");
    expect(frames[0].error!.message).toBe("UnexpectedUncalledFunction: name: get_name");
  });
  test("in a equation with a -", () => {
    const code = "log get_name - 1";
    const context = { externalFunctions: [getNameFunction] };
    const { frames } = interpret(code, context);
    expectFrameToBeError(frames[0], "get_name", "UnexpectedUncalledFunctionInExpression");
    expect(frames[0].error!.message).toBe("UnexpectedUncalledFunction: name: get_name");
  });
  test("in other function", () => {
    const code = `
        function move with x do
          return 1
        end

        log move(move)
      `;
    const { error, frames } = interpret(code);
    expectFrameToBeError(frames[0], `move`, "UnexpectedUncalledFunctionInExpression");
    expect(frames[0].error!.message).toBe("UnexpectedUncalledFunction: name: move");
  });

  test("with left parenthesis", () => {
    const code = `
        function move do
          return 1
        end

        log move
      `;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], `move`, "UnexpectedUncalledFunctionInExpression");
    expect(frames[0].error!.message).toBe("UnexpectedUncalledFunction: name: move");
  });
});
describe("DuplicateFunctionDeclarationInScope", () => {
  test("variable name", () => {
    const code = "set get_name to 5";
    const context = { externalFunctions: [getNameFunction] };
    const { frames } = interpret(code, context);
    expectFrameToBeError(frames[0], "get_name", "DuplicateFunctionDeclarationInScope");
    expect(frames[0].error!.message).toBe("FunctionAlreadyDeclared: name: get_name");
  });
  test("external function", () => {
    const code = `function get_name do
    end`;
    const context = { externalFunctions: [getNameFunction] };
    const { frames } = interpret(code, context);
    expectFrameToBeError(frames[0], "get_name", "DuplicateFunctionDeclarationInScope");
    expect(frames[0].error!.message).toBe("FunctionAlreadyDeclared: name: get_name");
  });
  test("internal function", () => {
    const code = `
    function foobar do
    end
    function foobar do
    end`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "foobar", "DuplicateFunctionDeclarationInScope");
    expect(frames[0].error!.message).toBe("FunctionAlreadyDeclared: name: foobar");
  });
});
describe("UnexpectedChangeOfFunctionReference", () => {
  test("basic", () => {
    const code = "change get_name to 5";
    const context = { externalFunctions: [getNameFunction] };
    const { frames } = interpret(code, context);
    expectFrameToBeError(frames[0], "get_name", "UnexpectedChangeOfFunctionReference");
    expect(frames[0].error!.message).toBe("UnexpectedChangeOfFunction: name: get_name");
  });
});
describe("UnexpectedReturnStatementOutsideOfFunction", () => {
  test("with result", () => {
    const code = "return 1";
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], code, "UnexpectedReturnStatementOutsideOfFunction");
    expect(frames[0].error!.message).toBe("UnexpectedReturnStatementOutsideOfFunction");
  });
  test("without result", () => {
    const code = "return";
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], code, "UnexpectedReturnStatementOutsideOfFunction");
    expect(frames[0].error!.message).toBe("UnexpectedReturnStatementOutsideOfFunction");
  });
});
describe("UnexpectedContinueStatementOutsideOfLoop", () => {
  test("top level", () => {
    const code = "continue";
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], code, "UnexpectedContinueStatementOutsideOfLoop");
    expect(frames[0].error!.message).toBe("UnexpectedContinueOutsideOfLoop: lexeme: continue");
  });
  test("in statement", () => {
    const code = `
    if true do
      continue
    end`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[1], "continue", "UnexpectedContinueStatementOutsideOfLoop");
    expect(frames[1].error!.message).toBe("UnexpectedContinueOutsideOfLoop: lexeme: continue");
  });
  test("next keyword", () => {
    const code = `next`;
    const { error, frames } = interpret(code);
    expectFrameToBeError(frames[0], "next", "UnexpectedContinueStatementOutsideOfLoop");
    expect(frames[0].error!.message).toBe("UnexpectedContinueOutsideOfLoop: lexeme: next");
  });
});
describe("UnexpectedBreakStatementOutsideOfLoop", () => {
  test("top level", () => {
    const code = "break";
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], code, "UnexpectedBreakStatementOutsideOfLoop");
    expect(frames[0].error!.message).toBe("UnexpectedBreakStatementOutsideOfLoop");
  });
  test("in statement", () => {
    const code = `
    if true do
      break
    end`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[1], "break", "UnexpectedBreakStatementOutsideOfLoop");
    expect(frames[1].error!.message).toBe("UnexpectedBreakStatementOutsideOfLoop");
  });
});
describe("VariableAlreadyDeclaredInScope", () => {
  test("basic", () => {
    const code = `set x to 5
                  set x to 6`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[1], "x", "VariableAlreadyDeclaredInScope");
    expect(frames[1].error!.message).toBe("VariableAlreadyDeclared: name: x");
  });
  test("foreach", () => {
    const code = `set x to 5
                  for each x in "" do
                  end`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[1], "x", "VariableAlreadyDeclaredInScope");
    expect(frames[1].error!.message).toBe("VariableAlreadyDeclared: name: x");
  });
});

describe("VariableNotDeclared", () => {
  test("basic", () => {
    const code = "change x to 6";
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "x", "VariableNotDeclared");
    expect(frames[0].error!.message).toBe("VariableNotDeclared: name: x");
  });
});

describe("VariableNotAccessibleInFunctionScope", () => {
  test("basic", () => {
    const code = `set x to 6
                  function foo do
                    change x to 7
                  end
                  foo()`;
    const { frames, error } = interpret(code);
    expectFrameToBeError(frames[1], "x", "VariableNotAccessibleInFunctionScope");
    expect(frames[1].error!.message).toBe("VariableNotAccessibleInFunction: name: x");
  });
});

describe("StateErrorMaxIterationsReachedInLoop", () => {
  describe("nested loop", () => {
    test("default value", () => {
      const code = `repeat 110 times do
                      repeat 110 times do
                      end
                    end`;

      const { frames } = interpret(code);
      const frame = frames[frames.length - 1];
      expectFrameToBeError(frame, "repeat", "StateErrorMaxIterationsReachedInLoop");
      expect(frame.error!.message).toBe(`MaxIterationsReached: max: 10000`);
    });
    test("custom value", () => {
      const code = `repeat 5 times do
                      repeat 11 times do
                      end
                    end`;

      const maxIterations = 50;
      const { frames } = interpret(code, {
        languageFeatures: { maxTotalLoopIterations: maxIterations },
      });
      const frame = frames[frames.length - 1];
      expectFrameToBeError(frame, "repeat", "StateErrorMaxIterationsReachedInLoop");
      expect(frame.error!.message).toBe(`MaxIterationsReached: max: ${maxIterations}`);
    });
  });
  describe("repeat_until_game_over", () => {
    test("default value", () => {
      const code = `repeat_until_game_over do
                    end`;

      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "repeat_until_game_over", "StateErrorMaxIterationsReachedInLoop");
      expect(frames[0].error!.message).toBe(`MaxIterationsReached: max: 100`);
    });
    test("custom maxTotalLoopIterations", () => {
      const code = `repeat_until_game_over do
                    end`;

      const maxIterations = 50;
      const { frames } = interpret(code, {
        languageFeatures: { maxTotalLoopIterations: maxIterations },
      });
      expectFrameToBeError(frames[0], "repeat_until_game_over", "StateErrorMaxIterationsReachedInLoop");
      expect(frames[0].error!.message).toBe(`MaxIterationsReached: max: ${maxIterations}`);
    });
  });
  test("custom maxRepeatUntilGameOverIterations", () => {
    const code = `repeat_until_game_over do
                  end`;

    const maxIterations = 50;
    const { frames } = interpret(code, {
      languageFeatures: { maxRepeatUntilGameOverIterations: maxIterations },
    });
    expectFrameToBeError(frames[0], "repeat_until_game_over", "StateErrorMaxIterationsReachedInLoop");
    expect(frames[0].error!.message).toBe(`MaxIterationsReached: max: ${maxIterations}`);
  });
});
test("StateErrorInfiniteRecursionDetectedInFunction", () => {
  const code = `function foo do
                  foo()
                end
                foo()`;

  const { frames } = interpret(code);
  expectFrameToBeError(frames[0], "foo()", "StateErrorInfiniteRecursionDetectedInFunction");
  expect(frames[0].error!.message).toBe("StateErrorInfiniteRecursionDetectedInFunction");
});

describe("RangeErrorRepeatCountTooHighForExecution", () => {
  test("default", () => {
    const max = 10000;
    const { frames } = interpret(`
      repeat ${max + 1} times do
      end
    `);

    expectFrameToBeError(frames[0], `${max + 1}`, "RangeErrorRepeatCountTooHighForExecution");
    expect(frames[0].error!.message).toBe(`RepeatCountTooHigh: count: 10001, max: ${max}`);
  });
});

describe("StateErrorCannotStoreNullValueFromFunction", () => {
  test("setting", () => {
    const max = 100;
    const { frames } = interpret(`
      function bar do
      end
      set foo to bar()
    `);

    expectFrameToBeError(frames[0], `bar()`, "StateErrorCannotStoreNullValueFromFunction");
    expect(frames[0].error!.message).toBe(`StateErrorCannotStoreNullValueFromFunction`);
  });
  test("changing", () => {
    const max = 100;
    const { frames } = interpret(`
      function bar do
      end
      set foo to true
      change foo to bar()
    `);

    expectFrameToBeError(frames[1], `bar()`, "StateErrorCannotStoreNullValueFromFunction");
    expect(frames[1].error!.message).toBe(`StateErrorCannotStoreNullValueFromFunction`);
  });
});

describe("ExpressionEvaluatedToNullValue", () => {
  test("BinaryExpression: lhs", () => {
    const max = 100;
    const { frames } = interpret(`
      function something with meh do\nend
      function bar do\n end
      something(bar() + 1)
    `);

    expectFrameToBeError(frames[0], `bar()`, "ExpressionEvaluatedToNullValue");
    expect(frames[0].error!.message).toBe(`ExpressionEvaluatedToNullValue`);
  });

  test("BinaryExpression: rhs", () => {
    const max = 100;
    const { frames } = interpret(`
      function something with meh do\nend
      function bar do\n end
      something(1 + bar())
    `);

    expectFrameToBeError(frames[0], `bar()`, "ExpressionEvaluatedToNullValue");
    expect(frames[0].error!.message).toBe(`ExpressionEvaluatedToNullValue`);
  });
});

describe("TypeErrorOperandMustBeNumericValue", () => {
  test('1 - "a"', () => {
    const code = 'log 1 - "a"';
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], '"a"', "TypeErrorOperandMustBeNumericValue");
    expect(frames[0].error!.message).toBe('OperandMustBeNumber: value: "a"');
  });
  test("1 / true", () => {
    const code = "log 1 / true";
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "true", "TypeErrorOperandMustBeNumericValue");
    expect(frames[0].error!.message).toBe("OperandMustBeNumber: value: true");
  });
  test("false - 1", () => {
    const code = "log false - 1";
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "false", "TypeErrorOperandMustBeNumericValue");
    expect(frames[0].error!.message).toBe("OperandMustBeNumber: value: false");
  });
  test("1 * false", () => {
    const code = "log 1 * false";
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "false", "TypeErrorOperandMustBeNumericValue");
    expect(frames[0].error!.message).toBe("OperandMustBeNumber: value: false");
  });
  test("1 * getName()", () => {
    const code = "log 1 * get_name()";
    const context = { externalFunctions: [getNameFunction] };
    const { frames } = interpret(code, context);
    expectFrameToBeError(frames[0], "get_name()", "TypeErrorOperandMustBeNumericValue");
    expect(frames[0].error!.message).toBe('OperandMustBeNumber: value: "Jeremy"');
  });
});

describe("TypeErrorOperandMustBeBooleanValue", () => {
  test("not number", () => {
    const { frames } = interpret(`log not 1`);

    expectFrameToBeError(frames[0], `1`, "TypeErrorOperandMustBeBooleanValue");
    expect(frames[0].error!.message).toBe(`OperandMustBeBoolean: value: 1`);
  });
  test("bang string", () => {
    const { frames } = interpret(`log !"foo"`);

    expectFrameToBeError(frames[0], `"foo"`, "TypeErrorOperandMustBeBooleanValue");
    expect(frames[0].error!.message).toBe(`OperandMustBeBoolean: value: "foo"`);
  });

  test("strings in conditionals", () => {
    const code = `if "foo" do
                  end`;
    const { error, frames } = interpret(code);

    expectFrameToBeError(frames[0], `"foo"`, "TypeErrorOperandMustBeBooleanValue");
    expect(frames[0].error!.message).toBe(`OperandMustBeBoolean: value: "foo"`);
  });

  test("function call in conditionals", () => {
    const code = `function ret_str do
                    return "foo"
                  end
                  if ret_str() do 
                  end`;
    const { error, frames } = interpret(code);

    expectFrameToBeError(frames[1], "ret_str()", "TypeErrorOperandMustBeBooleanValue");
    expect(frames[1].error!.message).toBe(`OperandMustBeBoolean: value: "foo"`);
  });
});

describe("ForeachLoopTargetNotIterable", () => {
  test("number", () => {
    const code = `for each num in 1 do
    end`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "1", "ForeachLoopTargetNotIterable");
    expect(frames[0].error!.message).toBe("ForeachNotIterable: value: 1");
  });
  test("boolean", () => {
    const code = `for each num in true do
    end`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "true", "ForeachLoopTargetNotIterable");
    expect(frames[0].error!.message).toBe("ForeachNotIterable: value: true");
  });
  test("function that returns number", () => {
    const code = `
      function ret_5 do
        return 5
      end
      for each num in ret_5() do
      end`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[1], "ret_5()", "ForeachLoopTargetNotIterable");
    expect(frames[1].error!.message).toBe("ForeachNotIterable: value: 5");
  });
});

describe("IndexOutOfRangeForArrayAccess", () => {
  describe("string", () => {
    test("inline on empty", () => {
      const code = 'log ""[1]';
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "1", "IndexOutOfRangeForArrayAccess");
      expect(frames[0].error!.message).toBe("IndexOutOfBoundsInGet: index: 1, length: 0, dataType: string");
    });
    test("too high", () => {
      const code = 'log "foo"[4]';
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "4", "IndexOutOfRangeForArrayAccess");
      expect(frames[0].error!.message).toBe("IndexOutOfBoundsInGet: index: 4, length: 3, dataType: string");
    });
  });
  describe("list", () => {
    test("inline on empty", () => {
      const code = "log [][1]";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "1", "IndexOutOfRangeForArrayAccess");
      expect(frames[0].error!.message).toBe("IndexOutOfBoundsInGet: index: 1, length: 0, dataType: list");
    });
    test("too high", () => {
      const code = "log [1,2,3][4]";
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "4", "IndexOutOfRangeForArrayAccess");
      expect(frames[0].error!.message).toBe("IndexOutOfBoundsInGet: index: 4, length: 3, dataType: list");
    });
  });
});

describe("RangeErrorArrayIndexIsZeroBased", () => {
  describe("string", () => {
    test("get", () => {
      const code = 'log "foo"[0]';
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "0", "RangeErrorArrayIndexIsZeroBased");
      expect(frames[0].error!.message).toBe("RangeErrorArrayIndexIsZeroBased");
    });
  });
  describe("list", () => {
    test("get", () => {
      const code = 'log ["foo"][0]';
      const { frames } = interpret(code);
      expectFrameToBeError(frames[0], "0", "RangeErrorArrayIndexIsZeroBased");
      expect(frames[0].error!.message).toBe("RangeErrorArrayIndexIsZeroBased");
    });
  });
});

describe("IndexOutOfRangeForArrayModification", () => {
  describe("list", () => {
    test("inline on empty", () => {
      const code = `
      set list to []
      change list[1] to 5
      `;
      const { frames } = interpret(code);
      expectFrameToBeError(frames[1], "1", "IndexOutOfRangeForArrayModification");
      expect(frames[1].error!.message).toBe("IndexOutOfBoundsInChange: index: 1, length: 0, dataType: list");
    });
    test("too high", () => {
      const code = `
      set list to [1,2,3]
      change list[4] to 5
      `;
      const { frames } = interpret(code);
      expectFrameToBeError(frames[1], "4", "IndexOutOfRangeForArrayModification");
      expect(frames[1].error!.message).toBe("IndexOutOfBoundsInChange: index: 4, length: 3, dataType: list");
    });
  });
});

describe("InvalidChangeTargetNotModifiable", () => {
  test("string", () => {
    const code = `
      set str to "foo"
      change str[1] to "a"
      `;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[1], `str`, "InvalidChangeTargetNotModifiable");
    expect(frames[1].error!.message).toBe("InvalidChangeTargetNotModifiable");
  });
});

test("TypeErrorCannotCompareListObjects", () => {
  const code = `log [] == []`;
  const { frames } = interpret(code);
  expectFrameToBeError(frames[0], `[] == []`, "TypeErrorCannotCompareListObjects");
  expect(frames[0].error!.message).toBe("TypeErrorCannotCompareListObjects");
});

test("VariableCannotBeNamespacedReference", () => {
  const code = `set foo#bar to 5`;
  const { frames } = interpret(code);
  expectFrameToBeError(frames[0], "foo#bar", "VariableCannotBeNamespacedReference");
  expect(frames[0].error!.message).toBe("VariableCannotBeNamespaced: name: foo#bar");
});

describe("FunctionCannotBeNamespacedReference", () => {
  test("normal mode", () => {
    const code = `
      function foo#bar do
      end`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "foo#bar", "FunctionCannotBeNamespacedReference");
    expect(frames[0].error!.message).toBe("FunctionCannotBeNamespaced: name: foo#bar");
  });
  // Just sanity check that this passes if we're in custom function definition mode
  test("custom function definition mode", () => {
    const code = `
      function foo#bar do
        return true
      end
      foo#bar()`;
    const { frames } = interpret(code, {
      languageFeatures: { customFunctionDefinitionMode: true },
    });
    expect(frames[frames.length - 1].status).toBe("SUCCESS");
  });
});

test("TypeErrorCannotCompareObjectInstances", () => {
  const context = { classes: [new Jiki.Class("Thing")] };
  const code = `
  set thing to new Thing()
  log thing == 5
  `;
  const { frames } = interpret(code, context);
  expectFrameToBeError(frames[1], `thing == 5`, "TypeErrorCannotCompareObjectInstances");
  expect(frames[1].error!.message).toBe("TypeErrorCannotCompareObjectInstances");
});

test("MissingDictionaryKeyInAccess", () => {
  const code = `log {}["a"]`;
  const { frames } = interpret(code);
  expectFrameToBeError(frames[0], '{}["a"]', "MissingDictionaryKeyInAccess");
  expect(frames[0].error!.message).toBe('MissingKeyInDictionary: key: "a"');
});

describe("TypeErrorOperandMustBeStringValue", () => {
  test("dictionary get", () => {
    const code = `log {}[1]`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], "1", "TypeErrorOperandMustBeStringValue");
    expect(frames[0].error!.message).toBe("OperandMustBeString: value: 1");
  });

  test("dictionary change", () => {
    const code = `
      set foo to {}
      change foo[1] to 1
    `;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[1], "1", "TypeErrorOperandMustBeStringValue");
    expect(frames[1].error!.message).toBe("OperandMustBeString: value: 1");
  });
});

describe("TypeErrorOperandMustBeNumericValue", () => {
  test("list get", () => {
    const code = `log [1]["a"]`;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[0], '"a"', "TypeErrorOperandMustBeNumericValue");
    expect(frames[0].error!.message).toBe('OperandMustBeNumber: value: "a"');
  });
  test("list change", () => {
    const code = `
      set foo to ["b"]
      change foo["a"] to 1
    `;
    const { frames } = interpret(code);
    expectFrameToBeError(frames[1], '"a"', "TypeErrorOperandMustBeNumericValue");
    expect(frames[1].error!.message).toBe('OperandMustBeNumber: value: "a"');
  });
});

describe("NonJikiObjectDetectedInExecution", () => {
  test("with args", () => {
    const Person = new Jiki.Class("Person");
    // @ts-ignore
    Person.addMethod("num", "", "public", function (_ex, _in) {
      return 5;
    });

    const context: EvaluationContext = { classes: [Person] };
    const { frames, error } = interpret(`log (new Person()).num()`, context);

    expect(frames[0].error!.message).toBe("NonJikiObjectDetectedInExecution");
  });
});

test("GetterMethodNotFoundOnObject", () => {
  const Person = new Jiki.Class("Person");

  const context: EvaluationContext = { classes: [Person] };
  const { frames, error } = interpret(
    `set person to new Person()
      log person.foo`,
    context
  );

  expect(frames[1].error!.message).toBe("CouldNotFindGetter: name: foo");
});

test("SetterMethodNotFoundOnObject", () => {
  const Person = new Jiki.Class("Person");

  const context: EvaluationContext = { classes: [Person] };
  const { frames, error } = interpret(
    `set person to new Person()
      change person.foo to 5`,
    context
  );

  expect(frames[1].error!.message).toBe("CouldNotFindSetter: name: foo");
});

test("SetterMethodNotFoundOnObject", () => {
  const Person = new Jiki.Class("Person");

  const context: EvaluationContext = { classes: [Person] };
  const { frames, error } = interpret(
    `set person to new Person()
      change person.foo to 5`,
    context
  );

  expect(frames[1].error!.message).toBe("CouldNotFindSetter: name: foo");
});

describe("RangeErrorWrongNumberOfArgumentsInConstructorCall", () => {
  test("Some when none expect", () => {
    const Person = new Jiki.Class("Person");

    const context: EvaluationContext = { classes: [Person] };
    const { frames, error } = interpret(`set person to new Person("foo")`, context);

    expect(frames[0].error!.message).toBe("WrongNumberOfArgumentsInConstructor: arity: 0, numberOfArgs: 1");
  });
  test("None when Some expect", () => {
    const Person = new Jiki.Class("Person");
    Person.addConstructor((ex, object, something) => {});

    const context: EvaluationContext = { classes: [Person] };
    const { frames, error } = interpret(`set person to new Person()`, context);

    expect(frames[0].error!.message).toBe("WrongNumberOfArgumentsInConstructor: arity: 1, numberOfArgs: 0");
  });
  test("More than expected", () => {
    const Person = new Jiki.Class("Person");
    Person.addConstructor((ex, object, something) => {});

    const context: EvaluationContext = { classes: [Person] };
    const { frames, error } = interpret(`set person to new Person(1,2,3)`, context);

    expect(frames[0].error!.message).toBe("WrongNumberOfArgumentsInConstructor: arity: 1, numberOfArgs: 3");
  });
  test("Inline class", () => {
    const { frames, error } = interpret(`
      class Foobar do
        constructor with something do
        end
      end
      log new Foobar("too", "many")`);

    expect(frames.at(-1)?.error!.message).toBe("WrongNumberOfArgumentsInConstructor: arity: 1, numberOfArgs: 2");
  });
});

test("ClassNotFoundInScope", () => {
  const { frames, error } = interpret(`set person to new Person(1,2,3)`);
  expect(frames[0].error!.message).toBe("ClassNotFoundInScope");
});

test("MethodNotFoundOnObjectInstance", () => {
  const Person = new Jiki.Class("Person");

  const context: EvaluationContext = { classes: [Person] };
  const { frames, error } = interpret(
    `set person to new Person()
    person.foobar()`,
    context
  );

  expect(frames[1].error!.message).toBe("MethodNotFoundOnObjectInstance");
});

describe("AccessorUsedOnNonInstanceObject", () => {
  test("List", () => {
    const { frames } = interpret(`log [].foo`);
    expect(frames[0].error!.message).toBe("AccessorUsedOnNonInstanceObject");
  });
  test("Dict", () => {
    const { frames } = interpret(`log {}.foo`);
    expect(frames[0].error!.message).toBe("AccessorUsedOnNonInstanceObject");
  });
  test("String", () => {
    const { frames } = interpret(`log "".foo`);
    expect(frames[0].error!.message).toBe("AccessorUsedOnNonInstanceObject");
  });
});

describe("UnexpectedForeachSecondElementNameInLoop", () => {
  test("List", () => {
    const { frames } = interpret(`
      for each foo, bar in [] do
      end`);
    expect(frames[0].error!.message).toBe("UnexpectedForeachSecondElementName: type: list");
  });
  test("String", () => {
    const { frames } = interpret(`
      for each foo, bar in "" do
      end`);
    expect(frames[0].error!.message).toBe("UnexpectedForeachSecondElementName: type: string");
  });
});

test("MissingForeachSecondElementNameInDeclaration", () => {
  const { frames } = interpret(`
    for each foo in {} do
    end`);
  expect(frames[0].error!.message).toBe("MissingForeachSecondElementNameInDeclaration");
});

// TOOD: Strings are immutable

// UnexpectedObjectArgumentForCustomFunction

test("UnexpectedObjectArgumentForCustomFunctionCall", () => {
  const customFunction = {
    name: "my#foobar",
    arity: 1,
    description: "",
    code: "",
  };
  const Person = new Jiki.Class("Person");
  const context: EvaluationContext = {
    customFunctions: [customFunction],
    classes: [Person],
  };

  const { frames, error } = interpret(
    `
    set person to new Person()
    my#foobar(person)
  `,
    context
  );

  expect(frames[1].error!.message).toBe("UnexpectedObjectArgumentForCustomFunctionCall");
});

describe("ConstructorDidNotSetRequiredProperty", () => {
  test("no constructor", () => {
    const { frames, error } = interpret(`
      class Foobar do
        public property foo
      end
      log new Foobar()
    `);

    expect(frames[0].error!.message).toBe("ConstructorDidNotSetProperty: property: foo");
  });
  test("lazy constructor", () => {
    const { frames, error } = interpret(`
      class Foobar do
        public property foo
        constructor do
        end
      end
      log new Foobar()
    `);

    expect(frames[0].error!.message).toBe("ConstructorDidNotSetProperty: property: foo");
  });
  test("only one property", () => {
    const { frames, error } = interpret(`
      class Foobar do
        public property foo
        public property bar
        public property baz

        constructor do
          set this.foo to 5
        end
      end
      log new Foobar()
    `);

    expect(frames.at(-1)?.error!.message).toBe("ConstructorDidNotSetProperty: property: bar");
  });
});

test("ClassAlreadyDefinedInScope", () => {
  const { frames, error } = interpret(`
    class Foobar do
    end
    class Foobar do
    end
  `);

  expect(frames.at(-1)?.error!.message).toBe("ClassAlreadyDefined: name: Foobar");
});

test("UnexpectedChangeOfMethodReference", () => {
  const { frames, error } = interpret(`
    class Foobar do
      public method foo do
      end

      constructor do
        set this.foo to 5
      end
    end
    log new Foobar()
  `);

  expect(frames.at(-1)?.error!.message).toBe("UnexpectedChangeOfMethod: name: foo");
});
test("PropertySetterUsedOnNonPropertyTarget", () => {
  const { frames, error } = interpret(`
    class Foobar do
      constructor do
        set this.foo to 5
      end
    end
    log new Foobar()
  `);

  expect(frames.at(-1)?.error!.message).toBe("PropertySetterUsedOnNonProperty: name: foo");
});
test("MethodUsedAsGetterInsteadOfCall", () => {
  const { frames, error } = interpret(`
    class Foobar do
      public method foo do
      end
    end
    log (new Foobar()).foo
  `);

  expect(frames.at(-1)?.error!.message).toBe("MethodUsedAsGetter: name: foo");
});

describe("ClassCannotBeUsedAsVariableReference", () => {
  test("as object", () => {
    const { frames, error } = interpret(`
      class Foobar do
      end
      Foobar.say()
    `);

    expect(frames.at(-1)?.error!.message).toBe("ClassCannotBeUsedAsVariable: name: Foobar");
  });
  test("as arg", () => {
    const { frames, error } = interpret(`
      function say do
      end
      class Foobar do
      end
      say(Foobar)
    `);

    expect(frames.at(-1)?.error!.message).toBe("ClassCannotBeUsedAsVariable: name: Foobar");
  });
});

describe("ThisKeywordUsedOutsideOfMethodContext", () => {
  test("top level", () => {
    const { frames, error } = interpret(`
      log this
    `);

    expect(frames.at(-1)?.error!.message).toBe("ThisKeywordUsedOutsideOfMethodContext");
  });
  test("function", () => {
    const { frames, error } = interpret(`
      function foo do
        log this.bar
      end
      foo()
    `);

    expect(frames.at(-1)?.error!.message).toBe("ThisKeywordUsedOutsideOfMethodContext");
  });
  test("constructor -> function", () => {
    const { frames, error } = interpret(`
      function foo do
        log this.bar
      end
      class Foobar do
        public property bar
        constructor do
          foo()
        end
      end
      log new Foobar()
    `);

    expect(frames.at(-1)?.error!.message).toBe("ThisKeywordUsedOutsideOfMethodContext");
  });
  test("method -> function", () => {
    const { frames, error } = interpret(`
      function foo do
        log this.bar
      end
      class Foobar do
        public property bar
        constructor do
          set this.bar to 5
        end
        public method baz do
          foo()
        end
      end
      set x to new Foobar()
      log x.baz()
    `);

    expect(frames.at(-1)?.error!.message).toBe("ThisKeywordUsedOutsideOfMethodContext");
  });
});
// AttemptedToAccessPrivateMethod
test("UnexpectedPrivateMethodAccessAttempt", () => {
  const { frames, error } = interpret(`
    class Foobar do
      private method foo do
      end
    end
    log (new Foobar()).foo()
  `);

  expect(frames.at(-1)?.error!.message).toBe("UnexpectedPrivateMethodAccessAttempt");
});
test("UnexpectedPrivateGetterAccessAttempt", () => {
  const { frames, error } = interpret(`
    class Foobar do
      private property foo
        constructor do
          set this.foo to 5
        end
    end
    log (new Foobar()).foo
  `);

  expect(frames.at(-1)?.error!.message).toBe("UnexpectedPrivateGetterAccessAttempt");
});
test("UnexpectedPrivateSetterAccessAttempt", () => {
  const { frames, error } = interpret(`
    class Foobar do
      private property foo
        constructor do
          set this.foo to 5
        end
    end
    set x to new Foobar()
    change x.foo to 5
  `);

  expect(frames.at(-1)?.error!.message).toBe("UnexpectedPrivateSetterAccessAttempt");
});
test("UnexpectedPrivateSetterAccessAttempt", () => {
  const { frames, error } = interpret(`
    class Foobar do
      private property foo
      constructor do
        set this.foo to 5
      end
    end
    set x to new Foobar()
    change x.foo to 5
  `);

  expect(frames.at(-1)?.error!.message).toBe("UnexpectedPrivateSetterAccessAttempt");
});
test("PropertyAlreadySetInConstructor", () => {
  const { frames, error } = interpret(`
    class Foobar do
      private property foo
      constructor do
        set this.foo to 3
      end

      public method bar do
        set this.foo to 5
      end
    end
    set x to new Foobar()
    x.bar()
  `);

  expect(frames.at(-1)?.error!.message).toBe("PropertyAlreadySetInConstructor: name: foo");
});
