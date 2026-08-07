/**
 * @jiki.io/content-renderer — the one implementation of "Jiki curriculum prose
 * to the exact bytes Jiki serves".
 *
 * ## Why this is a package
 *
 * Jiki's English prose is authored in the front-end monorepo and its
 * translations live in the separate `i18n` repo. Both publish the results to the
 * same content-hashed R2 tree, where an artifact's filename IS the hash of its
 * bytes. So the two repos do not merely need to render similar HTML, they need
 * to render byte-identical HTML for identical input, or a translated page is
 * simply unreachable at the URL the front-end computed.
 *
 * A second implementation in `i18n` would be two renderers drifting apart, and
 * the drift would surface as a wrong-looking page rather than as an error. So
 * there is one implementation, here, and **the package version is the contract**:
 * both repos pin it, and a rendering change is a version bump that both sides
 * take deliberately.
 *
 * ## The two prose pipelines
 *
 * Jiki's two prose types are cached differently, and this package covers both
 * because both are byte-sensitive:
 *
 * - **Concept pages** are rendered to HTML at build time and served as
 *   `content-{hash}.html`. `renderMarkdown` is that pipeline.
 * - **Exercise instructions** are cached as Markdown inside a JSON content file
 *   and rendered by the browser at runtime, so the build-time step is only the
 *   inline-tag strip. `prepareInstructions` is that pipeline.
 *
 * Both share `stripInlineTags`, which is the whole reason they can disagree, and
 * historically the reason they were easy to get subtly wrong in two places.
 */

import { createHash } from "node:crypto";
import { Marked } from "marked";
import { highlight, isSupportedLanguage } from "./highlighting.js";

export { isSupportedLanguage, registeredLanguages } from "./highlighting.js";

/**
 * This package's version, recorded in published artifact metadata by both
 * repos. A byte mismatch between two publishers is then diagnosable after the
 * fact from the artifacts themselves, rather than only reproducible locally.
 *
 * Kept as a literal rather than read from package.json so the package works
 * identically from source, from `dist`, and from a bundler that will not import
 * JSON. A test asserts it against package.json, so the duplication cannot drift.
 */
export const RENDERER_VERSION = "0.1.0";

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
 * A private `marked` instance, never the module-level `marked` singleton.
 *
 * `marked.use()` mutates a global, so a singleton makes the output of any one
 * caller depend on which other callers ran first in the same process. That is
 * exactly the failure this package exists to remove, and it is not hypothetical:
 * the front-end's blog pipeline configures `marked` with footnotes and a
 * different set of highlight.js grammars. An instance means the concept bytes
 * are a function of the input alone.
 */
const renderer = new Marked({
  renderer: {
    code({ text, lang }) {
      const language = lang && isSupportedLanguage(lang) ? lang : null;
      const highlighted = language
        ? highlight(text, language)
        : text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const className = language ? ` class="hljs language-${language}"` : "";
      return `<pre><code${className}>${highlighted}</code></pre>\n`;
    }
  },
  hooks: {
    // Runs before the caller hashes the result, so the hash is over the shipped
    // bytes rather than over an intermediate that still carries the tags.
    postprocess(html: string) {
      return stripInlineTags(html);
    }
  }
});

/**
 * Render curriculum Markdown to the exact HTML Jiki serves for a concept page.
 *
 * Input is the Markdown BODY, with any frontmatter already removed. Frontmatter
 * parsing is deliberately not this package's job: the two repos parse it
 * differently on purpose (the front-end uses gray-matter, `i18n` keeps its
 * scripts dependency-free), and it never reaches the rendered bytes.
 */
export function renderMarkdown(markdown: string): string {
  return renderer.parse(markdown, { async: false }) as string;
}

/**
 * Prepare exercise instructions for caching.
 *
 * Instructions are cached as Markdown and rendered in the browser at runtime, so
 * there is no build-time `marked` pass to hang the inline-tag strip off. It
 * happens here instead, along with the trim, and the result is what gets hashed.
 */
export function prepareInstructions(markdown: string): string {
  return stripInlineTags(markdown.trim());
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
