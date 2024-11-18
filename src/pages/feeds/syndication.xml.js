import { DateTime } from "luxon";
import fetchSyndication from '@utils/data/syndication.js';
import { fetchGlobals } from '@utils/data/globals.js';
import { dateToRFC822, encodeAmp, md } from '@utils/helpers/general.js';

const generateSyndicationRSS = async (globals, entries) => {
  if (!entries.length) throw new Error('No feed entries found.');

  const title = globals.site_name || 'Syndicated Content Feed';
  const permalink = '/feeds/syndication.xml';

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${globals.url}${permalink}" rel="self" type="application/rss+xml" />
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${globals.site_description || ''}]]></description>
    <link>${globals.url}</link>
    <lastBuildDate>${dateToRFC822(DateTime.now())}</lastBuildDate>
    <image>
      <title><![CDATA[${title}]]></title>
      <link>${globals.url}</link>
      <url>${globals.cdn_url}${globals.avatar}?class=w200</url>
      <width>144</width>
      <height>144</height>
    </image>
    ${entries
      .slice(0, 20)
      .map(
        (entry) => `
    <item>
      <title><![CDATA[${entry.syndication.title || 'Untitled'}]]></title>
      <link>${encodeAmp(entry.syndication.url)}</link>
      <pubDate>${dateToRFC822(entry.syndication.date)}</pubDate>
      <guid isPermaLink="false">${encodeAmp(entry.syndication.url)}</guid>
      <description><![CDATA[${md(entry.syndication.description || '')}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return xml;
};

export async function GET() {
  try {
    const [globals, entries] = await Promise.all([
      fetchGlobals(),
      fetchSyndication(),
    ]);
    const rss = await generateSyndicationRSS(globals, entries);

    return new Response(rss, {
      status: 200,
      headers: { 'Content-Type': 'application/rss+xml' },
    });
  } catch (error) {
    console.error('Error generating syndication feed:', error);
    return new Response('Error generating syndication feed.', { status: 500 });
  }
}
