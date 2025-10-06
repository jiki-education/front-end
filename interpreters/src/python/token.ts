import type { SomethingWithLocation } from "../shared/interfaces";

const StatementKeywordTokens = [
  "AND",
  "AS",
  "ASSERT",
  "ASYNC",
  "AWAIT",
  "BREAK",
  "CLASS",
  "CONTINUE",
  "DEF",
  "DEL",
  "ELIF",
  "ELSE",
  "EXCEPT",
  "FINALLY",
  "FOR",
  "FROM",
  "GLOBAL",
  "IF",
  "IMPORT",
  "IN",
  "IS",
  "LAMBDA",
  "NONLOCAL",
  "NOT",
  "OR",
  "PASS",
  "RAISE",
  "RETURN",
  "TRY",
  "WHILE",
  "WITH",
  "YIELD",
] as const;

const OtherKeywordTokens = ["FALSE", "NONE", "TRUE"];

export const KeywordTokens = [...StatementKeywordTokens, ...OtherKeywordTokens];

// Convert the array of strings into a union type
type StatementKeywordTokenType = (typeof StatementKeywordTokens)[number];
type OtherKeywordTokenType = (typeof OtherKeywordTokens)[number];
export type KeywordTokenType = StatementKeywordTokenType | OtherKeywordTokenType;

export type TokenType =
  | KeywordTokenType

  // Single-character tokens
  | "COLON"
  | "COMMA"
  | "DOT"
  | "LEFT_BRACE"
  | "LEFT_BRACKET"
  | "LEFT_PAREN"
  | "MINUS"
  | "PERCENT"
  | "PLUS"
  | "RIGHT_BRACE"
  | "RIGHT_BRACKET"
  | "RIGHT_PAREN"
  | "SEMICOLON"
  | "SLASH"
  | "STAR"
  | "EQUAL"

  // Two or more character tokens
  | "DOUBLE_SLASH"
  | "DOUBLE_STAR"
  | "EQUAL_EQUAL"
  | "GREATER_EQUAL"
  | "GREATER"
  | "LESS_EQUAL"
  | "LESS"
  | "NOT_EQUAL"

  // Literals
  | "IDENTIFIER"
  | "NUMBER"
  | "STRING"

  // Invisible tokens
  | "NEWLINE" // End of statement (Python uses newlines)
  | "INDENT" // Indentation increase
  | "DEDENT" // Indentation decrease
  | "EOF"; // End of file

export type Token = SomethingWithLocation & {
  type: TokenType;
  lexeme: string;
  literal: any;
};
