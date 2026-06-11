type OmdbMovie = {
  BoxOffice?: string;
};

export async function getOmdbBoxOffice(imdbId?: string | null) {
  if (!process.env.OMDB_API_KEY || !imdbId) {
    return null;
  }

  const url = new URL("https://www.omdbapi.com/");
  url.searchParams.set("apikey", process.env.OMDB_API_KEY);
  url.searchParams.set("i", imdbId);

  const response = await fetch(url, {
    next: { revalidate: 60 * 60 * 24 }
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as OmdbMovie;
  return data.BoxOffice && data.BoxOffice !== "N/A" ? data.BoxOffice : null;
}
