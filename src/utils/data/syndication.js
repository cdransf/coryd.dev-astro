import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedSyndication = null;

export default async function fetchSyndication() {
  if (import.meta.env.MODE === "development" && cachedSyndication)
    return cachedSyndication;

  const { data, error } = await supabase
    .from("optimized_syndication")
    .select("syndication");
  if (error) return [];

  const [{ syndication } = {}] = data;
  const result = syndication?.filter((item) => item.syndication !== null) || [];

  if (import.meta.env.MODE === "development") cachedSyndication = result;

  return result;
};
