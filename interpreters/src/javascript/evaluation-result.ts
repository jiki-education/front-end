import type { JikiObject } from "./jikiObjects";

// Statement result types
export interface EvaluationResultExpressionStatement {
  type: "ExpressionStatement";
  expression: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultVariableDeclaration {
  type: "VariableDeclaration";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultIfStatement {
  type: "IfStatement";
  condition: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultFunctionDeclaration {
  type: "FunctionDeclaration";
  name: string;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultReturnStatement {
  type: "ReturnStatement";
  expression?: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultBreakStatement {
  type: "BreakStatement";
  // Break statements don't produce values, these fields are never accessed
  jikiObject: never;
  immutableJikiObject: never;
}

export interface EvaluationResultContinueStatement {
  type: "ContinueStatement";
  // Continue statements don't produce values, these fields are never accessed
  jikiObject: never;
  immutableJikiObject: never;
}

// Expression result types
export interface EvaluationResultBinaryExpression {
  type: "BinaryExpression";
  left: EvaluationResultExpression;
  right: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultUnaryExpression {
  type: "UnaryExpression";
  operand: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultLiteralExpression {
  type: "LiteralExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultGroupingExpression {
  type: "GroupingExpression";
  inner: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultIdentifierExpression {
  type: "IdentifierExpression";
  name: string;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
  functionName?: string; // Present when identifier refers to a function
}

export interface EvaluationResultAssignmentExpression {
  type: "AssignmentExpression";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultArrayExpression {
  type: "ArrayExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultMemberExpression {
  type: "MemberExpression";
  object: EvaluationResultExpression;
  property: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultDictionaryExpression {
  type: "DictionaryExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultCallExpression {
  type: "CallExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
  functionName?: string;
  args?: EvaluationResult[];
}

export interface EvaluationResultTemplateLiteralExpression {
  type: "TemplateLiteralExpression";
  parts: (string | EvaluationResultExpression)[];
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultUpdateExpression {
  type: "UpdateExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

// Union types
export type EvaluationResultStatement =
  | EvaluationResultExpressionStatement
  | EvaluationResultVariableDeclaration
  | EvaluationResultIfStatement
  | EvaluationResultFunctionDeclaration
  | EvaluationResultReturnStatement
  | EvaluationResultBreakStatement
  | EvaluationResultContinueStatement;

export type EvaluationResultExpression =
  | EvaluationResultBinaryExpression
  | EvaluationResultUnaryExpression
  | EvaluationResultLiteralExpression
  | EvaluationResultGroupingExpression
  | EvaluationResultIdentifierExpression
  | EvaluationResultAssignmentExpression
  | EvaluationResultArrayExpression
  | EvaluationResultMemberExpression
  | EvaluationResultDictionaryExpression
  | EvaluationResultCallExpression
  | EvaluationResultTemplateLiteralExpression
  | EvaluationResultUpdateExpression;

export type EvaluationResult = EvaluationResultStatement | EvaluationResultExpression;
