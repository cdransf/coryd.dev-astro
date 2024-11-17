import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedRobots = null;

export async function fetchAllRobots() {
  if (import.meta.env.MODE === "development" && cachedRobots)
    return cachedRobots;

  const PAGE_SIZE = 500;
  let robots = [];
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("robots")
      .select("user_agent")
      .range(from, from + PAGE_SIZE - 1);

    if (error) return [];

    robots = robots.concat(data);
    if (data.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  const result = robots.map((robot) => robot["user_agent"]).sort();

  if (import.meta.env.MODE === "development") cachedRobots = result;

  return result;
};
