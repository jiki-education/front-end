import type { Translator } from "@jiki/curriculum";

interface ResolvableCheck {
  errorKey: string;
  errorParams?: Record<string, unknown>;
}

/**
 * Resolve a codeCheck's failure message. codeChecks have no exercise instance in
 * scope, so the runner resolves their curriculum-owned key against the exercise's
 * injected message dict (via a translator built from it).
 */
export function resolveCodeCheckError(check: ResolvableCheck, t: Translator): string {
  return t(check.errorKey, check.errorParams);
}
