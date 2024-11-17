import { createClient } from "@supabase/supabase-js";
import { DateTime } from "luxon";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedMovies = null;

export async function fetchMovies() {
  if (import.meta.env.MODE === "development" && cachedMovies)
    return cachedMovies;

  const PAGE_SIZE = 1000;
  let movies = [];
  let rangeStart = 0;

  while (true) {
    const { data, error } = await supabase
      .from("optimized_movies")
      .select("*")
      .range(rangeStart, rangeStart + PAGE_SIZE - 1);

    if (error) break;

    movies = movies.concat(data);
    if (data.length < PAGE_SIZE) break;
    rangeStart += PAGE_SIZE;
  }

  const year = DateTime.now().year;
  const favoriteMovies = movies.filter((movie) => movie.favorite);
  const recentlyWatchedMovies = movies.filter(
    (movie) =>
      movie.last_watched &&
      year - DateTime.fromISO(movie.last_watched).year <= 3
  );

  const result = {
    movies,
    watchHistory: movies.filter((movie) => movie.last_watched),
    recentlyWatched: recentlyWatchedMovies,
    favorites: favoriteMovies.sort((a, b) => a.title.localeCompare(b.title)),
    feed: movies.filter((movie) => movie.feed),
  };

  if (import.meta.env.MODE === "development") cachedMovies = result;

  return result;
};
