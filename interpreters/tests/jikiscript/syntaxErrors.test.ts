import { parse } from "@jikiscript/parser";

/**********
 * Numbers *
 **********/
test("MalformedNumberWithMultipleDecimalPoints", () => {
  expect(() => parse("1.3.4")).toThrow("NumberWithMultipleDecimalPoints: suggestion: 1.34");
});

test("MalformedNumberEndingWithDecimalPoint", () => {
  expect(() => parse("123.")).toThrow("NumberEndsWithDecimalPoint: suggestion: 123");
});

test("MalformedNumberContainingAlphabetCharacters", () => {
  expect(() => parse("set x to 123abc")).toThrow("NumberContainsAlpha: suggestion: 123");
});

test("MalformedNumberStartingWithZero", () => {
  expect(() => parse("set x to 00123")).toThrow("NumberStartsWithZero: suggestion: 123");
});

/**********
 * Strings *
 **********/
test("MissingDoubleQuoteToStartStringLiteral", () => {
  expect(() => parse('abc"')).toThrow("MissingDoubleQuoteToStartString: string: abc");
});

describe("MissingDoubleQuoteToTerminateStringLiteral", () => {
  test("unterminated - end of file", () => {
    expect(() => parse('"abc')).toThrow("MissingDoubleQuoteToTerminateString: string: abc");
  });

  test("unterminated - end of line", () => {
    expect(() => parse('"abc\nsomething_else"')).toThrow("MissingDoubleQuoteToTerminateString: string: abc");
  });

  test("unterminated - newline in string", () => {
    expect(() => parse('"abc\n"')).toThrow("MissingDoubleQuoteToTerminateString: string: abc");
  });
});

/********************
 * Variable Assignment *
 ********************/
test("UnexpectedEqualsForAssignmentUseSetInstead", () => {
  expect(() => parse('set value = "value"')).toThrow("UnexpectedEqualsForAssignmentUseSetInstead");
});

test("UnexpectedEqualsForAssignmentUseSetInstead - second occurrence", () => {
  expect(() => parse('set x = "value"')).toThrow("UnexpectedEqualsForAssignmentUseSetInstead");
});

test("InvalidNumericVariableNameStartingWithDigit", () => {
  expect(() => parse('set 123 to "value"')).toThrow("InvalidNumericVariableName: name: 123");
});

test("MissingToAfterVariableNameToInitializeValue", () => {
  expect(() => parse('set name "Jeremy"')).toThrow("MissingToAfterVariableNameToInitializeValue: name");
});

test("UnexpectedSpaceInIdentifierName", () => {
  expect(() => parse('set na me to "Jeremy"')).toThrow("UnexpectedSpaceInIdentifier: first_half: na, second_half: me");
});

describe("InvalidVariableNameExpression", () => {
  test("setting", () => {
    expect(() => parse(`set Foo to true`)).toThrow("InvalidVariableNameExpression");
  });
  test("change", () => {
    expect(() => parse(`change Foo to true`)).toThrow("InvalidVariableNameExpression");
  });
  // test('use', () => {
  //   expect(() => parse(`log foo(Foo)`)).toThrow('InvalidVariableNameExpression')
  // })
});

/*************
 * Equality Operators *
 *************/
describe("UnexpectedEqualsForEqualityUseIsInstead", () => {
  test("in condition", () => {
    expect(() => parse('if a = "value"')).toThrow("UnexpectedEqualsForEqualityUseIsInstead");
  });
  test("in assignment", () => {
    expect(() => parse('set a to x = "value"')).toThrow("UnexpectedEqualsForEqualityUseIsInstead");
  });
});

describe("chained things", () => {
  test("triple equals", () => {
    expect(() => parse("1 == 2 == 3")).toThrow("UnexpectedChainedEqualityExpression");
  });
  test.skip("triple not equals", () => {
    expect(() => parse("1 != 2 != 3")).toThrow("UnexpectedChainedEqualityExpression");
  });
});

/***********************
 * Function Definitions *
 ***********************/
test("MissingFunctionNameInDeclaration", () => {
  expect(() =>
    parse(`
      function with x, y do
        set result to x + y
      end
    `)
  ).toThrow("MissingFunctionNameInDeclaration");
});

test("MissingWithBeforeParametersInFunction", () => {
  expect(() =>
    parse(`
    function foobar a do
    end
  `)
  ).toThrow("MissingWithBeforeParametersInFunction");
});

test("MissingWithBeforeParametersInFunction - with unexpected token", () => {
  expect(() =>
    parse(`
      function move unexpected (x, y) do
        set result to x + y
      end
    `)
  ).toThrow("MissingWithBeforeParametersInFunction");
});

test("MissingDoToStartFunctionBody", () => {
  expect(() =>
    parse(`
    function foobar with a
    end
  `)
  ).toThrow("MissingDoToStartBlock: type: function");
});

test("MissingEndAfterBlockStatement", () => {
  expect(() =>
    parse(`
    function foobar with a do
  `)
  ).toThrow("MissingEndAfterBlock: type: function");
});

test("MissingParameterNameInFunctionDeclaration", () => {
  expect(() =>
    parse(`
      function move with do
        set result to 10
      end
    `)
  ).toThrow("MissingParameterNameInFunctionDeclaration");
});

test("MissingParameterNameInFunctionDeclaration - second occurrence", () => {
  expect(() =>
    parse(`
      function move with do
        set result to 10
      end
    `)
  ).toThrow("MissingParameterNameInFunctionDeclaration");
});

test("MalformedNumberContainingAlphabetCharacters - in parameters", () => {
  expect(() =>
    parse(`
      function move with 1x, y do
        set result to x + y
      end
    `)
  ).toThrow("NumberContainsAlpha: suggestion: 1");
});

test("MissingCommaBetweenFunctionParameters", () => {
  expect(() =>
    parse(`
      function move with x y do
        set result to x + y
      end
    `)
  ).toThrow("MissingCommaBetweenParameters: parameter: x");
});

test("MissingCommaBetweenFunctionParameters - with unexpected token", () => {
  expect(() =>
    parse(`
      function move with x, unexpected y do
        set result to x + y
      end
    `)
  ).toThrow("MissingCommaBetweenParameters: parameter: unexpected");
});

test("DuplicateParameterNameInFunctionDeclaration", () => {
  expect(() =>
    parse(`
      function move with x, x do
        set result to x + x
      end
    `)
  ).toThrow("DuplicateParameterName: parameter: x");
});

test("InvalidNestedFunctionDeclaration", () => {
  expect(() =>
    parse(`
      function outer do
        function inner do
          return 1
        end
      end
    `)
  ).toThrow("InvalidNestedFunctionDeclaration");
});

describe("InvalidFunctionNameExpression", () => {
  test("number as a function name", () => {
    expect(() => parse("1()")).toThrow("InvalidFunctionNameExpression");
  });
  test("boolean as a function name", () => {
    expect(() => parse("true()")).toThrow("InvalidFunctionNameExpression");
  });
});

/*****************
 * Function Calls *
 *****************/
describe("MissingRightParenthesisAfterFunctionCall", () => {
  test("missing closing parenthesis - no args", () => {
    expect(() => parse("move(")).toThrow("MissingRightParenthesisAfterFunctionCall: function: move");
  });

  test("missing closing parenthesis - 1 arg", () => {
    expect(() => parse("move(1")).toThrow("MissingRightParenthesisAfterFunctionCall: function: move");
  });

  test("missing closing parenthesis - 2 args", () => {
    expect(() => parse("move(1, 2")).toThrow("MissingRightParenthesisAfterFunctionCall: function: move");
  });
});

test("PotentialMissingParenthesesForFunctionCall", () => {
  expect(() => parse("foo")).toThrow("PotentialMissingParenthesesForFunctionCall");
});

/***********
 * If Statements *
 ***********/
describe("MissingDoToStartFunctionBody", () => {
  test("if", () => {
    expect(() =>
      parse(`
      if x equals 1
      end
    `)
    ).toThrow("MissingDoToStartBlock: type: if");
  });

  test("else", () => {
    expect(() =>
      parse(`
      if 5 > 4 do
      else
      end
    `)
    ).toThrow("MissingDoToStartBlock: type: else");
  });

  test("repeat", () => {
    expect(() =>
      parse(`
      repeat 5 times
      end
    `)
    ).toThrow("MissingDoToStartBlock: type: repeat");
  });

  test.skip("while", () => {
    expect(() =>
      parse(`
      while x equals 1
      end
    `)
    ).toThrow("MissingDoToStartBlock: type: while");
  });
});

describe("MissingEndAfterBlockStatement", () => {
  test("if", () => {
    expect(() =>
      parse(`
      if x equals 1 do
    `)
    ).toThrow("MissingEndAfterBlock: type: if");
  });

  test("else", () => {
    expect(() =>
      parse(`
      if 5 > 4 do
      else do
    `)
    ).toThrow("MissingEndAfterBlock: type: else");
  });

  test("nested ifs", () => {
    expect(() =>
      parse(`
        if x is 10 do
          if y is 20 do
            set x to 30
          set y to 40
        end
      `)
    ).toThrow("MissingEndAfterBlock: type: if");
  });

  test("repeat", () => {
    expect(() =>
      parse(`
      repeat 5 times do
    `)
    ).toThrow("MissingEndAfterBlock: type: repeat");
  });

  test.skip("while", () => {
    expect(() =>
      parse(`
      while x equals 1 do
    `)
    ).toThrow("MissingEndAfterBlock: type: while");
  });
});

describe("UnexpectedElseWithoutMatchingIf", () => {
  test("else", () => {
    expect(() =>
      parse(`
        else
          set x to 10
        end
      `)
    ).toThrow("UnexpectedElseWithoutMatchingIf");
  });

  test("else if", () => {
    expect(() =>
      parse(`
        else if x is 10 do
          set x to 20
        end
      `)
    ).toThrow("UnexpectedElseWithoutMatchingIf");
  });

  // TODO: Could we do better here?
  test("multiple else statements", () => {
    expect(() =>
      parse(`
        if x is 10 do
          set x to 20
        else do
          set x to 30
        else do
          set x to 40
        end
      `)
    ).toThrow("UnexpectedElseWithoutMatchingIf");
  });
});

describe("MissingIfConditionAfterIfKeyword", () => {
  test("if", () => {
    expect(() =>
      parse(`
        if do
          set x to 10
        end
      `)
    ).toThrow("MissingIfConditionAfterIfKeyword");
  });
  test("else if", () => {
    expect(() =>
      parse(`
        if x is 10 do
          set x to 20
        else if do
          set x to 30
        end
      `)
    ).toThrow("MissingIfConditionAfterIfKeyword");
  });
});

describe("UnexpectedVariableExpressionAfterIfWithPotentialTypo", () => {
  test("misspelt comparison operator with brackets", () => {
    expect(() =>
      parse(`
        if(x equal 10) do
          set x to 20
        end
      `)
    ).toThrow("MissingRightParenthesisAfterExpressionWithPotentialTypo: actual: equal, potential: equals");
  });
});

describe("UnexpectedIfInBinaryExpression", () => {
  test("and", () => {
    expect(() => parse(`if true and if false do`)).toThrow("UnexpectedIfInBinaryExpression");
  });
  test("or", () => {
    expect(() => parse(`if true or if false do`)).toThrow("UnexpectedIfInBinaryExpression");
  });
});

/***********
 * For Each Loops *
 ***********/
test("MissingEachAfterForKeyword", () => {
  expect(() =>
    parse(`
      for elem in [] do
        set x to elem
      end
    `)
  ).toThrow("MissingEachAfterForKeyword");
});

test("MissingSecondElementNameAfterForeachKeyword", () => {
  expect(() => parse(`for each key, in {} do`)).toThrow("MissingSecondElementNameAfterForeachKeyword");
});

/***********
 * Repeat Loops *
 ***********/
describe("MissingByAfterIndexedKeyword", () => {
  test("repeat", () => {
    expect(() => parse(`repeat 10 times indexed do`)).toThrow("MissingByAfterIndexedKeyword");
  });
});

describe("MissingIndexNameAfterIndexedByKeywords", () => {
  test("repeat", () => {
    expect(() => parse(`repeat 10 times indexed by do`)).toThrow("MissingIndexNameAfterIndexedByKeywords");
  });
});

/***********
 * Lists *
 ***********/
describe("MissingRightBracketAfterListElements", () => {
  test("one line", () => {
    expect(() =>
      parse(`
        set foo to [1, 2,
      `)
    ).toThrow("MissingRightBracketAfterListElements");
  });
  test("multiple lines", () => {
    expect(() =>
      parse(`
        set foo to [1,
                    2,
      `)
    ).toThrow("MissingRightBracketAfterListElements");
  });
  test("new statement with comma", () => {
    expect(() =>
      parse(`
        set foo to [1, 2,
        set x to 1
      `)
    ).toThrow("MissingRightBracketAfterListElements");
  });
  test("new statement without comma", () => {
    expect(() =>
      parse(`
        set foo to [1, 2
        set x to 1
      `)
    ).toThrow("MissingRightBracketAfterListElements");
  });
  test("new statement without elements", () => {
    expect(() =>
      parse(`
        set foo to [
        set x to 1
      `)
    ).toThrow("MissingRightBracketAfterListElements");
  });
  test("before a do", () => {
    expect(() =>
      parse(`
        for each x in [1 do
        set x to 1
      `)
    ).toThrow("MissingRightBracketAfterListElements");
  });
});

describe("MissingCommaBetweenListElements", () => {
  test("one line", () => {
    expect(() =>
      parse(`
        set foo to [1 2
      `)
    ).toThrow("MissingCommaBetweenListElements");
  });
  test("multiple lines", () => {
    expect(() =>
      parse(`
        set foo to [1
                    2
      `)
    ).toThrow("MissingCommaBetweenListElements");
  });
});

describe("UnexpectedTrailingCommaInList", () => {
  test("list with elems", () => {
    expect(() =>
      parse(`
        set foo to ["1", "2",]
      `)
    ).toThrow("UnexpectedTrailingCommaInList");
  });
  test("naked list", () => {
    expect(() =>
      parse(`
        set foo to [,]
      `)
    ).toThrow("UnexpectedTrailingCommaInList");
  });
});

/***********
 * Dictionaries *
 ***********/
describe("MissingRightBraceAfterDictionaryElements", () => {
  test("one line", () => {
    expect(() =>
      parse(`
        set foo to {"1": "2",
      `)
    ).toThrow("MissingRightBraceAfterDictionaryElements");
  });

  test("multiple lines", () => {
    expect(() =>
      parse(`
        set foo to {"1": "2",
                    "3": 4,
      `)
    ).toThrow("MissingRightBraceAfterDictionaryElements");
  });
  test("new statement with comma", () => {
    expect(() =>
      parse(`
        set foo to {"1": "2",
        set x to 1
      `)
    ).toThrow("MissingRightBraceAfterDictionaryElements");
  });
  test("new statement without comma", () => {
    expect(() =>
      parse(`
        set foo to {"1": "2"
        set x to 1
      `)
    ).toThrow("MissingRightBraceAfterDictionaryElements");
  });

  test("new statement without elements", () => {
    expect(() =>
      parse(`
        set foo to {
        set x to 1
      `)
    ).toThrow("MissingRightBraceAfterDictionaryElements");
  });
  test("before a do", () => {
    expect(() =>
      parse(`
        for each x in {"1": "2" do
        end
      `)
    ).toThrow("MissingRightBraceAfterDictionaryElements");
  });
});

describe("MissingCommaBetweenDictionaryElements", () => {
  test("one line", () => {
    expect(() =>
      parse(`
        set foo to {"1": "2" "3"
      `)
    ).toThrow("MissingCommaBetweenDictionaryElements");
  });
  test("multiple lines", () => {
    expect(() =>
      parse(`
        set foo to {"1": "2"
                    "3"
      `)
    ).toThrow("MissingCommaBetweenDictionaryElements");
  });
});

describe("UnexpectedTrailingCommaInList", () => {
  test("dictionary with elems", () => {
    expect(() =>
      parse(`
        set foo to {"1": "2",}
      `)
    ).toThrow("UnexpectedTrailingCommaInList");
  });
  test("naked dictionary", () => {
    expect(() =>
      parse(`
        set foo to {,}
      `)
    ).toThrow("UnexpectedTrailingCommaInList");
  });
});

/***********
 * Method Calls *
 ***********/
describe("MissingMethodNameAfterDotOperator", () => {
  test("nothing", () => {
    expect(() => parse(`log x.`)).toThrow("MissingMethodNameAfterDotOperator");
  });
  test("bracket", () => {
    expect(() => parse(`log x.(`)).toThrow("MissingMethodNameAfterDotOperator");
  });
});

describe("MissingLeftParenthesisAfterMethodCall", () => {
  test("no args", () => {
    expect(() => parse(`log foo(`)).toThrow("MissingRightParenthesisAfterFunctionCall");
  });
  test("single arg", () => {
    expect(() => parse(`log foo.bar(foo`)).toThrow("MissingRightParenthesisAfterFunctionCall");
  });
  test("two args", () => {
    expect(() => parse(`log foo.bar(1, 2`)).toThrow("MissingRightParenthesisAfterFunctionCall");
  });
});

test.skip("literal", () => {
  expect(() => parse(`log foo.bar something`)).toThrow("MissingLeftParenthesisAfterMethodCall");
});
test.skip("right bracket", () => {
  expect(() => parse(`log foo.bar )`)).toThrow("MissingLeftParenthesisAfterMethodCall");
});

/***********
 * Classes *
 ***********/
describe("MissingClassNameInDeclaration", () => {
  test("naked", () => {
    expect(() => parse(`log new `)).toThrow("MissingClassNameInDeclaration");
  });
  test("with args", () => {
    expect(() => parse(`log new (`)).toThrow("MissingClassNameInDeclaration");
  });
});

test("MissingLeftParenthesisInInstantiationExpression", () => {
  expect(() => parse(`log new Foo`)).toThrow("MissingLeftParenthesisInInstantiation: class: Foo");
});

describe("MissingRightParenthesisInInstantiationExpression", () => {
  test("naked", () => {
    expect(() => parse(`log new Foo(`)).toThrow("MissingRightParenthesisInInstantiation: class: Foo");
  });
  test("with args", () => {
    expect(() => parse(`log new Foo(1,2`)).toThrow("MissingRightParenthesisInInstantiation: class: Foo");
  });
  test("with args and trailing comma", () => {
    expect(() => parse(`log new Foo(1,2,`)).toThrow("MissingRightParenthesisInInstantiation: class: Foo");
  });
});

test("InvalidClassNameInInstantiationExpression", () => {
  expect(() => parse(`log new foo()`)).toThrow("InvalidClassNameInInstantiation: class: foo");
});

test("UnexpectedVisibilityModifierOutsideClass", () => {
  expect(() =>
    parse(`
    public function foo do
    end
  `)
  ).toThrow("UnexpectedVisibilityModifierOutsideClass");
});

test("UnexpectedVisibilityModifierInsideMethod", () => {
  expect(() =>
    parse(`
    class Foo do
      public method foo do
        public property foobar
    end
  `)
  ).toThrow("UnexpectedVisibilityModifierInsideMethod");
});

/***********
 * Keywords *
 ***********/
describe("MiscapitalizedKeywordInStatement", () => {
  test("initial letter is wrong", () => {
    expect(() => parse("If x to 10")).toThrow("MiscapitalizedKeyword: actual: If, expected: if");
  });
  test("later letter is wrong", () => {
    expect(() => parse("seT x to 10")).toThrow("MiscapitalizedKeyword: actual: seT, expected: set");
  });
  test("all wrong", () => {
    expect(() => parse("FUNCTION something do")).toThrow("MiscapitalizedKeyword: actual: FUNCTION, expected: function");
  });
});

describe("UnexpectedKeywordInExpression", () => {
  test("function definition", () => {
    expect(() => parse(`function can_fit_in with queue, next, time do`)).toThrow("UnexpectedKeyword: lexeme: next");
  });

  test("set", () => {
    expect(() => parse(`set class to 5`)).toThrow("UnexpectedKeyword: lexeme: class");
  });
  test("set", () => {
    expect(() => parse(`change class to 5`)).toThrow("UnexpectedKeyword: lexeme: class");
  });
});

/***********
 * Brackets *
 ***********/
describe("UnexpectedClosingBracket", () => {
  describe("brackets", () => {
    test(")", () => {
      expect(() =>
        parse(`
          if true) do
        `)
      ).toThrow("UnexpectedClosingBracket: lexeme: )");
    });
    test("}", () => {
      expect(() =>
        parse(`
          if true} do
        `)
      ).toThrow("UnexpectedClosingBracket: lexeme: }");
    });
    test("]", () => {
      expect(() =>
        parse(`
          if true] do
        `)
      ).toThrow("UnexpectedClosingBracket: lexeme: ]");
    });
  });
  describe("places", () => {
    test("if", () => {
      expect(() =>
        parse(`
          if true) do
        `)
      ).toThrow("UnexpectedClosingBracket: lexeme: )");
    });
    test("for each", () => {
      expect(() =>
        parse(`
          for each x in []) do
        `)
      ).toThrow("UnexpectedClosingBracket: lexeme: )");
    });
    test("repeat", () => {
      expect(() =>
        parse(`
          repeat 5 times) do
        `)
      ).toThrow("UnexpectedClosingBracket: lexeme: )");
    });
    test("repeat_forever", () => {
      expect(() =>
        parse(`
          repeat_forever) do
        `)
      ).toThrow("UnexpectedClosingBracket: lexeme: )");
    });
  });
});

/***********
 * General Parsing Errors *
 ***********/
describe("MissingEndOfLine", () => {
  test("Two expressions", () => {
    expect(() => parse("log 1 1")).toThrow("MissingEndOfLine: previous: 1");
  });

  test("Two ends", () => {
    expect(() =>
      parse(`
        function move with x, y do
          set result to x + y
        end end
      `)
    ).toThrow("MissingEndOfLine: previous: end");
  });
});

describe("PointlessStatementWithNoEffect", () => {
  test("with a literal", () => {
    expect(() => parse("10")).toThrow("PointlessStatementWithNoEffect");
  });
  test("with a literal in a group", () => {
    expect(() => parse("(10)")).toThrow("PointlessStatementWithNoEffect");
  });
});

describe("UnexpectedTokenInStatement", () => {
  test("if with random word", () => {
    expect(() =>
      parse(`
      if x is 10 unexpected
      end
    `)
    ).toThrow("UnexpectedToken: lexeme: unexpected");
  });
});

// MissingToAfterChangeKeyword
// MissingClassName
// MissingStatement
// UnexpectedTokenAfterAccessModifier
// MissingMethodName
// MissingPropertyName
// MissingThisAfterSet
// MissingDotAfterThis
