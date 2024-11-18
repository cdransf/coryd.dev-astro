import { createClient } from "@supabase/supabase-js";
import { removeTrailingSlash } from "@utils/helpers/general.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const tvCache = {};

export async function fetchTvByUrl(url) {
  if (import.meta.env.MODE === "development" && tvCache[url]) return tvCache[url];

  const { data: tv, error } = await supabase
    .from("optimized_shows")
    .select("*")
    .eq("url", removeTrailingSlash(url))
    .limit(1);
  if (error) {
    console.error("Error fetching tv:", error);
    return null;
  }
  if (import.meta.env.MODE === "development") tvCache[url] = tv[0];

  return tv[0];
}
