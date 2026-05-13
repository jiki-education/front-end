import { SyntaxError, type SyntaxErrorType } from "./error";
import type { Token } from "./token";
import { translate } from "./translator";

const STATEMENT_BOUNDARY_TOKENS = new Set(["EOL", "SEMICOLON", "LEFT_BRACE", "RIGHT_BRACE"]);
const SKIPPABLE_TOKENS = new Set(["LINE_COMMENT", "BLOCK_COMMENT"]);
const DECLARATION_KEYWORDS = ["let", "const"] as const;

type Rule = (tokens: Token[], index: number) => void;

export function preParse(tokens: Token[]): void {
  const rules: Rule[] = [checkAdjacentIdentifiers];

  for (let i = 0; i < tokens.length; i++) {
    for (const rule of rules) {
      rule(tokens, i);
    }
  }
}

function checkAdjacentIdentifiers(tokens: Token[], i: number): void {
  const current = tokens[i];
  if (current.type !== "IDENTIFIER") {
    return;
  }

  const next = nextSignificantToken(tokens, i + 1);
  if (!next || next.type !== "IDENTIFIER") {
    return;
  }

  const suggestion = suggestDeclarationKeyword(current.lexeme);
  if (suggestion !== null) {
    throwSyntaxError("MissingDeclarationKeywordWithSuggestion", current, {
      name: current.lexeme,
      suggestion,
    });
  }
  throwSyntaxError("MissingDeclarationKeyword", current, { name: current.lexeme });
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

function levenshtein(a: string, b: string): number {
  if (a === b) {
    return 0;
  }
  const m = a.length;
  const n = b.length;
  if (m === 0) {
    return n;
  }
  if (n === 0) {
    return m;
  }
  const prev = new Array<number>(n + 1);
  const curr = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) {
    prev[j] = j;
  }
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) {
      prev[j] = curr[j];
    }
  }
  return prev[n];
}

function throwSyntaxError(type: SyntaxErrorType, token: Token, context: Record<string, unknown>): never {
  throw new SyntaxError(translate(`error.syntax.${type}`, context), token.location, type, context);
}
