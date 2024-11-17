import { DateTime } from "luxon";
import { createEvents } from "ics";

export async function albumReleasesCalendar(albumReleases) {
  if (!albumReleases || albumReleases.length === 0) return "";

  const events = albumReleases
    .map((album) => {
      const date = DateTime.fromISO(album["release_date"]);
      if (!date.isValid) return null;

      return {
        start: [date.year, date.month, date.day],
        startInputType: "local",
        startOutputType: "local",
        title: `Release: ${album["artist"]["name"]} - ${album["title"]}`,
        description: `Check out this new album release: ${album["url"]}. Read more about ${album["artist"]["name"]} at https://coryd.dev${album["artist"]["url"]}`,
        url: album["url"],
        uid: `${date.toFormat("yyyyMMdd")}-${album["artist"]["name"]}-${album["title"]}@coryd.dev`,
        timestamp: DateTime.now().toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'"),
      };
    })
    .filter((event) => event !== null);

  const { error, value } = createEvents(events, {
    calName: "Album releases calendar / coryd.dev",
  });

  if (error) {
    console.error("Error creating events: ", error);
    events.forEach((event, index) => {
      console.error(`Event ${index}:`, event);
    });
    return "";
  }

  return value;
}
