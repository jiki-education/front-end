import type { Location } from "../shared/location";

export type SyntaxErrorType =
  | "GenericSyntaxError"
  | "InvalidAssignmentTargetExpression"
  | "AssignmentInExpression"
  | "MissingBacktickToTerminateTemplateLiteral"
  | "MissingDoubleQuoteToTerminateString"
  | "MissingExpression"
  | "MissingInitializerInConstDeclaration"
  | "MissingInitializerInVariableDeclaration"
  | "ConstInForLoopInit"
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
  | "UnexpectedRightBrace"
  | "UnexpectedElseWithoutMatchingIf"
  | "UnexpectedTokenInTemplateLiteral"
  | "UnimplementedToken"
  | "PermanentlyExcludedToken"
  | "UnknownCharacter"
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
