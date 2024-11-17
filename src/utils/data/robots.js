import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedRobots = null;
let lastFetchTime = 0;

export async function fetchAllRobots() {
  const now = Date.now();

  if (cachedRobots && now - lastFetchTime < CACHE_DURATION) return cachedRobots;

  const PAGE_SIZE = 500;
  let robots = [];
  let from = 0;

  try {
    while (true) {
      const { data, error } = await supabase
        .from("robots")
        .select("user_agent")
        .range(from, from + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching robots:", error);
        return cachedRobots || [];
      }

      robots = robots.concat(data);
      if (data.length < PAGE_SIZE) break;
      from += PAGE_SIZE;
    }

    const result = robots.map((robot) => robot["user_agent"]).sort();

    cachedRobots = result;
    lastFetchTime = now;

    return result;
  } catch (error) {
    console.error("Error in fetchAllRobots:", error);
    return cachedRobots || [];
  }
}
