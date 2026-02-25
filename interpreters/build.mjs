/* global process */
import { build, context } from "esbuild";
import { writeFileSync } from "fs";

const isWatch = process.argv.includes("--watch");

const commonOptions = {
  bundle: true,
  format: "esm",
  platform: "browser",
  external: ["i18next"],
};

const entries = [
  { entryPoints: ["src/index.ts"], outfile: "dist/index.js" },
  { entryPoints: ["src/entry-shared.ts"], outfile: "dist/shared.js" },
  {
    entryPoints: ["src/entry-jikiscript.ts"],
    outfile: "dist/jikiscript.js",
  },
  {
    entryPoints: ["src/entry-javascript.ts"],
    outfile: "dist/javascript.js",
  },
  { entryPoints: ["src/entry-python.ts"], outfile: "dist/python.js" },
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
  writeFileSync("dist/shared.d.ts", 'export * from "./entry-shared.js";\n');
  writeFileSync("dist/jikiscript.d.ts", 'export * from "./entry-jikiscript.js";\n');
  writeFileSync("dist/javascript.d.ts", 'export * from "./entry-javascript.js";\n');
  writeFileSync("dist/python.d.ts", 'export * from "./entry-python.js";\n');
}
