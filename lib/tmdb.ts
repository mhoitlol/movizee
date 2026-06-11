import { FALLBACK_GENRES, SAMPLE_MOVIE_DETAILS, SAMPLE_MOVIES } from "@/lib/constants";
import type { CastPerson, Genre, Movie, MovieDetails } from "@/types/movie";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

type DiscoverParams = {
  date: string;
  genres?: string;
  region?: string;
  cast?: string;
};

function hasApiKey() {
  return Boolean(
    process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== "your_tmdb_api_key"
  );
}

async function tmdbFetch<T>(path: string, params?: Record<string, string | undefined>) {
  if (!process.env.TMDB_API_KEY) {
    throw new Error("TMDB_API_KEY is missing");
  }

  const url = new URL(`${TMDB_BASE_URL}${path}`);
  url.searchParams.set("api_key", process.env.TMDB_API_KEY);

  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url, {
    next: { revalidate: 60 * 60 }
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed with status ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getGenres(): Promise<{ genres: Genre[]; source: "tmdb" | "fallback" }> {
  if (!hasApiKey()) {
    return { genres: FALLBACK_GENRES, source: "fallback" };
  }

  try {
    const data = await tmdbFetch<{ genres: Genre[] }>("/genre/movie/list");
    return { genres: data.genres, source: "tmdb" };
  } catch {
    return { genres: FALLBACK_GENRES, source: "fallback" };
  }
}

export async function discoverMovies(params: DiscoverParams) {
  if (!hasApiKey()) {
    const selectedGenreIds = params.genres
      ? params.genres.split(",").map((id) => Number(id))
      : [];

    const movies = SAMPLE_MOVIES.filter((movie) => {
      const matchesDate = movie.release_date === params.date;
      const matchesRegion = !params.region || params.region === "IN";
      const matchesCast = !params.cast || ["101", "102"].includes(params.cast);
      const matchesGenre =
        selectedGenreIds.length === 0 ||
        selectedGenreIds.every((id) => movie.genre_ids.includes(id));
      return matchesDate && matchesRegion && matchesCast && matchesGenre;
    });

    return { movies, genres: FALLBACK_GENRES, source: "fallback" as const };
  }

  const [movieData, genreData] = await Promise.all([
    tmdbFetch<{ results: Movie[] }>("/discover/movie", {
      "release_date.gte": params.date,
      "release_date.lte": params.date,
      with_genres: params.genres,
      with_cast: params.cast,
      region: params.region,
      sort_by: "popularity.desc"
    }),
    getGenres()
  ]);

  return {
    movies: movieData.results,
    genres: genreData.genres,
    source: "tmdb" as const
  };
}

export async function searchCast(query: string): Promise<CastPerson[]> {
  if (!hasApiKey()) {
    const normalized = query.toLowerCase();
    return SAMPLE_MOVIE_DETAILS.credits.cast
      .filter((person) => person.name.toLowerCase().includes(normalized))
      .map((person) => ({
        id: person.id,
        name: person.name,
        profile_path: person.profile_path
      }));
  }

  const data = await tmdbFetch<{ results: CastPerson[] }>("/search/person", {
    query
  });

  return data.results.slice(0, 8);
}

export async function getMovieDetails(id: string): Promise<MovieDetails> {
  if (!hasApiKey() || id === String(SAMPLE_MOVIE_DETAILS.id)) {
    return SAMPLE_MOVIE_DETAILS;
  }

  return tmdbFetch<MovieDetails>(`/movie/${id}`, {
    append_to_response: "credits,release_dates"
  });
}
