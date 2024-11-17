import { createClient } from "@supabase/supabase-js";
import { parseISO, subMonths } from "date-fns";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedMovies = null;
let lastFetchTime = 0;

export async function fetchMovies() {
  const now = Date.now();

  if (cachedMovies && now - lastFetchTime < CACHE_DURATION) return cachedMovies;

  const PAGE_SIZE = 1000;
  let movies = [];
  let rangeStart = 0;

  try {
    while (true) {
      const { data, error } = await supabase
        .from("optimized_movies")
        .select("*")
        .range(rangeStart, rangeStart + PAGE_SIZE - 1);

      if (error) {
        console.error("Error fetching movies:", error);
        return (
          cachedMovies || {
            movies: [],
            watchHistory: [],
            recentlyWatched: [],
            favorites: [],
            feed: [],
          }
        );
      }

      movies = movies.concat(data);
      if (data.length < PAGE_SIZE) break;
      rangeStart += PAGE_SIZE;
    }

    const favoriteMovies = movies.filter((movie) => movie.favorite);

    const recentlyWatchedMovies = movies.filter((movie) => {
      if (!movie.last_watched) return false;
      const lastWatchedDate = parseISO(movie.last_watched);
      const threeMonthsAgo = subMonths(new Date(), 3);

      return lastWatchedDate >= threeMonthsAgo;
    });

    const result = {
      movies,
      watchHistory: movies.filter((movie) => movie.last_watched),
      recentlyWatched: recentlyWatchedMovies,
      favorites: favoriteMovies.sort((a, b) => a.title.localeCompare(b.title)),
      feed: movies.filter((movie) => movie.feed),
    };

    cachedMovies = result;
    lastFetchTime = now;

    return result;
  } catch (error) {
    console.error("Error in fetchMovies:", error);
    return (
      cachedMovies || {
        movies: [],
        watchHistory: [],
        recentlyWatched: [],
        favorites: [],
        feed: [],
      }
    );
  }
}
