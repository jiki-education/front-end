import type { JikiObject } from "./jikiObjects";

export interface EvaluationResult {
  type: string;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export type EvaluationResultExpression = EvaluationResult;

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

export interface EvaluationResultExpressionStatement {
  type: "ExpressionStatement";
  expression: EvaluationResultExpression;
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

export interface EvaluationResultAssignmentStatement {
  type: "AssignmentStatement";
  name: string;
  value: EvaluationResultExpression;
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
  args: EvaluationResult[];
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

export interface EvaluationResultFunctionDeclaration {
  type: "FunctionDeclaration";
  name: string;
  jikiObject: JikiObject;
  immutableJikiObject?: JikiObject;
}

export interface EvaluationResultReturnStatement {
  type: "ReturnStatement";
  expression?: EvaluationResultExpression;
  jikiObject?: JikiObject;
  immutableJikiObject?: JikiObject;
}
