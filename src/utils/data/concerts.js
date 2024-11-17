import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedConcerts = null;
let lastFetchTime = 0;

export async function fetchConcerts() {
  const now = Date.now();

  if (cachedConcerts && now - lastFetchTime < CACHE_DURATION)
    return cachedConcerts;

  const PAGE_SIZE = 1000;
  let concerts = [];
  let rangeStart = 0;

  try {
    while (true) {
      const { data, error } = await supabase
        .from("optimized_concerts")
        .select("*")
        .range(rangeStart, rangeStart + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching concerts:", error);
        break;
      }

      concerts = concerts.concat(data);
      if (data.length < PAGE_SIZE) break;
      rangeStart += PAGE_SIZE;
    }

    const result = concerts.map((concert) => ({
      ...concert,
      artist: concert.artist || { name: concert.artist_name_string, url: null },
    }));

    cachedConcerts = result;
    lastFetchTime = now;

    return result;
  } catch (error) {
    console.error("Error in fetchConcerts:", error);
    return cachedConcerts || [];
  }
}
