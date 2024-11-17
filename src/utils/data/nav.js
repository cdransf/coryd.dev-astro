import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.SUPABASE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

let cachedNavigation = null;

export async function fetchNavigation() {
  if (import.meta.env.MODE === "development" && cachedNavigation)
    return cachedNavigation;

  const { data, error } = await supabase
    .from("optimized_navigation")
    .select("*");
  if (error) return {};

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

  if (import.meta.env.MODE === "development") cachedNavigation = menu;

  return menu;
};
