import { createClient } from "@supabase/supabase-js";

export async function handler(event, context) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const searchParams = event.queryStringParameters || {};
    const query = searchParams.q?.trim() || "";
    const rawTypes = searchParams.type || "";
    const types = rawTypes ? rawTypes.split(",") : null;
    const page = parseInt(searchParams.page || "1", 10);
    const pageSize = parseInt(searchParams.pageSize || "10", 10);
    const offset = (page - 1) * pageSize;

    if (!query) throw new Error("Missing or invalid 'q' parameter");

    const { data, error } = await supabase.rpc("search_optimized_index", {
      search_query: query,
      page_size: pageSize,
      page_offset: offset,
      types: types && types.length ? types : null,
    });

    if (error) {
      console.error("Error fetching search data:", error.message);
      return {
        statusCode: 500,
        body: JSON.stringify({
          results: [],
          total: 0,
          error: error.message,
        }),
      };
    }

    const total = data.length > 0 ? data[0].total_count : 0;
    const results = data.map(({ total_count, ...item }) => item);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ results, total, page, pageSize }),
    };
  } catch (error) {
    console.error("Unexpected error:", error.message);
    return {
      statusCode: error.message.includes("Missing or invalid") ? 400 : 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
