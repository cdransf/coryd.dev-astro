import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedBlogroll = null;
let lastFetchTime = 0;

export async function fetchBlogroll() {
  const now = Date.now();

  if (cachedBlogroll && now - lastFetchTime < CACHE_DURATION)
    return cachedBlogroll;

  try {
    const { data, error } = await supabase
      .from("authors")
      .select("*")
      .eq("blogroll", true)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching blogroll:", error);
      return [];
    }

    const sortedData = data.sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );

    cachedBlogroll = sortedData;
    lastFetchTime = now;

    return sortedData;
  } catch (error) {
    console.error("Error in fetchBlogroll:", error);
    return cachedBlogroll || [];
  }
}
