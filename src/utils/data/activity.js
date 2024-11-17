import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedActivity = null;
let lastFetchTime = 0;

export async function fetchActivity() {
  const now = Date.now();

  if (cachedActivity && now - lastFetchTime < CACHE_DURATION)
    return cachedActivity;

  try {
    const { data, error } = await supabase
      .from("optimized_all_activity")
      .select("feed");

    if (error) {
      console.error("Error fetching activity data:", error);
      return cachedActivity || [];
    }

    const [{ feed } = {}] = data || [];
    const filteredFeed = feed?.filter((item) => item.feed !== null) || [];

    cachedActivity = filteredFeed;
    lastFetchTime = now;

    return filteredFeed;
  } catch (error) {
    console.error("Error in fetchActivity:", error);
    return cachedActivity || [];
  }
}
