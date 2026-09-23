import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: process.env.SITE_URL ?? "https://studiotche.github.io",
  base: process.env.PAGES_BASE ?? "/oficina-mecanica-stormautomotive",
  output: "static",
  integrations: [sitemap()],
  build: { format: "directory" },
});
