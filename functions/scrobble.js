import { createClient } from "@supabase/supabase-js";
import slugify from "slugify";

const sanitizeMediaString = (str) => {
  const sanitizedString = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u2010\-\.\?\(\)\[\]\{\}]/g, "")
    .replace(/\.{3}/g, "");
  return slugify(sanitizedString, {
    replacement: "-",
    remove: /[#,&,+()$~%.'":*?<>{}]/g,
    lower: true,
  });
};

const sendEmail = async (subject, text, authHeader, maxRetries = 3) => {
  const emailData = new URLSearchParams({
    from: "coryd.dev <hi@admin.coryd.dev>",
    to: "hi@coryd.dev",
    subject: subject,
    text: text,
  }).toString();

  let attempt = 0;
  let success = false;

  while (attempt < maxRetries && !success) {
    attempt++;
    try {
      const response = await fetch("https://api.forwardemail.net/v1/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: authHeader,
        },
        body: emailData,
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error(
          `Attempt ${attempt}: Email API response error:`,
          response.status,
          responseText,
        );
        throw new Error(`Failed to send email: ${responseText}`);
      }

      console.log("Email sent successfully on attempt", attempt);
      success = true;
    } catch (error) {
      console.error(`Attempt ${attempt}: Error sending email.`);

      if (attempt < maxRetries) {
        console.log(
          `Retrying email send (attempt ${attempt + 1}/${maxRetries})...`,
        );
      } else {
        console.error("All attempts to send email failed.");
      }
    }
  }

  return success;
};

const parseMultipartFormData = (body, boundary) => {
  const parts = body.split(`--${boundary}`).filter((part) => part.trim());
  const formData = {};

  parts.forEach((part) => {
    const [headers, value] = part.split("\r\n\r\n");
    const nameMatch = headers.match(/name="(.+?)"/);
    if (nameMatch) {
      const name = nameMatch[1];
      formData[name] = value.trim().replace(/\r\n$/, "");
    }
  });

  return formData;
};

export async function handler(event, context) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const FORWARDEMAIL_API_KEY = process.env.FORWARDEMAIL_API_KEY;
  const ACCOUNT_ID_PLEX = process.env.ACCOUNT_ID_PLEX;
  const authHeader = "Basic " + btoa(`${FORWARDEMAIL_API_KEY}:`);
  const supabase = createClient(supabaseUrl, supabaseKey);

  let id;

  try {
    const queryParams = new URLSearchParams(event.queryStringParameters || {});
    id = queryParams.get("id");

    if (!id || id !== ACCOUNT_ID_PLEX)
      return {
        statusCode: 403,
        body: JSON.stringify({
          status: "Forbidden",
          message: "Invalid or missing ID",
        }),
      };
  } catch (error) {
    console.error("Error parsing query parameters.");

    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "Bad request",
        message: "Oops! Bad request.",
      }),
    };
  }

  const contentType = event.headers["content-type"] || "";

  if (!contentType.includes("multipart/form-data"))
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "Bad request",
        message: "Invalid Content-Type. Expected multipart/form-data.",
      }),
    };

  try {
    const boundary = contentType.split("boundary=")[1];

    if (!boundary) throw new Error("Missing boundary in Content-Type");

    const rawBody = Buffer.from(event.body, "base64").toString("utf-8");
    const formData = parseMultipartFormData(rawBody, boundary);
    const payload = JSON.parse(formData.payload);

    if (payload?.event === "media.scrobble") {
      const artistName = payload["Metadata"]["grandparentTitle"];
      const albumName = payload["Metadata"]["parentTitle"];
      const trackName = payload["Metadata"]["title"];
      const listenedAt = Math.floor(Date.now() / 1000);
      const artistKey = sanitizeMediaString(artistName);
      const albumKey = `${artistKey}-${sanitizeMediaString(albumName)}`;

      let { data: artistData, error: artistError } = await supabase
        .from("artists")
        .select("*")
        .ilike("name_string", artistName)
        .single();

      if (artistError && artistError.code === "PGRST116") {
        const { error: insertArtistError } = await supabase
          .from("artists")
          .insert([
            {
              mbid: null,
              art: "4cef75db-831f-4f5d-9333-79eaa5bb55ee",
              name: artistName,
              slug: "/music",
              tentative: true,
              total_plays: 0,
            },
          ]);

        if (insertArtistError) {
          console.error("Error inserting artist.");
          return {
            statusCode: 500,
            body: JSON.stringify({
              status: "error",
              message: "Error inserting artist.",
            }),
          };
        }

        await sendEmail(
          "New tentative artist record",
          `A new tentative artist record was inserted:\n\nArtist: ${artistName}\nKey: ${artistKey}`,
          authHeader,
        );

        ({ data: artistData, error: artistError } = await supabase
          .from("artists")
          .select("*")
          .ilike("name_string", artistName)
          .single());
      }

      if (artistError) {
        console.error("Artist not found or created.");
        return {
          statusCode: 500,
          body: JSON.stringify({
            status: "error",
            message: "Artist not found",
          }),
        };
      }

      let { data: albumData, error: albumError } = await supabase
        .from("albums")
        .select("*")
        .ilike("key", albumKey)
        .single();

      if (albumError && albumError.code === "PGRST116") {
        console.log("Inserting new album:", albumName);
        const { error: insertAlbumError } = await supabase
          .from("albums")
          .insert([
            {
              mbid: null,
              art: "4cef75db-831f-4f5d-9333-79eaa5bb55ee",
              key: albumKey,
              name: albumName,
              tentative: true,
              total_plays: 0,
              artist: artistData.id,
            },
          ]);

        if (insertAlbumError) {
          console.error("Error inserting album.");
          return {
            statusCode: 500,
            body: JSON.stringify({
              status: "error",
              message: "Error inserting album.",
            }),
          };
        }

        await sendEmail(
          "New tentative album record",
          `A new tentative album record was inserted:\n\nAlbum: ${albumName}\nKey: ${albumKey}\nArtist: ${artistName}`,
          authHeader,
        );

        ({ data: albumData, error: albumError } = await supabase
          .from("albums")
          .select("*")
          .ilike("key", albumKey)
          .single());
      }

      if (albumError) {
        console.error("Album not found or created.");
        return {
          statusCode: 500,
          body: JSON.stringify({ status: "error", message: "Album not found" }),
        };
      }

      const { error: listenError } = await supabase.from("listens").insert([
        {
          artist_name: artistData.name_string || artistName,
          album_name: albumData.name || albumName,
          track_name: trackName,
          listened_at: listenedAt,
          album_key: albumKey,
        },
      ]);

      if (listenError) {
        console.error("Error inserting listen.");
        return {
          statusCode: 500,
          body: JSON.stringify({
            status: "error",
            message: "Error inserting listen.",
          }),
        };
      }

      console.log("Listen record inserted successfully");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success" }),
    };
  } catch (e) {
    console.error(
      "Error occurred during request processing:",
      e.message,
      e.stack,
    );

    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: "Oops! Error." }),
    };
  }
}
