import { vitePlugin as remix } from "@remix-run/dev";
import dotenv from "dotenv";
import { defineConfig } from "vite";

dotenv.config({ path: "../.env" });

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: { sourcemap: false },
  envDir: "..",
  css: {
    devSourcemap: true,
    modules: {
      generateScopedName: "[hash:base64:8]",
    },
  },
  server: {
    port: 60000,
    strictPort: true,
    proxy: {
      "/api": {
        target: "http://localhost:60001",
        changeOrigin: true,
      },
    },
  },
  plugins: [remix()],
}));
