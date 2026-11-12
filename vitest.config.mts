import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // Next.js aliases `server-only` to an empty module; Vitest must do the
      // same, otherwise importing a server module from a test throws.
      "server-only": fileURLToPath(
        new URL("./src/tests/server-only-stub.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    pool: "vmThreads",
    setupFiles: ["./src/tests/setup.ts"],
    globals: true,
  },
});
