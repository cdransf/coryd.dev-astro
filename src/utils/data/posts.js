import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env["SUPABASE_URL"];
const SUPABASE_KEY = import.meta.env["SUPABASE_KEY"];
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedPosts = null;

export async function fetchAllPosts() {
  if (import.meta.env.MODE === "development" && cachedPosts) return cachedPosts;

  const PAGE_SIZE = 1000;
  let posts = [];
  let page = 0;
  let fetchMore = true;

  while (fetchMore) {
    const { data, error } = await supabase
      .from("optimized_posts")
      .select("*")
      .order("date", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error) return posts;

    if (data.length < PAGE_SIZE) fetchMore = false;

    posts = posts.concat(data);
    page++;
  }

  if (import.meta.env.MODE === "development") cachedPosts = posts;

  return posts;
};
