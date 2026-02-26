import { defineConfig } from "vitest/config";
import fs from "fs";

export default defineConfig({
  plugins: [
    {
      name: "raw-md",
      transform(_code, id) {
        if (id.endsWith(".md")) {
          const content = fs.readFileSync(id, "utf-8");
          return `export default ${JSON.stringify(content)}`;
        }
      }
    }
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./tests/setup.ts"
  },
  assetsInclude: ["**/*.javascript", "**/*.py", "**/*.jiki"]
});
