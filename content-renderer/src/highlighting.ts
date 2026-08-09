import hljs from "highlight.js/lib/core";
import setupJikiscript from "@exercism/highlightjs-jikiscript";
import setupJavascript from "@jiki/highlightjs-javascript";

/**
 * The highlight.js instance curriculum prose is highlighted with.
 *
 * It is a private core instance carrying exactly two grammars, both of them
 * Jiki's own: `jikiscript` and a Jiki-specific `javascript` that differs from
 * highlight.js's stock one. Nothing else is registered, so a fenced block in an
 * unknown language falls through to the plain-text branch in `renderMarkdown`
 * rather than picking up whichever grammars some other part of the process
 * happened to register on a shared singleton.
 *
 * Language set and grammar versions are part of the byte contract: registering a
 * language here changes the HTML of every document that fences it, and so moves
 * its content hash. That is why the grammar packages are pinned exactly and why
 * this package's version is what the two repos agree on.
 */
const highlighter = hljs.newInstance();

highlighter.registerLanguage("jikiscript", setupJikiscript);
highlighter.registerLanguage("javascript", setupJavascript);

/** Whether a fenced block's language has a grammar registered here. */
export function isSupportedLanguage(lang: string | undefined | null): boolean {
  return Boolean(lang && highlighter.getLanguage(lang));
}

/** Highlight source to hljs markup. Only call for a supported language. */
export function highlight(code: string, language: string): string {
  return highlighter.highlight(code, { language }).value;
}

/** Every grammar registered here, sorted. Exposed so tests can assert the set. */
export function registeredLanguages(): string[] {
  return [...highlighter.listLanguages()].sort();
}
