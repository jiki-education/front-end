/* global process */
import { build, context } from "esbuild";
import { existsSync, renameSync, rmSync, writeFileSync } from "fs";

const isWatch = process.argv.includes("--watch");

// Stage the full build in a temp dir and atomically swap it into `dist` at the
// end (`--swap`), so there's never a window where `dist/*.js` are absent while a
// live dev server (turbopack) is resolving them. Requires `--outdir` to point at
// a staging dir distinct from `dist`.
const swap = process.argv.includes("--swap");
const outdirFlagIndex = process.argv.indexOf("--outdir");
const outDir = outdirFlagIndex !== -1 ? process.argv[outdirFlagIndex + 1] : "dist";

if (swap && outDir === "dist") {
  throw new Error("--swap requires a staging --outdir distinct from 'dist'");
}

const commonOptions = {
  bundle: true,
  format: "esm",
  platform: "browser",
  external: ["i18next"],
};

const entries = [
  { entryPoints: ["src/index.ts"], outfile: `${outDir}/index.js` },
  { entryPoints: ["src/entry-shared.ts"], outfile: `${outDir}/shared.js` },
  {
    entryPoints: ["src/entry-jikiscript.ts"],
    outfile: `${outDir}/jikiscript.js`,
  },
  {
    entryPoints: ["src/entry-javascript.ts"],
    outfile: `${outDir}/javascript.js`,
  },
  { entryPoints: ["src/entry-python.ts"], outfile: `${outDir}/python.js` },
];

if (isWatch) {
  for (const entry of entries) {
    const ctx = await context({ ...commonOptions, ...entry });
    await ctx.watch();
  }
} else {
  await Promise.all(entries.map(entry => build({ ...commonOptions, ...entry })));

  // Generate declaration re-export files for subpath exports.
  // tsc already generates entry-*.d.ts from the source files, so we just
  // re-export from those to match the package.json export paths.
  writeFileSync(`${outDir}/shared.d.ts`, 'export * from "./entry-shared.js";\n');
  writeFileSync(`${outDir}/jikiscript.d.ts`, 'export * from "./entry-jikiscript.js";\n');
  writeFileSync(`${outDir}/javascript.d.ts`, 'export * from "./entry-javascript.js";\n');
  writeFileSync(`${outDir}/python.d.ts`, 'export * from "./entry-python.js";\n');

  if (swap) {
    // Swap the freshly-built staging dir into `dist`. The only moment `dist`
    // doesn't exist is between the two renames below — a single rename apart
    // (sub-millisecond) rather than the whole build.
    rmSync("dist-old", { recursive: true, force: true });
    if (existsSync("dist")) {
      renameSync("dist", "dist-old");
    }
    renameSync(outDir, "dist");
    rmSync("dist-old", { recursive: true, force: true });
  }
}
