import type { JikiObject } from "./jikiObjects";

// Statement result types
export interface EvaluationResultExpressionStatement {
  type: "ExpressionStatement";
  expression: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultAssignmentStatement {
  type: "AssignmentStatement";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultFunctionDeclaration {
  type: "FunctionDeclaration";
  name: string;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
}

export interface EvaluationResultIfStatement {
  type: "IfStatement";
  condition: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultBlockStatement {
  type: "BlockStatement";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultForInStatement {
  type: "ForInStatement";
  variableName: string;
  iterable: EvaluationResult;
  currentValue?: JikiObject;
  iteration: number;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultWhileStatement {
  type: "WhileStatement";
  condition: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultRepeatStatement {
  type: "RepeatStatement";
  iteration: number;
  jikiObject?: undefined;
  immutableJikiObject?: undefined;
}

export interface EvaluationResultReturnStatement {
  type: "ReturnStatement";
  expression?: EvaluationResultExpression;
  jikiObject?: JikiObject;
  immutableJikiObject?: JikiObject;
}

export interface EvaluationResultBreakStatement {
  type: "BreakStatement";
  // Break statements don't produce values, these fields are optional
  jikiObject?: undefined;
  immutableJikiObject?: undefined;
}

export interface EvaluationResultContinueStatement {
  type: "ContinueStatement";
  // Continue statements don't produce values, these fields are optional
  jikiObject?: undefined;
  immutableJikiObject?: undefined;
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
  functionName?: string; // For external function lookup
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultSubscriptExpression {
  type: "SubscriptExpression";
  object: EvaluationResultExpression;
  index: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultCallExpression {
  type: "CallExpression";
  functionName: string;
  args: EvaluationResultExpression[];
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultAttributeExpression {
  type: "AttributeExpression";
  object: EvaluationResultExpression;
  property: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultListExpression {
  type: "ListExpression";
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultFStringExpression {
  type: "FStringExpression";
  parts: (string | EvaluationResultExpression)[];
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

// Union types
export type EvaluationResultStatement =
  | EvaluationResultExpressionStatement
  | EvaluationResultAssignmentStatement
  | EvaluationResultIfStatement
  | EvaluationResultBlockStatement
  | EvaluationResultForInStatement
  | EvaluationResultWhileStatement
  | EvaluationResultRepeatStatement
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
  | EvaluationResultSubscriptExpression
  | EvaluationResultCallExpression
  | EvaluationResultAttributeExpression
  | EvaluationResultListExpression
  | EvaluationResultFStringExpression;

export type EvaluationResult = EvaluationResultStatement | EvaluationResultExpression;
