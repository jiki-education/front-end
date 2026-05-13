import { preParseAdjacentIdentifiers } from "./preParseAdjacentIdentifiers";
import type { Token } from "./token";

export const STATEMENT_BOUNDARY_TOKENS = new Set(["EOL", "SEMICOLON", "LEFT_BRACE", "RIGHT_BRACE"]);
export const SKIPPABLE_TOKENS = new Set(["LINE_COMMENT", "BLOCK_COMMENT"]);

export function preParse(tokens: Token[]): void {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "IDENTIFIER") {
      preParseAdjacentIdentifiers(tokens, i);
    }
  }
}
