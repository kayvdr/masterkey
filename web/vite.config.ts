import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: { sourcemap: true },
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
  plugins: [react()],
}));
