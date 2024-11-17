import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

let cachedGlobals = null;
let lastFetchTime = 0;

export async function fetchGlobals(env) {
  const SUPABASE_URL = import.meta.env?.SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env?.SUPABASE_KEY || env.SUPABASE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const now = Date.now();

  if (cachedGlobals && now - lastFetchTime < CACHE_DURATION)
    return cachedGlobals;

  try {
    const { data, error } = await supabase
      .from("optimized_globals")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching globals:", error);
      return {};
    }

    cachedGlobals = data;
    lastFetchTime = now;

    return data;
  } catch (error) {
    console.error("Error in fetchGlobals:", error);
    return cachedGlobals || {};
  }
}
