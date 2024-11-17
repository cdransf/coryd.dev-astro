export function generateJsonFeed({
  permalink,
  title,
  globals,
  data,
}) {
  const feed = {
    version: "https://jsonfeed.org/version/1",
    title,
    home_page_url: globals.url,
    feed_url: `${globals.url}${permalink}`,
    description: globals.site_description,
    icon: `${globals.cdn_url}${globals.avatar}?class=w200`,
    author: {
      name: globals.site_name,
      url: globals.url,
      avatar: `${globals.cdn_url}${globals.avatar}?class=w200`,
    },
    items: data.slice(0, 20).map((entry) => {
      const text = entry.feed.description
        ?.replace(/(<([^>]+)>)/gi, "")
        ?.trim()
        ?.replace(/\s+/g, " ")
        ?.slice(0, 200);

      return {
        id: entry.feed.url,
        url: entry.feed.url,
        title: entry.feed.title,
        content_html: text,
        content_text: text,
        summary: text,
        date_published: new Date(entry.feed.date).toISOString(),
      };
    }),
  };

  return JSON.stringify(feed, null, 2);
}
