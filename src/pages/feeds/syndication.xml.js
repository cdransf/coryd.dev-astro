import fetchSyndication from '../../utils/data/syndication.js';
import { fetchGlobals } from '../../utils/data/globals.js';

export async function GET() {
  const globals = await fetchGlobals();
  const entries = await fetchSyndication();

  if (!entries.length) return new Response('No feed entries found.', { status: 404 });

  const title = globals.site_name || 'Syndicated content / Cory Dransfeldt';
  const permalink = '/feeds/syndication.xml';

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${globals.url}${permalink}" rel="self" type="application/rss+xml" />
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${globals.site_description || ''}]]></description>
    <link>${globals.url}${permalink}</link>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <image>
      <title><![CDATA[${title}]]></title>
      <link>${globals.url}${permalink}</link>
      <url>${globals.cdn_url}${globals.avatar}?class=w200</url>
      <width>144</width>
      <height>144</height>
    </image>
    ${entries
      .slice(0, 20)
      .map(
        (entry) => `
    <item>
      <title><![CDATA[${entry.syndication.title}]]></title>
      <link>${encodeAmp(entry.syndication.url)}</link>
      <pubDate>${new Date(entry.syndication.date).toUTCString()}</pubDate>
      <guid isPermaLink="false">${encodeAmp(entry.syndication.url)}</guid>
      <description><![CDATA[${escapeHTML(entry.syndication.description)}]]></description>
    </item>`
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml',
    },
  });
}

function encodeAmp(url) {
  return url.replace(/&/g, '&amp;');
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}