import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [react()],
  server: {
    middleware: {
      onRequest: "./src/middleware.js",
    },
  },
  vite: {
    build: {
      sourcemap: false,
    },
    optimizeDeps: {
      include: ["@tabler/icons-react"],
    },
    resolve: {
      alias: {
        "@components": "/src/components",
        "@data": "/src/utils/data",
        "@layouts": "/src/layouts",
        "@npm": "/node_modules",
        "@scripts": "/src/scripts",
        "@styles": "/src/styles",
        "@utils": "/src/utils",
      },
    },
  },
});
