import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedPages = null;

export async function fetchPages() {
  if (import.meta.env.MODE === "development" && cachedPages) return cachedPages;

  const { data, error } = await supabase.from("optimized_pages").select("*");
  if (error) return [];

  if (import.meta.env.MODE === "development") cachedPages = data;

  return data;
};
