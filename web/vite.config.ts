import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  build: { sourcemap: true },
  envDir: "..",
  server: {
    port: 60005,
    strictPort: true,
  },
  plugins: [react()],
});
