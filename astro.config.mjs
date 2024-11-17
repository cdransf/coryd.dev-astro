import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://coryd.dev",
  output: "server",
  adapter: cloudflare(),
  integrations: [preact(), sitemap()],
  vite: {
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          ecma: 2020,
          passes: 3,
          module: true,
          toplevel: true,
        },
        mangle: {
          safari10: true,
          properties: {
            regex: /^_/,
          },
        },
        format: {
          comments: false,
          ascii_only: true,
        },
      },
      sourcemap: false,
      rollupOptions: {
        treeshake: true,
        external: ["/js/script.js"],
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("preact")) return "preact-vendor";
              if (id.includes("@supabase")) return "supabase-vendor";
              if (id.includes("highlight.js")) return "highlight-vendor";
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        "@astrojs/sitemap",
        "date-fns",
        "highlight.js",
        "minisearch",
        "preact",
        "preact/hooks",
        "@supabase/supabase-js",
        "@tabler/icons-preact",
      ],
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
