import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The rewrite plugin fingerprints CSS `url("/static/...")` refs via the manifest
// from scripts/generate-css-asset-hashes.js so the synced /static tree can be
// served immutable. Referenced by an ABSOLUTE path string: Next.js rejects inline
// plugin objects, and turbopack (next dev) resolves a relative "./" plugin path
// from a different base than webpack, so it must be absolute to load in both.
// Covers app and curriculum CSS (both flow through this pipeline).
const config = {
  plugins: ["@tailwindcss/postcss", path.join(__dirname, "postcss-plugins/rewrite-static-css-urls.cjs")]
};

export default config;
