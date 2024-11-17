import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedLinks = null;

export async function fetchLinks() {
  if (import.meta.env.MODE === "development" && cachedLinks) return cachedLinks;

  const PAGE_SIZE = 1000;
  let links = [];
  let page = 0;
  let fetchMore = true;

  while (fetchMore) {
    const { data, error } = await supabase
      .from("optimized_links")
      .select("*")
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error) return links;
    if (data.length < PAGE_SIZE) fetchMore = false;

    links = links.concat(data);
    page++;
  }

  if (import.meta.env.MODE === "development") cachedLinks = links;

  return links;
};
