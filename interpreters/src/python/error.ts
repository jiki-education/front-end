import type { Location } from "../shared/location";

export type DisabledLanguageFeatureErrorType =
  | "DisabledFeatureExcludeListViolation"
  | "DisabledFeatureIncludeListViolation";

export class DisabledLanguageFeatureError extends Error {
  constructor(
    message: string,
    public location: Location,
    public type: DisabledLanguageFeatureErrorType,
    public context?: any
  ) {
    super(message);
    this.name = "DisabledLanguageFeatureError";
  }
}

export type SyntaxErrorType =
  | "GenericSyntaxError"
  | "IndentationError"
  | "MissingExpression"
  | "ParseError"
  | "UnimplementedToken"
  | "PermanentlyExcludedToken"
  | "UnterminatedFString"
  // Node restriction errors
  | "LiteralExpressionNotAllowed"
  | "BinaryExpressionNotAllowed"
  | "UnaryExpressionNotAllowed"
  | "GroupingExpressionNotAllowed"
  | "IdentifierExpressionNotAllowed"
  | "ListExpressionNotAllowed"
  | "SubscriptExpressionNotAllowed"
  | "CallExpressionNotAllowed"
  | "ExpressionStatementNotAllowed"
  | "AssignmentStatementNotAllowed"
  | "BlockStatementNotAllowed"
  | "IfStatementNotAllowed"
  | "ForInStatementNotAllowed"
  | "WhileStatementNotAllowed"
  | "RepeatStatementNotAllowed"
  | "AttributeExpressionNotAllowed"
  | "BreakStatementNotAllowed"
  | "ContinueStatementNotAllowed"
  | "FunctionDeclarationNotAllowed"
  | "ReturnStatementNotAllowed"
  // Function-related errors
  | "MissingFunctionName"
  | "MissingLeftParenthesisAfterFunctionName"
  | "MissingParameterName"
  | "DuplicateParameterName"
  | "MissingRightParenthesisAfterParameters"
  | "MissingColonAfterFunctionSignature"
  | "MissingRightParenthesisAfterFunctionCall"
  // Generic parser errors
  | "MissingEqual"
  | "MissingRightBracket"
  | "MissingRightParen"
  | "MissingRightBraceInFString"
  | "MissingColon"
  | "MissingIn"
  | "MissingIndent"
  | "MissingDedent"
  | "MissingIdentifier"
  | "MissingAttributeName";

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
