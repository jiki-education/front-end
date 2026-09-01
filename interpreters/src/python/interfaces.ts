// All supported AST node types in the Python interpreter
export type NodeType =
  // Expressions
  | "LiteralExpression"
  | "BinaryExpression"
  | "LogicalExpression"
  | "UnaryExpression"
  | "GroupingExpression"
  | "IdentifierExpression"
  | "ListExpression"
  | "SubscriptExpression"
  | "CallExpression"
  | "AttributeExpression"
  // Statements
  | "ExpressionStatement"
  | "PrintStatement"
  | "AssignmentStatement"
  | "BlockStatement"
  | "IfStatement"
  | "ForInStatement"
  | "WhileStatement"
  | "RepeatStatement"
  | "BreakStatement"
  | "ContinueStatement"
  | "FunctionDeclaration"
  | "ReturnStatement";

export interface LanguageFeatures {
  excludeList?: string[];
  includeList?: string[];
  allowTruthiness?: boolean;
  allowTypeCoercion?: boolean;
  maxTotalLoopIterations?: number;
  // Guards against runaway recursion. maxRecursiveCallsPerFunction bounds how many
  // times a single function may appear on the call stack at once, which is what
  // catches a function that calls itself; maxTotalCallDepth bounds the stack as a
  // whole, which catches mutual recursion spread across several functions before it
  // can exhaust the host engine's native stack.
  maxRecursiveCallsPerFunction?: number;
  maxTotalCallDepth?: number;
  // AST node-level restrictions
  // null/undefined = all nodes allowed (default behavior)
  // [] = no nodes allowed
  // ["NodeType", ...] = only specified nodes allowed
  allowedNodes?: NodeType[] | null;
  // Stdlib member restrictions
  allowedStdlib?: {
    list?: {
      properties?: string[];
      methods?: string[];
    };
    // Future: dict, str, etc.
  };
}

// Export as PythonLanguageFeatures for use in shared interfaces
export type PythonLanguageFeatures = LanguageFeatures;
