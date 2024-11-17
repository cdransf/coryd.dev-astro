import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedLinks = null;
let lastFetchTime = 0;

export async function fetchLinks() {
  const now = Date.now();

  if (cachedLinks && now - lastFetchTime < CACHE_DURATION) return cachedLinks;

  const PAGE_SIZE = 1000;
  let links = [];
  let page = 0;
  let fetchMore = true;

  try {
    while (fetchMore) {
      const { data, error } = await supabase
        .from("optimized_links")
        .select("*")
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching links:", error);
        return cachedLinks || links;
      }

      if (data.length < PAGE_SIZE) fetchMore = false;

      links = links.concat(data);
      page++;
    }

    cachedLinks = links;
    lastFetchTime = now;

    return links;
  } catch (error) {
    console.error("Error in fetchLinks:", error);
    return cachedLinks || [];
  }
}
