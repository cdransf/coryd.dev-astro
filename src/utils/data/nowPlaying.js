import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedNowPlaying = null;

export async function fetchNowPlaying() {
  if (import.meta.env.MODE === "development" && cachedNowPlaying)
    return cachedNowPlaying;

  const { data, error } = await supabase
    .from("optimized_latest_listen")
    .select("*")
    .single();
  if (error) return {};

  const genreEmoji = data.genre_emoji;
  const emoji = data.artist_emoji || genreEmoji;

  const result = {
    content: `${emoji || "🎧"} ${
      data.track_name
    } by <a href="https://coryd.dev${data.url}">${data.artist_name}</a>`,
  };

  if (import.meta.env.MODE === "development") cachedNowPlaying = result;

  return result;
};
