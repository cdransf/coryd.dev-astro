import { fetchGlobals } from '@utils/data/globals';

export async function GET() {
  try {
    const globals = await fetchGlobals();

    const humansTxt = `
## team

${globals.site_name}
${globals.url}
${globals.mastodon}

## colophon

${globals.url}/colophon
    `.trim();

    return new Response(humansTxt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error generating humans.txt:', error);
    return new Response('Error generating humans.txt', { status: 500 });
  }
}
