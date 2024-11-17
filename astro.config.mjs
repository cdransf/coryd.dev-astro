import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";

export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [react()],
  vite: {
    build: {
      sourcemap: false,
    },
    optimizeDeps: {
      include: ["@tabler/icons-react"],
    },
    resolve: {
      alias: {
        "@cdransf": "node_modules/@cdransf",
        "@components": "/src/components",
        "@data": "/src/utils/data",
        "@layouts": "/src/layouts",
        "@scripts": "/src/scripts",
        "@styles": "/src/styles",
        "@utils": "/src/utils",
      },
    },
  },
});
