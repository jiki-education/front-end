import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  RENDERER_VERSION,
  contentHash,
  prepareInstructions,
  registeredLanguages,
  renderMarkdown,
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
