import { isBefore } from "date-fns";
import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedPosts = null;
let lastFetchTime = 0;

export async function fetchAllPosts() {
  const now = Date.now();

  if (cachedPosts && now - lastFetchTime < CACHE_DURATION) return cachedPosts;

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

    const filteredData = data.filter((post) =>
      isBefore(new Date(post.date), now)
    );

    posts = posts.concat(filteredData);
    page++;
  }

  cachedPosts = posts;
  lastFetchTime = now;

  return posts;
}
