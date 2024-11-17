import { parseISO, format, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { createEvents } from "ics";

const nowUTC = toZonedTime(new Date(), "UTC");
const formattedDate = format(nowUTC, "yyyyMMdd'T'HHmmss'Z'");

export async function albumReleasesCalendar(albumReleases) {
  if (!albumReleases || albumReleases.length === 0) return "";

  const events = albumReleases
    .map((album) => {
      const date = parseISO(album["release_date"]);
      if (!isValid(date)) return null;

      return {
        start: [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate(),
        ],
        startInputType: "local",
        startOutputType: "local",
        title: `Release: ${album["artist"]["name"]} - ${album["title"]}`,
        description: `Check out this new album release: ${album["url"]}. Read more about ${album["artist"]["name"]} at https://coryd.dev${album["artist"]["url"]}`,
        url: album["url"],
        uid: `${format(date, "yyyyMMdd")}-${album["artist"]["name"]}-${album["title"]}@coryd.dev`,
        timestamp: formattedDate,
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
