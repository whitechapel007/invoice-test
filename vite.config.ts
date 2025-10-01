import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom", // Explicitly set jsdom environment
    setupFiles: ["./setupTests.ts"], // Path to setup file
    globals: true, // Optional: Allows describe, it, expect without imports
  },
});
