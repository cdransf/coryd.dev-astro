import { DateTime } from "luxon";

export function generateRssFeed({ permalink, title, globals, data }) {
  const rssItems = data.slice(0, 20).map((entry) => {
    const entryFeed = entry.feed;
    const rating = entry.rating;
    const entryTitle = `${entryFeed.title}${
      entryFeed.artist?.name ? ` via ${entryFeed.artist.name}` : ""
    }${rating ? ` (${rating})` : ""}`;

    return `
      <item>
        <title><![CDATA[${entryTitle}]]></title>
        <link>${entryFeed.url}</link>
        <pubDate>${DateTime.fromISO(entryFeed.date).toRFC2822()}</pubDate>
        <guid isPermaLink="false">${entryFeed.url}</guid>
        ${
          entryFeed.image
            ? `<enclosure url="${globals.cdn_url}${entryFeed.image}?class=w800&type=jpg" type="image/jpeg" />`
            : ""
        }
        <description><![CDATA[${entryFeed.description}]]></description>
      </item>`;
  });

  return `
<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${globals.url}${permalink}" rel="self" type="application/rss+xml" />
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${globals.site_description}]]></description>
    <link>${globals.url}${permalink}</link>
    <lastBuildDate>${DateTime.now().toUTC().toRFC2822()}</lastBuildDate>
    <image>
      <title><![CDATA[${title}]]></title>
      <link>${globals.url}${permalink}</link>
      <url>${globals.cdn_url}${globals.avatar}?class=w200</url>
      <width>144</width>
      <height>144</height>
    </image>
    ${rssItems.join("\n")}
  </channel>
</rss>`;
}
