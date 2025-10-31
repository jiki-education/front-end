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
  | "MemberExpression"
  | "DictionaryExpression"
  | "CallExpression"
  // Statements
  | "ExpressionStatement"
  | "VariableDeclaration"
  | "BlockStatement"
  | "IfStatement"
  | "ForStatement"
  | "ForOfStatement"
  | "WhileStatement"
  | "BreakStatement"
  | "ContinueStatement";

export interface LanguageFeatures {
  excludeList?: string[];
  includeList?: string[];
  allowShadowing?: boolean;
  allowTruthiness?: boolean;
  requireVariableInstantiation?: boolean;
  allowTypeCoercion?: boolean;
  oneStatementPerLine?: boolean;
  enforceStrictEquality?: boolean;
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
  // Stdlib function restrictions for IO exercises
  // Which stdlib functions are available (e.g., ['concatenate', 'to_upper_case'])
  allowedStdlibFunctions?: string[];
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
