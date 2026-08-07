import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  RENDERER_VERSION,
  contentHash,
  postImageUrl,
  prepareInstructions,
  registeredLanguages,
  registeredPostLanguages,
  renderMarkdown,
  renderPost,
  rewriteImageRefs,
  stripInlineTags
} from "../src/index.js";

const packageRoot = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

describe("RENDERER_VERSION", () => {
  // The version is the byte-identity contract between the front-end and i18n, and
  // it is also the value both record in artifact metadata. A literal that drifted
  // from package.json would make a mismatch report the wrong version, which is
  // worse than reporting none.
  it("matches package.json", () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, "package.json"), "utf8"));
    expect(RENDERER_VERSION).toBe(pkg.version);
  });
});

describe("registeredLanguages", () => {
  // Registering a grammar changes the HTML of every document that fences it, so
  // the language SET is part of the contract, not an implementation detail.
  it("is exactly jikiscript and javascript", () => {
    expect(registeredLanguages()).toEqual(["javascript", "jikiscript"]);
  });
});

describe("stripInlineTags", () => {
  it("keeps the inner text of define and literal", () => {
    expect(stripInlineTags("a <define>variable</define> holds <literal>1</literal>")).toBe("a variable holds 1");
  });

  it("strips tags carrying attributes", () => {
    expect(stripInlineTags(`<define data-term="loop">loop</define>`)).toBe("loop");
  });

  it("is case insensitive", () => {
    expect(stripInlineTags("<DEFINE>x</Define>")).toBe("x");
  });

  it("leaves other HTML alone", () => {
    expect(stripInlineTags("<strong>x</strong>")).toBe("<strong>x</strong>");
  });

  it("is a no-op on tag-free text, which is every translated file", () => {
    expect(stripInlineTags("egy változó")).toBe("egy változó");
  });
});

describe("renderMarkdown", () => {
  it("renders headings and paragraphs", () => {
    expect(renderMarkdown("# Title\n\nBody text.\n")).toBe("<h1>Title</h1>\n<p>Body text.</p>\n");
  });

  it("highlights a jikiscript fence", () => {
    const html = renderMarkdown("```jikiscript\nset x to 1\n```\n");
    expect(html).toContain(`<pre><code class="hljs language-jikiscript">`);
    expect(html).toContain("hljs-keyword");
  });

  it("highlights a javascript fence", () => {
    const html = renderMarkdown("```javascript\nconst x = 1;\n```\n");
    expect(html).toContain(`<pre><code class="hljs language-javascript">`);
  });

  it("escapes an unknown language rather than highlighting it", () => {
    // Deliberate: only Jiki's own grammars are registered, so a stock
    // highlight.js language is NOT highlighted here even though it exists
    // upstream. Anything else would make the bytes depend on what the host
    // process happened to register.
    const html = renderMarkdown("```ruby\nputs 1 & 2 < 3\n```\n");
    expect(html).toBe("<pre><code>puts 1 &amp; 2 &lt; 3</code></pre>\n");
  });

  it("strips inline tags from the rendered HTML", () => {
    expect(renderMarkdown("A <define>function</define> runs.\n")).toBe("<p>A function runs.</p>\n");
  });

  it("is a pure function of its input", () => {
    const markdown = "# A\n\n```javascript\nconst x = 1;\n```\n";
    expect(renderMarkdown(markdown)).toBe(renderMarkdown(markdown));
  });
});

describe("prepareInstructions", () => {
  it("trims and strips, leaving Markdown for the runtime renderer", () => {
    expect(prepareInstructions("\n\n# Task\n\nUse a <define>loop</define>.\n\n")).toBe("# Task\n\nUse a loop.");
  });
});

describe("contentHash", () => {
  it("is the first 12 hex chars of the SHA-256", () => {
    // sha256("") = e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
    expect(contentHash("")).toBe("e3b0c44298fc");
  });

  it("hashes bytes, so a string and its UTF-8 buffer agree", () => {
    expect(contentHash("árvíztűrő")).toBe(contentHash(Buffer.from("árvíztűrő", "utf8")));
  });
});

describe("posts", () => {
  // The post pipeline is the blog/articles/guides/episodes one. It is a SECOND
  // renderer on purpose, and these assertions are the differences that make it
  // one; if any of them starts matching the concept renderer, one of the two
  // corpora has silently had its bytes rewritten.
  it("registers exactly the stock web grammars", () => {
    expect(registeredPostLanguages()).toEqual(["bash", "css", "html", "javascript", "js", "json", "shell", "xml"]);
  });

  it("renders footnotes, which the concept renderer does not", () => {
    const markdown = "Text[^1]\n\n[^1]: The note.";
    expect(renderPost(markdown, { resolveImage: (r) => r })).toContain("footnote");
    expect(renderMarkdown(markdown)).not.toContain("footnote");
  });

  it("highlights a stock web language the concept renderer does not know", () => {
    const markdown = "```json\n{}\n```";
    expect(renderPost(markdown, { resolveImage: (r) => r })).toContain('class="hljs language-json"');
    expect(renderMarkdown(markdown)).not.toContain("hljs");
  });

  it("takes the language from the first word of the fence info, case-insensitively", () => {
    const html = renderPost("```JSON title=x\n{}\n```", { resolveImage: (r) => r });
    expect(html).toContain('class="hljs language-json"');
  });

  it("hands an unknown fence back to marked's default renderer", () => {
    const html = renderPost("```nope\na < b\n```", { resolveImage: (r) => r });
    expect(html).not.toContain("hljs");
    expect(html).toContain("a &lt; b");
  });

  it("strips the authoring tags, exactly as the concept renderer does", () => {
    expect(renderPost("a <define>term</define>", { resolveImage: (r) => r })).toContain("a term");
  });
});

describe("rewriteImageRefs", () => {
  const resolve = (ref: string) => `/fingerprinted${ref}`;

  it("rewrites markdown images", () => {
    expect(rewriteImageRefs("![alt](/images/a.webp)", resolve)).toBe("![alt](/fingerprinted/images/a.webp)");
  });

  it("rewrites raw img tags, for captioned <figure> markup", () => {
    expect(rewriteImageRefs('<img src="/images/a.webp" alt="x">', resolve)).toBe(
      '<img src="/fingerprinted/images/a.webp" alt="x">'
    );
  });

  it("leaves refs outside /images/ alone", () => {
    expect(rewriteImageRefs("![alt](https://example.com/a.webp)", resolve)).toBe("![alt](https://example.com/a.webp)");
  });

  it("is idempotent, so a caller may rewrite before rendering", () => {
    const once = rewriteImageRefs("![alt](/images/a.webp)", resolve);
    expect(rewriteImageRefs(once, resolve)).toBe(once);
  });
});

describe("postImageUrl", () => {
  it("inserts the hash before the extension", () => {
    expect(postImageUrl("blog/a.webp", "abc123abc123")).toBe("/static/content/images/blog/a-abc123abc123.webp");
  });

  it("appends the hash when there is no extension", () => {
    expect(postImageUrl("blog/a", "abc123abc123")).toBe("/static/content/images/blog/a-abc123abc123");
  });

  it("is not confused by a dot in a directory name", () => {
    expect(postImageUrl("v1.2/a.webp", "abc123abc123")).toBe("/static/content/images/v1.2/a-abc123abc123.webp");
  });
});
