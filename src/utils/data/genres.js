import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedGenres = null;
let lastFetchTime = 0;

export async function fetchGenres() {
  const now = Date.now();

  if (cachedGenres && now - lastFetchTime < CACHE_DURATION) return cachedGenres;

  try {
    const { data, error } = await supabase.from("optimized_genres").select("*");

    if (error) {
      console.error("Error fetching genres:", error);
      return [];
    }

    cachedGenres = data;
    lastFetchTime = now;

    return data;
  } catch (error) {
    console.error("Error in fetchGenres:", error);
    return cachedGenres || [];
  }
}
