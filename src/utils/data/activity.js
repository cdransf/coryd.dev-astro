import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedActivity = null;

export async function fetchActivity() {
  if (import.meta.env.MODE === "development" && cachedActivity)
    return cachedActivity;

  const { data, error } = await supabase
    .from("optimized_all_activity")
    .select("feed");

  if (error) return [];
  const [{ feed } = {}] = data || [];
  const filteredFeed = feed?.filter((item) => item.feed !== null) || [];

  if (import.meta.env.MODE === "development") cachedActivity = filteredFeed;

  return filteredFeed;
};
