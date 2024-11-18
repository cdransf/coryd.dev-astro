import { useEffect, useState } from "react";

export default function NowPlaying({ staticContent }) {
  const [nowPlaying, setNowPlaying] = useState(staticContent);

  useEffect(() => {
    if (import.meta.env.MODE !== "production") return;

    async function fetchNowPlaying() {
      try {
        const response = await fetch("/api/now-playing");
        if (response.ok) {
          const data = await response.json();
          setNowPlaying(data.content);
        } else {
          setNowPlaying("Nothing playing.");
        }
      } catch (error) {
        console.error("Error fetching now playing:", error);
        setNowPlaying("Unable to fetch data.");
      }
    }

    fetchNowPlaying();
    const interval = setInterval(fetchNowPlaying, 180000);

    return () => clearInterval(interval);
  }, []);

  return (
    <span className="now-playing">
      <span dangerouslySetInnerHTML={{ __html: nowPlaying }} />
    </span>
  );
}
