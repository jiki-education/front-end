/**
 * The pieces both pipelines use.
 *
 * They live in their own module rather than in `index.ts` because `posts.ts`
 * needs them and `index.ts` re-exports `posts.ts`. Importing them from the
 * barrel would make the two modules mutually dependent, and each of them
 * constructs a `Marked` instance at module scope, so a cycle would make that
 * construction depend on which module the host imported first. That is precisely
 * the class of order-dependent bug this package was built to remove, so the
 * package does not get to have one internally either.
 */

import { createHash } from "node:crypto";

/**
 * Custom inline tags the authored English may carry.
 *
 * `<define>` and `<literal>` are authoring conventions, not output: they mark a
 * term being defined and a string meant to be read literally, for the benefit of
 * translators and of tooling that reads the source. They are stripped from the
 * shipped bytes, keeping their inner text, so nothing renders them and nothing
 * has to know about them downstream.
 *
 * Translated files are already tag-free (translators receive the stripped text),
 * so the strip is a no-op for every locale but English. It still runs for all of
 * them, because a rule that only runs on one input is a rule that is only tested
 * on one input.
 */
const INLINE_TAGS = /<\/?(?:define|literal)(?:\s[^>]*)?>/gi;

/** Remove `<define>`/`<literal>` tags, keeping their inner text. */
export function stripInlineTags(text: string): string {
  return text.replace(INLINE_TAGS, "");
}

/**
 * The cache tree's content fingerprint: the first 12 hex chars of the SHA-256 of
 * the exact bytes written.
 *
 * It lives here because it is the other half of the same contract. A publisher
 * that renders identical bytes but fingerprints them differently writes the
 * right content to the wrong URL, which is the same outage.
 */
export function contentHash(content: string | Uint8Array): string {
  return createHash("sha256").update(content).digest("hex").slice(0, 12);
}
