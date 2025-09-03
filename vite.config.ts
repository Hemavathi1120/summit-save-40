import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Created by HEMAVATHI from Dream Team Services

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Custom component tagging removed - Created by HEMAVATHI from Dream Team Services
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
