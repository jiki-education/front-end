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
  // AST node-level restrictions
  // null/undefined = all nodes allowed (default behavior)
  // [] = no nodes allowed
  // ["NodeType", ...] = only specified nodes allowed
  allowedNodes?: NodeType[] | null;
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
