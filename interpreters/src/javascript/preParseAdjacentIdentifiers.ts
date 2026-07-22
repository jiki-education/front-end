import { Location } from "../shared/location";
import { levenshtein } from "../shared/levenshtein";
import { SyntaxError, type SyntaxErrorType } from "./error";
import { STATEMENT_BOUNDARY_TOKENS, SKIPPABLE_TOKENS } from "./preParse";
import type { Token } from "./token";
import type { Translator } from "../shared/i18n";

const DECLARATION_KEYWORDS = ["let", "const"] as const;

export function preParseAdjacentIdentifiers(tokens: Token[], index: number, translator: Translator): void {
  const current = tokens[index];

  const next = nextSignificantToken(tokens, index + 1);
  if (!next || next.type !== "IDENTIFIER") {
    return;
  }

  const suggestion = suggestDeclarationKeyword(current.lexeme);
  if (suggestion !== null) {
    throwSyntaxError("MissingDeclarationKeywordWithSuggestion", current.location, translator, {
      name: current.lexeme,
      suggestion,
    });
  }
  throwSyntaxError("UnexpectedDoubleIdentifier", Location.between(current, next), translator, {
    first: current.lexeme,
    second: next.lexeme,
  });
}

function nextSignificantToken(tokens: Token[], from: number): Token | null {
  for (let i = from; i < tokens.length; i++) {
    const token = tokens[i];
    if (STATEMENT_BOUNDARY_TOKENS.has(token.type)) {
      return null;
    }
    if (SKIPPABLE_TOKENS.has(token.type)) {
      continue;
    }
    return token;
  }
  return null;
}

function suggestDeclarationKeyword(lexeme: string): string | null {
  let best: string | null = null;
  let bestDistance = Infinity;
  for (const keyword of DECLARATION_KEYWORDS) {
    const distance = levenshtein(lexeme, keyword);
    if (distance < bestDistance && distance <= 2 && distance > 0) {
      best = keyword;
      bestDistance = distance;
    }
  }
  return best;
}

function throwSyntaxError(
  type: SyntaxErrorType,
  location: Location,
  translator: Translator,
  context: Record<string, unknown>
): never {
  throw new SyntaxError(translator(`error.syntax.${type}`, context), location, type, context);
}
