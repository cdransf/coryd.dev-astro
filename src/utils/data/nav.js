import { createClient } from "@supabase/supabase-js";
import { CACHE_DURATION } from "@utils/constants/index.js";

let cachedNavigation = null;
let lastFetchTime = 0;

export async function fetchNavigation(env) {
  const SUPABASE_URL = import.meta.env?.SUPABASE_URL || env.SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env?.SUPABASE_KEY || env.SUPABASE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const now = Date.now();

  if (cachedNavigation && now - lastFetchTime < CACHE_DURATION)
    return cachedNavigation;

  try {
    const { data, error } = await supabase
      .from("optimized_navigation")
      .select("*");
    if (error) {
      console.error("Error fetching navigation:", error);
      return {};
    }

    const menu = data.reduce((acc, item) => {
      const menuItem = {
        title: item["title"] || item["page_title"],
        permalink: item["permalink"] || item["page_permalink"],
        icon: item["icon"],
        sort: item["sort"],
      };

      if (!acc[item["menu_location"]]) acc[item["menu_location"]] = [menuItem];
      else acc[item["menu_location"]].push(menuItem);

      return acc;
    }, {});

    Object.keys(menu).forEach((location) => {
      menu[location].sort((a, b) => a["sort"] - b["sort"]);
    });

    cachedNavigation = menu;
    lastFetchTime = now;

    return menu;
  } catch (error) {
    console.error("Error in fetchNavigation:", error);
    return cachedNavigation || {};
  }
}
