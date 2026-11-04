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

  // `foo(x y)` and `[x y]` are missing commas, which the parser reports itself
  if (startsArgumentOrElement(tokens, index)) {
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

// True when the token at `index` is the first token of a function argument or
// array element: it follows a `,`, a `[`, or the `(` of a call. The `(` of
// `for (`, `if (` or a function declaration does not count, so
// `for (cons x of xs)` still gets a suggestion.
function startsArgumentOrElement(tokens: Token[], index: number): boolean {
  const previousIndex = previousSignificantIndex(tokens, index - 1);
  if (previousIndex === null) {
    return false;
  }

  const previous = tokens[previousIndex];
  if (previous.type === "COMMA" || previous.type === "LEFT_BRACKET") {
    return true;
  }
  if (previous.type !== "LEFT_PAREN") {
    return false;
  }

  const beforeParenIndex = previousSignificantIndex(tokens, previousIndex - 1);
  if (beforeParenIndex === null) {
    return false;
  }
  const beforeParen = tokens[beforeParenIndex].type;
  if (beforeParen === "RIGHT_PAREN" || beforeParen === "RIGHT_BRACKET") {
    return true;
  }
  if (beforeParen !== "IDENTIFIER") {
    return false;
  }

  // `function foo(a b)` is a parameter list, not a call
  const beforeNameIndex = previousSignificantIndex(tokens, beforeParenIndex - 1);
  return beforeNameIndex === null || tokens[beforeNameIndex].type !== "FUNCTION";
}

function previousSignificantIndex(tokens: Token[], from: number): number | null {
  for (let i = from; i >= 0; i--) {
    if (!SKIPPABLE_TOKENS.has(tokens[i].type)) {
      return i;
    }
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
