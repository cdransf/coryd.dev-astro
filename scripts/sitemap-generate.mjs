import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PAGE_SIZE = 1000;

async function fetchPaginatedData() {
  let allEntries = [];
  let currentPage = 0;

  while (true) {
    const { data, error } = await supabase
      .from("optimized_sitemap")
      .select("url, title, lastmod, changefreq, priority")
      .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

    if (error) throw new Error(`Error fetching sitemap data: ${error.message}`);

    if (!data || data.length === 0) break;

    allEntries = allEntries.concat(data);
    currentPage += 1;
  }

  return allEntries;
}

async function generateSitemap() {
  try {
    const data = await fetchPaginatedData();

    const sitemapEntries = data.map((entry) => ({ loc: entry.url }));

    writeFileSync(
      "src/utils/data/static/sitemapData.json",
      JSON.stringify(sitemapEntries, null, 2),
      "utf8"
    );

    console.log("Sitemap data generated successfully!");
  } catch (error) {
    console.error("Error generating sitemap:", error);
  }
}

generateSitemap();
