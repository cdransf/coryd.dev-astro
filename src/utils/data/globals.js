import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedGlobals = null;

export async function fetchGlobals() {
  const isDev = import.meta.env.MODE === "development";

  if (isDev && cachedGlobals) return cachedGlobals;

  const { data, error } = await supabase
    .from("optimized_globals")
    .select("*")
    .single();

  if (error) return {};
  if (isDev) cachedGlobals = data;

  return data;
};
