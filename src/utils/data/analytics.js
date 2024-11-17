import { CACHE_DURATION } from "@utils/constants/index.js";

let cachedPages = null;
let lastFetchTime = 0;

export async function fetchAnalyticsData() {
  const now = Date.now();

  if (cachedPages && now - lastFetchTime < CACHE_DURATION) return cachedPages;

  const API_KEY_PLAUSIBLE = import.meta.env.API_KEY_PLAUSIBLE;
  const url =
    "https://plausible.io/api/v1/stats/breakdown?site_id=coryd.dev&period=6mo&property=event:page&limit=30";

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY_PLAUSIBLE}`,
      },
    });

    if (res.status === 429) {
      console.warn("Rate limit reached: Too Many Requests");
      throw new Error("Too many requests. Please try again later.");
    }

    if (!res.ok) {
      console.error(`Error fetching Plausible data: ${res.statusText}`);
      return [];
    }

    const pages = await res.json();
    const filteredPages = pages.results.filter((p) => p.page.includes("posts"));

    cachedPages = filteredPages;
    lastFetchTime = now;

    return filteredPages;
  } catch (error) {
    console.error("Error fetching Plausible data:", error);
    return cachedPages || [];
  }
}