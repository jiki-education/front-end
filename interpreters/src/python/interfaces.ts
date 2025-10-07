// All supported AST node types in the Python interpreter
export type NodeType =
  // Expressions
  | "LiteralExpression"
  | "BinaryExpression"
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
