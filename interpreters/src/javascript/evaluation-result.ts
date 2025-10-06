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
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
  functionName?: string; // Present when identifier refers to a function
}

export interface EvaluationResultVariableDeclaration {
  type: "VariableDeclaration";
  name: string;
  value: EvaluationResultExpression;
  jikiObject: JikiObject;
  immutableJikiObject: JikiObject;
}

export interface EvaluationResultAssignmentExpression {
  type: "AssignmentExpression";
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
