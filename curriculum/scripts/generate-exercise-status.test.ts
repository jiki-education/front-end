/**
 * Generates a static HTML page showing the status of all exercises.
 *
 * Displays: slug, title, instructions (description), and conceptSlugs.
 * Run via: pnpm vitest run scripts/generate-exercise-status.test.ts
 */

import { it } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exercises } from "../src/exercises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "exercise-status.html");

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

it("generates exercise-status.html", async () => {
  const data: {
    slug: string;
    conceptSlugs: string[];
  }[] = [];

  for (const [slug, loader] of Object.entries(exercises)) {
    const mod = await loader();
    const def = mod.default;
    data.push({
      slug,
      conceptSlugs: def.conceptSlugs ?? []
    });
  }

  data.sort((a, b) => a.slug.localeCompare(b.slug));

  const rows = data
    .map(
      (ex, i) => `
      <tr>
        <td class="num">${i + 1}</td>
        <td class="slug">${escapeHtml(ex.slug)}</td>
        <td>${ex.conceptSlugs.map((c) => `<span class="concept">${escapeHtml(c)}</span>`).join(" ")}</td>
      </tr>`
    )
    .join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Exercise Status</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 24px; background: #f8f9fa; color: #1a1a1a; }
  h1 { margin-bottom: 8px; }
  .count { color: #666; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
  th, td { padding: 10px 14px; text-align: left; border-bottom: 1px solid #eee; vertical-align: top; }
  th { background: #f1f3f5; font-weight: 600; position: sticky; top: 0; }
  tr:hover { background: #f8f9fa; }
  .num { color: #999; text-align: right; width: 40px; }
  .slug { font-family: monospace; white-space: nowrap; }
  .desc { max-width: 500px; font-size: 0.9em; color: #444; }
  .concept { display: inline-block; background: #e7f5ff; color: #1971c2; padding: 2px 8px; border-radius: 12px; font-size: 0.8em; margin: 1px 2px; }
</style>
</head>
<body>
<h1>Exercise Status</h1>
<p class="count">${data.length} exercises</p>
<table>
  <thead>
    <tr><th>#</th><th>Slug</th><th>Concepts</th></tr>
  </thead>
  <tbody>
${rows}
  </tbody>
</table>
</body>
</html>`;

  fs.writeFileSync(OUTPUT_PATH, html);
  // eslint-disable-next-line no-console
  console.log(`Generated exercise-status.html (${data.length} exercises)`);
});
