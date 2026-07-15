import type { Location } from "../shared/location";

export type SyntaxErrorType =
  | "InvalidAssignmentTargetExpression"
  | "AssignmentInExpression"
  | "MissingBacktickToTerminateTemplateLiteral"
  | "MissingDoubleQuoteToTerminateString"
  | "MissingExpression"
  | "MissingClassNameAfterNew"
  | "MissingInitializerInConstDeclaration"
  | "MissingInitializerInVariableDeclaration"
  | "ConstInForLoopInit"
  | "MissingLetInForOf"
  | "MissingLetInForIn"
  | "MissingLetInForLoopInit"
  | "UnexpectedDoubleIdentifier"
  | "MissingDeclarationKeywordWithSuggestion"
  | "MissingLeftParenthesisAfterIf"
  | "MissingRightBraceAfterBlock"
  | "MissingRightBraceInTemplateLiteral"
  | "MissingRightBracketInArray"
  | "MissingRightBracketInMemberAccess"
  | "MissingRightParenthesisAfterExpression"
  | "MissingRightParenthesisAfterIfCondition"
  | "MissingEndOfLine"
  | "MissingVariableName"
  | "MultipleStatementsPerLine"
  | "TrailingCommaInArray"
  | "TrailingCommaInDictionary"
  | "InvalidDictionaryKey"
  | "MissingColonInDictionary"
  | "DuplicateDictionaryKey"
  | "MissingRightBraceInDictionary"
  | "UnexpectedElseWithoutMatchingIf"
  | "UnexpectedTokenInTemplateLiteral"
  | "UnimplementedToken"
  | "PermanentlyExcludedToken"
  | "UnknownCharacter"
  | "UnterminatedBlockComment"
  // Language-feature restrictions
  | "StrictEqualityRequired"
  | "StrictInequalityRequired"
  // Node restriction errors
  | "LiteralExpressionNotAllowed"
  | "BinaryExpressionNotAllowed"
  | "UnaryExpressionNotAllowed"
  | "GroupingExpressionNotAllowed"
  | "IdentifierExpressionNotAllowed"
  | "AssignmentExpressionNotAllowed"
  | "UpdateExpressionNotAllowed"
  | "TemplateLiteralExpressionNotAllowed"
  | "ArrayExpressionNotAllowed"
  | "IndexExpressionNotAllowed"
  | "MemberExpressionNotAllowed"
  | "DictionaryExpressionNotAllowed"
  | "CallExpressionNotAllowed"
  | "ExpressionStatementNotAllowed"
  | "VariableDeclarationNotAllowed"
  | "BlockStatementNotAllowed"
  | "IfStatementNotAllowed"
  | "ForStatementNotAllowed"
  | "ForOfStatementNotAllowed"
  | "RepeatStatementNotAllowed"
  | "WhileStatementNotAllowed"
  | "MissingLeftParenAfterRepeat"
  | "MissingRightParenAfterRepeatCount"
  | "BreakStatementNotAllowed"
  | "ContinueStatementNotAllowed"
  | "FunctionDeclarationNotAllowed"
  | "ReturnStatementNotAllowed"
  | "MissingRightParenthesisAfterFunctionCall"
  // Function-related errors
  | "NestedFunctionDeclaration"
  | "MissingFunctionName"
  | "MissingLeftParenthesisAfterFunctionName"
  | "MissingParameterName"
  | "DuplicateParameterName"
  | "MissingRightParenthesisAfterParameters"
  | "MissingLeftBraceBeforeFunctionBody"
  | "ForInStatementNotAllowed"
  | "NewExpressionNotAllowed"
  | "BlockRequired";

export class SyntaxError extends Error {
  constructor(
    message: string,
    public location: Location,
    public type: SyntaxErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "SyntaxError";
  }
}

export type LintErrorType =
  | "ClosingBraceNotOnOwnLine"
  | "OpeningBraceContentNotOnOwnLine"
  | "IncorrectIndentation"
  | "IncorrectIndentationAtTopLevel";

export class LintError {
  constructor(
    public message: string,
    public location: Location,
    public type: LintErrorType,
    public context?: any
  ) {}
}

export class LogicError extends Error {}

// Signals a broken invariant inside the interpreter itself (a bug in Jiki, not
// in the student's code) - a situation that should never happen. Unlike
// RuntimeError, this is NOT turned into a nice error frame; it propagates all
// the way out of interpret() so it explodes loudly at the top level and gets
// noticed/fixed, rather than being shown to a student.
export class InterpreterInternalError extends Error {}
