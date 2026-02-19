import type { Location } from "../shared/location";

export type SyntaxErrorType =
  | "GenericSyntaxError"
  | "InvalidAssignmentTargetExpression"
  | "MissingBacktickToTerminateTemplateLiteral"
  | "MissingDoubleQuoteToTerminateString"
  | "MissingExpression"
  | "MissingInitializerInConstDeclaration"
  | "MissingInitializerInVariableDeclaration"
  | "ConstInForLoopInit"
  | "MissingLeftParenthesisAfterIf"
  | "MissingRightBraceAfterBlock"
  | "MissingRightBraceInTemplateLiteral"
  | "MissingRightBracketInArray"
  | "MissingRightBracketInMemberAccess"
  | "MissingRightParenthesisAfterExpression"
  | "MissingRightParenthesisAfterIfCondition"
  | "MissingSemicolon"
  | "MissingVariableName"
  | "MultipleStatementsPerLine"
  | "TrailingCommaInArray"
  | "TrailingCommaInDictionary"
  | "InvalidDictionaryKey"
  | "MissingColonInDictionary"
  | "DuplicateDictionaryKey"
  | "MissingRightBraceInDictionary"
  | "UnexpectedRightBrace"
  | "UnexpectedTokenInTemplateLiteral"
  | "UnimplementedToken"
  | "PermanentlyExcludedToken"
  | "UnknownCharacter"
  | "UnterminatedComment"
  | "UnterminatedString"
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
  | "MissingRightParenthesisAfterArguments"
  | "MissingRightParenthesisAfterFunctionCall"
  // Function-related errors
  | "NestedFunctionDeclaration"
  | "MissingFunctionName"
  | "MissingLeftParenthesisAfterFunctionName"
  | "MissingParameterName"
  | "DuplicateParameterName"
  | "MissingRightParenthesisAfterParameters"
  | "MissingLeftBraceBeforeFunctionBody";

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

export class LogicError extends Error {}
