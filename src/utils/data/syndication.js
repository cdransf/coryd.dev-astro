import { isBefore } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedSyndication = null;
let lastFetchTime = 0;

export async function fetchSyndication() {
  const now = Date.now();

  if (cachedSyndication && now - lastFetchTime < CACHE_DURATION)
    return cachedSyndication;

  try {
    const { data, error } = await supabase
      .from("optimized_syndication")
      .select("syndication");

    if (error) {
      console.error("Error fetching syndication:", error);
      return cachedSyndication || [];
    }

    const [{ syndication } = {}] = data;
    const result =
      syndication?.filter(
        (item) =>
          item.syndication !== null &&
          isBefore(new Date(item.syndication.date), now)
      ) || [];

    cachedSyndication = result;
    lastFetchTime = now;

    return result;
  } catch (error) {
    console.error("Error in fetchSyndication:", error);
    return cachedSyndication || [];
  }
}
