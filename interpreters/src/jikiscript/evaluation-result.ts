import type { Callable } from "./functions";
import type * as JikiTypes from "./jikiObjects";

export interface EvaluationResultFunctionCallStatement {
  type: "FunctionCallStatement";
  expression: EvaluationResultFunctionCallExpression;
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}
export interface EvaluationResultMethodCallStatement {
  type: "MethodCallStatement";
  expression: EvaluationResultMethodCallExpression;
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultChangeElementStatement {
  type: "ChangeElementStatement";
  object: EvaluationResult;
  field: EvaluationResult;
  value: EvaluationResult;
  oldValue: any;
  jikiObject?: undefined;
  data?: Record<string, any>;
}
export interface EvaluationResultChangePropertyStatement {
  type: "ChangePropertyStatement";
  object: EvaluationResult;
  value: EvaluationResult;
  jikiObject?: undefined;
  oldValue?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultChangeVariableStatement {
  type: "ChangeVariableStatement";
  name: string;
  value: EvaluationResult;
  oldValue: JikiTypes.JikiObject;
  jikiObject?: undefined;
  data?: Record<string, any>;
}

export interface EvaluationResultContinueStatement {
  type: "ContinueStatement";
  jikiObject?: undefined;
  data?: Record<string, any>;
}

export interface EvaluationResultBreakStatement {
  type: "BreakStatement";
  jikiObject?: undefined;
  data?: Record<string, any>;
}

export interface EvaluationResultForeachStatement {
  type: "ForeachStatement";
  elementName: string;
  iterable: EvaluationResult;
  index: number;
  temporaryVariableValue?: JikiTypes.JikiObject;
  secondTemporaryVariableValue?: JikiTypes.JikiObject;
  jikiObject?: undefined;
  data?: Record<string, any>;
}

export interface EvaluationResultIfStatement {
  type: "IfStatement";
  condition: EvaluationResult;
  jikiObject: JikiTypes.Boolean;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultLogStatement {
  type: "LogStatement";
  expression: EvaluationResult;
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
}

export interface EvaluationResultRepeatStatement {
  type: "RepeatStatement";
  count: EvaluationResult;
  iteration: number;
  jikiObject?: undefined;
  data?: Record<string, any>;
}

export interface EvaluationResultReturnStatement {
  type: "ReturnStatement";
  expression?: EvaluationResult;
  jikiObject?: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultSetVariableStatement {
  type: "SetVariableStatement";
  name: string;
  value: EvaluationResultExpression;
  jikiObject?: undefined;
  data?: Record<string, any>;
}

export interface EvaluationResultSetPropertyStatement {
  type: "SetPropertyStatement";
  property: string;
  value: EvaluationResult;
  jikiObject?: undefined;
  data?: Record<string, any>;
}

export interface EvaluationResultLogicalExpression {
  type: "LogicalExpression";
  left: EvaluationResult;
  right?: EvaluationResult;
  shortCircuited: boolean;
  jikiObject: JikiTypes.Boolean;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export type EvaluationResultFullyEvaluatedLogicalExpression = EvaluationResultLogicalExpression & {
  right: EvaluationResult;
};

export interface EvaluationResultBinaryExpression {
  type: "BinaryExpression";
  jikiObject: JikiTypes.Primitive;
  immutableJikiObject: JikiTypes.JikiObject;
  left: EvaluationResult;
  right: EvaluationResult;
  data?: Record<string, any>;
}

export interface EvaluationResultUnaryExpression {
  type: "UnaryExpression";
  jikiObject: JikiTypes.Primitive;
  immutableJikiObject?: JikiTypes.JikiObject;
  operand: EvaluationResult;
  data?: Record<string, any>;
}

export interface EvaluationResultGroupingExpression {
  type: "GroupingExpression";
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  inner: EvaluationResult;
  data?: Record<string, any>;
}

export interface EvaluationResultLiteralExpression {
  type: "LiteralExpression";
  jikiObject: JikiTypes.Literal;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultThisExpression {
  type: "ThisExpression";
  jikiObject: JikiTypes.Instance;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultVariableLookupExpression {
  type: "VariableLookupExpression";
  name: string;
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}
export interface EvaluationResultFunctionLookupExpression {
  type: "FunctionLookupExpression";
  name: string;
  function: Callable;
  jikiObject?: JikiTypes.Boolean;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultGetElementExpression {
  type: "GetElementExpression";
  // Can be a string, list, or dictionary
  obj: EvaluationResultLiteralExpression | EvaluationResultListExpression | EvaluationResultDictionaryExpression;
  field: EvaluationResult;
  expression: string;
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultSetElementExpression {
  type: "SetElementExpression";
  obj: EvaluationResultListExpression | EvaluationResultDictionaryExpression;
  field: EvaluationResult;
  expression: string;
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultListExpression {
  type: "ListExpression";
  jikiObject: JikiTypes.List;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultDictionaryExpression {
  type: "DictionaryExpression";
  jikiObject: JikiTypes.Dictionary;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}

export interface EvaluationResultFunctionCallExpression {
  type: "FunctionCallExpression";
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  callee: EvaluationResultVariableLookupExpression | EvaluationResultFunctionLookupExpression;
  args: EvaluationResult[];
  data?: Record<string, any>;
}
export interface EvaluationResultMethodCallExpression {
  type: "MethodCallExpression";
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  object: EvaluationResult;
  method: JikiTypes.Method;
  args: EvaluationResult[];
  data?: Record<string, any>;
}
export interface EvaluationResultClassLookupExpression {
  type: "ClassLookupExpression";
  name: string;
  class: JikiTypes.Class;
  jikiObject: JikiTypes.Boolean;
  immutableJikiObject?: JikiTypes.JikiObject;
  data?: Record<string, any>;
}
export interface EvaluationResultInstantiationExpression {
  type: "InstantiationExpression";
  jikiObject: JikiTypes.Instance;
  immutableJikiObject?: JikiTypes.JikiObject;
  className: EvaluationResultClassLookupExpression;
  args: EvaluationResult[];
  data?: Record<string, any>;
}
export interface EvaluationResultGetterExpression {
  type: "GetterExpression";
  jikiObject: JikiTypes.JikiObject;
  immutableJikiObject?: JikiTypes.JikiObject;
  object: EvaluationResult;
  data?: Record<string, any>;
}

export type EvaluationResult = EvaluationResultStatement | EvaluationResultExpression;

export type EvaluationResultStatement =
  | EvaluationResultLogStatement
  | EvaluationResultSetVariableStatement
  | EvaluationResultChangeVariableStatement
  | EvaluationResultSetPropertyStatement
  | EvaluationResultChangeElementStatement
  | EvaluationResultContinueStatement
  | EvaluationResultBreakStatement
  | EvaluationResultIfStatement
  | EvaluationResultFunctionCallStatement
  | EvaluationResultMethodCallStatement
  | EvaluationResultForeachStatement
  | EvaluationResultRepeatStatement
  | EvaluationResultReturnStatement
  | EvaluationResultChangePropertyStatement;

export type EvaluationResultExpression =
  | EvaluationResultLiteralExpression
  | EvaluationResultListExpression
  | EvaluationResultDictionaryExpression
  | EvaluationResultVariableLookupExpression
  | EvaluationResultClassLookupExpression
  | EvaluationResultFunctionCallExpression
  | EvaluationResultLogicalExpression
  | EvaluationResultBinaryExpression
  | EvaluationResultUnaryExpression
  | EvaluationResultGroupingExpression
  | EvaluationResultGetElementExpression
  | EvaluationResultSetElementExpression
  | EvaluationResultInstantiationExpression
  | EvaluationResultGetterExpression
  | EvaluationResultMethodCallExpression;
