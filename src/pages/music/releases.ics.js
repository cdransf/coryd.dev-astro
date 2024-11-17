import { albumReleasesCalendar } from '@utils/albumReleasesCalendar';
import { fetchAlbumReleases } from '@utils/data/albumReleases';

export async function GET() {
  try {
    const { all: albumReleases } = await fetchAlbumReleases();
    const icsContent = await albumReleasesCalendar(albumReleases);

    if (!icsContent) return new Response('Error generating ICS file', { status: 500 });

    return new Response(icsContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/calendar',
        'Content-Disposition': 'attachment; filename="releases.ics"',
      },
    });
  } catch (error) {
    console.error('Error generating album releases ICS file:', error);
    return new Response('Error generating album releases ICS file', {
      status: 500,
    });
  }
}
