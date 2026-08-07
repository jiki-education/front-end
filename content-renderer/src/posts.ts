/**
 * The second of this package's two Markdown pipelines: Jiki's **posts**, meaning
 * blog posts, articles, guides and project episodes.
 *
 * ## Why this is not `renderMarkdown`
 *
 * The obvious move is one renderer for all prose. It is the wrong move, because
 * these two pipelines genuinely disagree, and forcing them together would mean
 * changing the bytes of a corpus that is already published:
 *
 * | | concept pages (`renderMarkdown`) | posts (`renderPost`) |
 * |---|---|---|
 * | footnotes | no | yes, via `marked-footnote` |
 * | grammars | `jikiscript`, Jiki's `javascript` | stock `html`/`xml`/`css`/`javascript`/`js`/`bash`/`shell`/`json` |
 * | unknown fence | escaped by hand into a bare `<pre><code>` | handed back to `marked`'s own default |
 * | images | none | `/images/...` refs rewritten to fingerprinted URLs |
 *
 * The `javascript` grammar is the sharpest of these: concepts highlight with
 * `@jiki/highlightjs-javascript`, which is Jiki's own and deliberately different
 * from the stock one posts use. One renderer would have to pick, and either
 * choice rewrites thousands of published bytes.
 *
 * So the package exports two renderers rather than one. What it does NOT do is
 * let a second copy of either configuration exist anywhere. That is the whole
 * point: `marked.use()` mutates a global, `hljs.registerLanguage` mutates a
 * global, and both configurations previously lived in scripts that could drift
 * apart, or worse, contaminate each other inside one process. Here each pipeline
 * owns a private instance, and both repos import them.
 *
 * ## Images
 *
 * A post may reference `/images/foo.webp`, which is authored in the `content`
 * package and served fingerprinted and immutable. The rewrite happens on the
 * Markdown, before parsing, so it is inside the byte contract and cannot be
 * bolted on by one publisher and not the other. Resolving a ref to bytes is NOT
 * this package's job (the two repos reach the image bytes by different routes),
 * so the caller injects a resolver and `postImageUrl` fixes the URL both must
 * produce.
 */

import { Marked } from "marked";
import markedFootnote from "marked-footnote";
import hljs from "highlight.js/lib/core";
import xml from "highlight.js/lib/languages/xml";
import cssLanguage from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import { contentHash, stripInlineTags } from "./shared.js";

/**
 * The highlight.js instance posts are highlighted with: a private core instance
 * carrying the stock web grammars, under the aliases the authored corpus fences
 * with. Registering or dropping one here moves the hash of every post that
 * fences that language, so the set is part of the version contract.
 */
const highlighter = hljs.newInstance();

highlighter.registerLanguage("html", xml);
highlighter.registerLanguage("xml", xml);
highlighter.registerLanguage("css", cssLanguage);
highlighter.registerLanguage("javascript", javascript);
highlighter.registerLanguage("js", javascript);
highlighter.registerLanguage("bash", bash);
highlighter.registerLanguage("shell", bash);
highlighter.registerLanguage("json", json);

/** Every grammar registered for posts, sorted. Exposed so tests can assert the set. */
export function registeredPostLanguages(): string[] {
  return [...highlighter.listLanguages()].sort();
}

const renderer = new Marked()
  .use(markedFootnote())
  .use({
    renderer: {
      code({ text, lang }) {
        // The fence info string may carry more than a language ("js title=x"),
        // and is matched case-insensitively. Returning `false` hands the block
        // back to marked's own default renderer, which is what an unrecognised
        // language must get: that default escapes and wraps it, and reproducing
        // that by hand is how two publishers end up one entity-escape apart.
        const language = (lang || "").split(/\s+/)[0].toLowerCase();
        if (!language || !highlighter.getLanguage(language)) return false;
        const highlighted = highlighter.highlight(text, { language }).value;
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>\n`;
      }
    }
  })
  .use({
    hooks: {
      // Runs before the caller hashes the result, so the hash is over the
      // shipped bytes. Shared with the concept pipeline: the `<define>` and
      // `<literal>` authoring tags mean the same thing in both, and a post that
      // rendered them literally while a concept stripped them would be the exact
      // divergence this package exists to prevent.
      postprocess(html: string) {
        return stripInlineTags(html);
      }
    }
  });

/** Resolve an authored `/images/...` reference to the URL the rendered HTML must carry. */
export type ResolveImage = (ref: string) => string;

/**
 * The fingerprinted public URL of a post image.
 *
 * Both repos must produce this string character for character, because it lands
 * inside the HTML whose hash becomes the filename. `relPath` is the path below
 * `/images/` as authored; `hash` is `contentHash` of the image bytes.
 */
export function postImageUrl(relPath: string, hash: string): string {
  const ext = extensionOf(relPath);
  return `/static/content/images/${relPath.slice(0, relPath.length - ext.length)}-${hash}${ext}`;
}

/** `postImageUrl` from the bytes themselves, for a caller that has them to hand. */
export function postImageUrlFromBytes(relPath: string, bytes: Uint8Array): string {
  return postImageUrl(relPath, contentHash(bytes));
}

function extensionOf(relPath: string): string {
  const dot = relPath.lastIndexOf(".");
  const slash = relPath.lastIndexOf("/");
  return dot > slash ? relPath.slice(dot) : "";
}

/**
 * Rewrite `/images/...` references to their fingerprinted URLs.
 *
 * Covers Markdown images and raw `<img src="...">`, the latter because posts use
 * `<figure>`/`<figcaption>` HTML for captioned images. Anything not starting
 * `/images/` is left exactly as authored.
 */
export function rewriteImageRefs(markdown: string, resolveImage: ResolveImage): string {
  const resolve = (ref: string) => (ref.startsWith("/images/") ? resolveImage(ref) : ref);
  return markdown
    .replace(
      /!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g,
      (_match, alt: string, ref: string) => `![${alt}](${resolve(ref)})`
    )
    .replace(
      /(<img\b[^>]*\bsrc=")(\/images\/[^"]+)(")/g,
      (_match, pre: string, ref: string, post: string) => `${pre}${resolve(ref)}${post}`
    );
}

/**
 * Render a post's Markdown BODY to the exact HTML Jiki serves.
 *
 * Frontmatter must already be stripped, for the same reason as `renderMarkdown`:
 * the two repos parse it differently on purpose and it never reaches the bytes.
 *
 * `resolveImage` is required rather than optional. A post whose images silently
 * rendered as unfingerprinted `/images/...` would be a broken page served under
 * a hash that looks perfectly healthy, so a caller that cannot resolve images
 * must say so at the call site instead of getting a plausible wrong answer.
 */
export function renderPost(markdown: string, { resolveImage }: { resolveImage: ResolveImage }): string {
  return renderer.parse(rewriteImageRefs(markdown, resolveImage), { async: false }) as string;
}
