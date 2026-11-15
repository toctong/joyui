import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    css: false,
    globals: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/components/**/*.{ts,tsx}", "src/utils/**/*.{ts,tsx}"],
      exclude: ["**/*.test.*", "**/test/**"],
    },
  },
  resolve: {
    alias: {
      "@joyui/react": path.resolve(rootDir, "./src"),
    },
  },
});
