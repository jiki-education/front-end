// Builds the srcdoc document for the preview iframe from the project's files.
// No bundler: each .js file becomes a data: URL, an import map translates the
// project's own paths (and allowed library names) to those URLs, and CSS links
// are inlined. The console shim is injected so output reaches the parent.
//
// data: URLs (not blob:) are load-bearing - the iframe runs sandboxed WITHOUT
// allow-same-origin, so it has an opaque origin, and blob URLs are scoped to
// the creating origin: Chromium refuses to load them in the sandboxed frame.
// data: URLs are origin-less and work everywhere (and need no revocation).

import { CONSOLE_SHIM_SOURCE } from "./consoleShim";
import type { AllowedLibrary, ProjectFiles } from "./types";

export interface BuiltPreview {
  srcdoc: string;
  // Maps generated data: URLs back to project filenames so runtime errors can
  // be attributed to the file the learner knows.
  urlToFile: Record<string, string>;
}

export function buildPreview(files: ProjectFiles, allowedLibraries: AllowedLibrary[]): BuiltPreview {
  const urlToFile: Record<string, string> = {};
  const importMapEntries: Record<string, string> = {};

  for (const [filename, content] of Object.entries(files)) {
    if (!filename.endsWith(".js")) {
      continue;
    }
    const url = moduleDataUrl(content);
    urlToFile[url] = filename;
    for (const specifier of specifierFormsFor(filename)) {
      importMapEntries[specifier] = url;
    }
  }

  for (const library of allowedLibraries) {
    importMapEntries[library.name] = library.path;
  }

  const html = "index.html" in files ? files["index.html"] : missingIndexDocument();
  const srcdoc = assembleDocument(html, files, importMapEntries);

  return { srcdoc, urlToFile };
}

function moduleDataUrl(content: string): string {
  return `data:text/javascript;base64,${base64EncodeUtf8(content)}`;
}

// btoa only handles latin1 - percent-encode to UTF-8 bytes first so emoji etc
// survive. (encodeURIComponent-based rather than TextEncoder so it also runs
// in the jsdom test environment, which lacks TextEncoder.)
function base64EncodeUtf8(text: string): string {
  const utf8 = encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, hex: string) =>
    String.fromCharCode(parseInt(hex, 16))
  );
  return btoa(utf8);
}

// A file can be imported as "./main.js", "main.js" or "/main.js" - map all
// three so beginners' (and models') import styles all resolve.
function specifierFormsFor(filename: string): string[] {
  return [`./${filename}`, filename, `/${filename}`];
}

function assembleDocument(html: string, files: ProjectFiles, importMapEntries: Record<string, string>): string {
  let document = html;

  // Inline stylesheet links that point at project files.
  document = document.replace(/<link\b[^>]*href=["']\.?\/?([^"']+)["'][^>]*>/gi, (match, href: string) =>
    href in files && /rel=["']stylesheet["']/i.test(match) ? styleTag(files[href]) : match
  );

  // Point script tags at the data: URL for the referenced project file and
  // force them to be modules so import statements work.
  document = document.replace(/<script\b[^>]*\bsrc=["']\.?\/?([^"']+)["'][^>]*><\/script>/gi, (match, src: string) => {
    if (!(src in files) || !(src in importMapEntries)) {
      return match;
    }
    return `<script type="module" src="${importMapEntries[src]}"></script>`;
  });

  const injection = `<script type="importmap">${JSON.stringify({ imports: importMapEntries })}</script>\n<script>${CONSOLE_SHIM_SOURCE}</script>`;

  // The import map must come before any module scripts, so inject at the very
  // start of <head>, falling back to prefixing the document.
  if (/<head[^>]*>/i.test(document)) {
    return document.replace(/<head[^>]*>/i, (match) => `${match}\n${injection}`);
  }
  return `${injection}\n${document}`;
}

function styleTag(css: string): string {
  return `<style>\n${css}\n</style>`;
}

function missingIndexDocument(): string {
  return `<!doctype html><html><head></head><body><p style="font-family: sans-serif; color: #666; padding: 16px;">This project needs an <code>index.html</code> file.</p></body></html>`;
}
