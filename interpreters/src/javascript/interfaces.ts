// All supported AST node types in the JavaScript interpreter
export type NodeType =
  // Expressions
  | "LiteralExpression"
  | "BinaryExpression"
  | "UnaryExpression"
  | "GroupingExpression"
  | "IdentifierExpression"
  | "AssignmentExpression"
  | "UpdateExpression"
  | "TemplateLiteralExpression"
  | "ArrayExpression"
  | "IndexExpression"
  | "MemberExpression"
  | "DictionaryExpression"
  | "CallExpression"
  | "NewExpression"
  // Statements
  | "ExpressionStatement"
  | "VariableDeclaration"
  | "BlockStatement"
  | "IfStatement"
  | "ForStatement"
  | "ForOfStatement"
  | "ForInStatement"
  | "RepeatStatement"
  | "WhileStatement"
  | "BreakStatement"
  | "ContinueStatement"
  | "FunctionDeclaration"
  | "ReturnStatement";

export interface LanguageFeatures {
  excludeList?: string[];
  includeList?: string[];
  allowShadowing?: boolean;
  allowTruthiness?: boolean;
  requireVariableInstantiation?: boolean;
  allowTypeCoercion?: boolean;
  oneStatementPerLine?: boolean;
  enforceStrictEquality?: boolean;
  allowInWithArrays?: boolean;
  requireSemicolons?: boolean;
  maxTotalLoopIterations?: number;
  /**
   * Enable native JavaScript behavior for edge cases that don't make pedagogical sense.
   * When false (default), educational guardrails are enabled (e.g., push() with no arguments throws error).
   * When true, allows all native JavaScript behaviors (e.g., push() with no arguments is a no-op).
   */
  nativeJSMode?: boolean;
  // AST node-level restrictions
  // null/undefined = all nodes allowed (default behavior)
  // [] = no nodes allowed
  // ["NodeType", ...] = only specified nodes allowed
  allowedNodes?: NodeType[] | null;
  // Global builtin restrictions (console, Math, Number, etc.)
  // null/undefined = all globals allowed (default behavior)
  // [] = no globals allowed
  // ["Number", "Math"] = only specified globals allowed
  allowedGlobals?: string[];
  // Stdlib member restrictions
  // null/undefined = all stdlib members allowed (default behavior)
  // Nested structure for granular control per type
  allowedStdlib?: {
    array?: {
      properties?: string[]; // e.g., ['length']
      methods?: string[]; // e.g., ['at', 'push', 'pop']
    };
    string?: {
      properties?: string[];
      methods?: string[];
    };
    // Extensible for other types (number, object, etc.)
  };
}

// Export as JSLanguageFeatures for use in shared interfaces
export type JSLanguageFeatures = LanguageFeatures;
