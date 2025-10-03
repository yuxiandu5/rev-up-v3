import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment - 'node' for API routes, 'jsdom' for React components
    environment: "node",

    // Where to find test files
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    // Global test setup file (we'll create this next)
    setupFiles: ["./tests/setup.ts"],

    // Test timeout (30 seconds for database operations)
    testTimeout: 30000,

    // Run tests in sequence (important for database tests)
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  resolve: {
    // Path aliases - same as your Next.js config
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
