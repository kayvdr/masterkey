import react from "@vitejs/plugin-react-swc";
import { defineConfig, UserConfigExport } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const baseConfig: UserConfigExport = {
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
  };

  // Use different favicon in dev environment
  if (command === "serve") {
    const config: UserConfigExport = {
      ...baseConfig,
      publicDir: "public-dev",
    };

    return config;
  }

  return baseConfig;
});
