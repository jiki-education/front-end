import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ["./tests/vitest-setup.ts", "./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@jikiscript": path.resolve(__dirname, "./src/jikiscript"),
      "@javascript": path.resolve(__dirname, "./src/javascript"),
      "@python": path.resolve(__dirname, "./src/python"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
