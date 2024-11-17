import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedPages = null;
let lastFetchTime = 0;

export async function fetchPages() {
  const now = Date.now();

  if (cachedPages && now - lastFetchTime < CACHE_DURATION) return cachedPages;

  try {
    const { data, error } = await supabase.from("optimized_pages").select("*");

    if (error) {
      console.error("Error fetching pages:", error);
      return cachedPages || [];
    }

    cachedPages = data;
    lastFetchTime = now;

    return data;
  } catch (error) {
    console.error("Error in fetchPages:", error);
    return cachedPages || [];
  }
}
