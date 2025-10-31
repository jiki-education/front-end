import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"]
    }
  },
  resolve: {
    alias: {
      "@jiki/curriculum": path.resolve(__dirname, "../curriculum/src")
    }
  }
});
