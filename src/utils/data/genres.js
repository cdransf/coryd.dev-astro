import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedGenres = null;

export async function fetchGenres() {
  if (import.meta.env.MODE === "development" && cachedGenres)
    return cachedGenres;

  const { data, error } = await supabase.from("optimized_genres").select("*");

  if (error) return [];
  if (import.meta.env.MODE === "development") cachedGenres = data;

  return data;
};
