let cachedPages = null;

export async function fetchAnalyticsData() {
  if (import.meta.env.MODE === "development" && cachedPages) return cachedPages;

  const API_KEY_PLAUSIBLE = import.meta.env.API_KEY_PLAUSIBLE;
  const url =
    "https://plausible.io/api/v1/stats/breakdown?site_id=coryd.dev&period=6mo&property=event:page&limit=30";

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${API_KEY_PLAUSIBLE}`,
      },
    });

    if (!res.ok) {
      console.error(`Error fetching Plausible data: ${res.statusText}`);
      return [];
    }

    const pages = await res.json();
    const filteredPages = pages["results"].filter((p) =>
      p["page"].includes("posts")
    );

    if (import.meta.env.MODE === "development") cachedPages = filteredPages;

    return filteredPages;
  } catch (error) {
    console.error("Error fetching Plausible data:", error);
    return [];
  }
}
