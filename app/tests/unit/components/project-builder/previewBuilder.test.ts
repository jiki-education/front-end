import { buildPreview } from "@/components/project-builder/lib/previewBuilder";

function extractImportMap(srcdoc: string): Record<string, string> {
  const match = srcdoc.match(/<script type="importmap">(.*?)<\/script>/s);
  expect(match).not.toBeNull();
  return (JSON.parse(match![1]) as { imports: Record<string, string> }).imports;
}

function decodeDataUrl(url: string): string {
  expect(url).toMatch(/^data:text\/javascript;base64,/);
  return Buffer.from(url.split(",")[1], "base64").toString("utf-8");
}

describe("buildPreview", () => {
  const files = {
    "index.html": `<!doctype html><html><head><link rel="stylesheet" href="style.css"></head><body><script type="module" src="main.js"></script></body></html>`,
    "style.css": "body { color: red; }",
    "main.js": `import { greet } from "./lib/util.js"; greet();`,
    "lib/util.js": "export function greet() {}"
  };

  it("maps every js file under all three specifier forms to a data url", () => {
    const preview = buildPreview(files, []);
    const imports = extractImportMap(preview.srcdoc);

    for (const filename of ["main.js", "lib/util.js"]) {
      const url = imports[filename];
      expect(decodeDataUrl(url)).toBe(files[filename as keyof typeof files]);
      expect(imports[`./${filename}`]).toBe(url);
      expect(imports[`/${filename}`]).toBe(url);
    }
  });

  it("survives non-latin content", () => {
    const preview = buildPreview(
      { "index.html": "<html><head></head></html>", "main.js": `console.log("héllo 🎉");` },
      []
    );
    const imports = extractImportMap(preview.srcdoc);
    expect(decodeDataUrl(imports["main.js"])).toContain("héllo 🎉");
  });

  it("maps allowed libraries by bare name", () => {
    const preview = buildPreview(files, [
      { name: "canvas-confetti", path: "/static/vendor/canvas-confetti-1.9.3.mjs" }
    ]);
    const imports = extractImportMap(preview.srcdoc);
    expect(imports["canvas-confetti"]).toBe("/static/vendor/canvas-confetti-1.9.3.mjs");
  });

  it("inlines project stylesheets", () => {
    const preview = buildPreview(files, []);
    expect(preview.srcdoc).toContain("<style>\nbody { color: red; }\n</style>");
    expect(preview.srcdoc).not.toContain('href="style.css"');
  });

  it("rewrites project script tags to data urls as modules", () => {
    const preview = buildPreview(files, []);
    expect(preview.srcdoc).toMatch(/<script type="module" src="data:text\/javascript;base64,[^"]+"><\/script>/);
    expect(preview.srcdoc).not.toContain('src="main.js"');
  });

  it("leaves external links and scripts alone", () => {
    const external = {
      "index.html": `<html><head><link rel="stylesheet" href="https://example.com/x.css"><script src="https://example.com/x.js"></script></head><body></body></html>`
    };
    const preview = buildPreview(external, []);
    expect(preview.srcdoc).toContain('href="https://example.com/x.css"');
    expect(preview.srcdoc).toContain('src="https://example.com/x.js"');
  });

  it("injects the console shim and import map into head", () => {
    const preview = buildPreview(files, []);
    expect(preview.srcdoc).toContain("__jikiProjectBuilder");
    expect(preview.srcdoc.indexOf("importmap")).toBeLessThan(preview.srcdoc.indexOf("main.js"));
  });

  it("records the url-to-file mapping for error attribution", () => {
    const preview = buildPreview(files, []);
    expect(Object.values(preview.urlToFile).sort()).toEqual(["lib/util.js", "main.js"]);
  });

  it("falls back to a placeholder document without index.html", () => {
    const preview = buildPreview({ "main.js": "" }, []);
    expect(preview.srcdoc).toContain("needs an <code>index.html</code>");
  });
});
