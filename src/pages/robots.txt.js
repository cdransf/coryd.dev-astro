import { fetchAllRobots } from '@utils//data/robots.js';

export const prerender = true;

export async function GET() {
  try {
    const robots = await fetchAllRobots();
    const sitemap = `Sitemap: https://coryd.dev/sitemap-index.xml\n\n`;
    const allowAll = `User-agent: *\nDisallow:\n\n`;
    const disallowedBots = robots
      .map((userAgent) => `User-agent: ${userAgent}`)
      .join('\n');
    const disallowAll = `\nDisallow: /`;
    const robotsTxt = `${sitemap}${allowAll}${disallowedBots}${disallowAll}`;

    return new Response(robotsTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error generating robots.txt:', error);
    return new Response('Error generating robots.txt', { status: 500 });
  }
}