import { preParseAdjacentIdentifiers } from "./preParseAdjacentIdentifiers";
import type { Token } from "./token";

export function preParse(tokens: Token[]): void {
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "IDENTIFIER") {
      preParseAdjacentIdentifiers(tokens, i);
    }
  }
}
