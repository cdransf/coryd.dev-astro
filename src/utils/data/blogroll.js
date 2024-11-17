import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedBlogroll = null;

export async function fetchBlogroll() {
  if (import.meta.env.MODE === "development" && cachedBlogroll)
    return cachedBlogroll;

  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("blogroll", true)
    .order("name", { ascending: true });

  if (error) return [];

  const sortedData = data.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );

  if (import.meta.env.MODE === "development") cachedBlogroll = sortedData;

  return sortedData;
};
