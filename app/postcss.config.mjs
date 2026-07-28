import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// postcss-import runs FIRST so `@import "./x.module.css"` barrel files are
// inlined before Next's CSS-Modules loader scopes them — otherwise the imported
// classes land in the wrong scope and resolve to undefined. This inlining used to
// come from @tailwindcss/postcss, which was removed with Tailwind.
//
// The rewrite plugin fingerprints CSS `url("/static/...")` refs via the manifest
// from scripts/generate-css-asset-hashes.js so the synced /static tree can be
// served immutable. Referenced by an ABSOLUTE path string: Next.js rejects inline
// plugin objects, and turbopack (next dev) resolves a relative "./" plugin path
// from a different base than webpack, so it must be absolute to load in both.
// Covers app and curriculum CSS (both flow through this pipeline).
const config = {
  plugins: [
    "postcss-import",
    path.join(__dirname, "postcss-plugins/rewrite-static-css-urls.cjs"),
    path.join(__dirname, "postcss-plugins/shorthand-physical-to-logical.cjs")
  ]
};

export default config;
