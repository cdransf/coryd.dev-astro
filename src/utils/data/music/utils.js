const PAGE_SIZE = 1000;

export const fetchDataFromView = async (viewName, supabase) => {
  let rows = [];
  let rangeStart = 0;

  try {
    while (true) {
      const { data, error } = await supabase
        .from(viewName)
        .select("*")
        .range(rangeStart, rangeStart + PAGE_SIZE - 1);

      if (error || data.length === 0) break;

      rows = [...rows, ...data];
      if (data.length < PAGE_SIZE) break;
      rangeStart += PAGE_SIZE;
    }
  } catch (error) {
    console.error(`Error fetching data from view: ${viewName}`, error);
  }

  return rows;
};

export const calculateTotalPlays = (tracks) =>
  tracks.reduce((acc, track) => acc + track.plays, 0).toLocaleString("en-US");
