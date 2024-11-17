import { DateTime } from "luxon";
import { dateToRFC822, encodeAmp, md } from '@utils/helpers/general.js';

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
        <link>${encodeAmp(entryFeed.url)}</link>
        <pubDate>${dateToRFC822(entryFeed.date)}</pubDate>
        <guid isPermaLink="false">${entryFeed.url}</guid>
        ${
          entryFeed.image
            ? `<enclosure url="${globals.cdn_url}${entryFeed.image}?class=w800&type=jpg" type="image/jpeg" />`
            : ""
        }
        <description><![CDATA[${md(entryFeed.description)}]]></description>
      </item>`;
  });

  return `
<?xml version="1.0" encoding="UTF-8" ?>
<?xml-stylesheet href="/feeds/feed.xsl" type="text/xsl" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${globals.url}${permalink}" rel="self" type="application/rss+xml" />
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${globals.site_description}]]></description>
    <link>${globals.url}${permalink}</link>
    <lastBuildDate>${dateToRFC822(DateTime.now())}</lastBuildDate>
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
