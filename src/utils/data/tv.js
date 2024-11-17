import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedShows = null;
let lastFetchTime = 0;

export const fetchShows = async () => {
  const now = Date.now();

  if (cachedShows && now - lastFetchTime < CACHE_DURATION) return cachedShows;

  const PAGE_SIZE = 1000;
  let shows = [];
  let rangeStart = 0;

  try {
    while (true) {
      const { data, error } = await supabase
        .from("optimized_shows")
        .select("*")
        .range(rangeStart, rangeStart + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching shows:", error);
        return (
          cachedShows || {
            shows: [],
            recentlyWatched: [],
            favorites: [],
          }
        );
      }

      shows = shows.concat(data);
      if (data.length < PAGE_SIZE) break;
      rangeStart += PAGE_SIZE;
    }

    const watchedShows = shows.filter(
      (show) => show["last_watched_at"] !== null
    );
    const episodes = watchedShows.map((show) => ({
      title: show["episode"]["title"],
      year: show["year"],
      formatted_episode: show["episode"]["formatted_episode"],
      url: show["episode"]["url"],
      image: show["episode"]["image"],
      backdrop: show["episode"]["backdrop"],
      last_watched_at: show["episode"]["last_watched_at"],
      grid: show["grid"],
      type: "tv",
    }));

    const result = {
      shows,
      recentlyWatched: episodes.slice(0, 75),
      favorites: shows
        .filter((show) => show.favorite)
        .sort((a, b) => a.title.localeCompare(b.title)),
    };

    cachedShows = result;
    lastFetchTime = now;

    return result;
  } catch (error) {
    console.error("Error in fetchShows:", error);
    return (
      cachedShows || {
        shows: [],
        recentlyWatched: [],
        favorites: [],
      }
    );
  }
};
