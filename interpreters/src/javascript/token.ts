import type { SomethingWithLocation } from "../shared/interfaces";

const StatementKeywordTokens = [
  "BREAK",
  "CASE",
  "CATCH",
  "CLASS",
  "CONST",
  "CONTINUE",
  "DEBUGGER",
  "DEFAULT",
  "DELETE",
  "DO",
  "EXPORT",
  "EXTENDS",
  "FINALLY",
  "FOR",
  "FUNCTION",
  "IF",
  "IMPORT",
  "LET",
  "NEW",
  "REPEAT",
  "RETURN",
  "SUPER",
  "SWITCH",
  "THIS",
  "THROW",
  "TRY",
  "VAR",
  "WHILE",
  "WITH",
  "YIELD",
] as const;

const OtherKeywordTokens = ["ELSE", "FALSE", "IN", "INSTANCEOF", "NULL", "OF", "TRUE", "TYPEOF", "UNDEFINED", "VOID"];

export const KeywordTokens = [...StatementKeywordTokens, ...OtherKeywordTokens];

// Convert the array of strings into a union type
type StatementKeywordTokenType = (typeof StatementKeywordTokens)[number];
type OtherKeywordTokenType = (typeof OtherKeywordTokens)[number];
export type KeywordTokenType = StatementKeywordTokenType | OtherKeywordTokenType;

export type TokenType =
  | KeywordTokenType

  // Single-character tokens
  | "AMPERSAND"
  | "BACKTICK"
  | "CARET"
  | "COLON"
  | "COMMA"
  | "DOT"
  | "LEFT_BRACE"
  | "LEFT_BRACKET"
  | "LEFT_PAREN"
  | "MINUS"
  | "NOT"
  | "PERCENT"
  | "PIPE"
  | "PLUS"
  | "QUESTION"
  | "RIGHT_BRACE"
  | "RIGHT_BRACKET"
  | "RIGHT_PAREN"
  | "SEMICOLON"
  | "SLASH"
  | "STAR"
  | "TILDE"
  | "EQUAL"

  // Two or more character tokens
  | "STAR_STAR"
  | "ARROW"
  | "AND_EQUAL"
  | "DECREMENT"
  | "DIVIDE_EQUAL"
  | "DOLLAR_LEFT_BRACE"
  | "EQUAL_EQUAL"
  | "GREATER_EQUAL"
  | "GREATER"
  | "INCREMENT"
  | "LEFT_SHIFT"
  | "LESS_EQUAL"
  | "LESS"
  | "LOGICAL_AND"
  | "LOGICAL_OR"
  | "MINUS_EQUAL"
  | "MODULO_EQUAL"
  | "MULTIPLY_EQUAL"
  | "NOT_EQUAL"
  | "NOT_STRICT_EQUAL"
  | "OR_EQUAL"
  | "PLUS_EQUAL"
  | "RIGHT_SHIFT"
  | "STRICT_EQUAL"
  | "XOR_EQUAL"

  // Literals
  | "IDENTIFIER"
  | "NUMBER"
  | "STRING"
  | "TEMPLATE_LITERAL_TEXT"

  // Invisible tokens
  | "EOL" // End of statement
  | "EOF"; // End of file

export type Token = SomethingWithLocation & {
  type: TokenType;
  lexeme: string;
  literal: any;
};
