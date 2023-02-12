import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: { sourcemap: true },
  server: {
    port: 60005,
    strictPort: true,
    proxy: {
      "/__api": {
        target: "http://localhost:60001",
        changeOrigin: true,
      },
    },
  },
  plugins: [react()],
});
