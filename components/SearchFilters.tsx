"use client";

import { REGIONS } from "@/lib/constants";
import type { CastPerson, Genre, Movie, MovieSearchResponse } from "@/types/movie";
import { Loader2, Search } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import CastSearch from "./CastSearch";
import MovieGrid from "./MovieGrid";

type SearchFiltersProps = {
  initialGenres: Genre[];
  initialSource: "tmdb" | "fallback";
};

export default function SearchFilters({ initialGenres, initialSource }: SearchFiltersProps) {
  const [date, setDate] = useState("2024-01-26");
  const [region, setRegion] = useState("IN");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [castQuery, setCastQuery] = useState("");
  const [cast, setCast] = useState<CastPerson | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>(initialGenres);
  const [source, setSource] = useState<"tmdb" | "fallback">(initialSource);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  async function runSearch(event?: FormEvent) {
    event?.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({ date, region });

      if (selectedGenres.length > 0) {
        params.set("genres", selectedGenres.join(","));
      }

      let castId = cast?.id;

      if (!castId && castQuery.trim().length >= 2) {
        const castResponse = await fetch(`/api/cast?query=${encodeURIComponent(castQuery.trim())}`);
        const castData = (await castResponse.json()) as { people?: CastPerson[]; error?: string };

        if (!castResponse.ok) {
          throw new Error(castData.error ?? "Cast search failed.");
        }

        castId = castData.people?.[0]?.id;
      }

      if (castId) {
        params.set("cast", String(castId));
      }

      const response = await fetch(`/api/movies?${params.toString()}`);
      const data = (await response.json()) as MovieSearchResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "Movie search failed.");
      }

      setMovies(data.movies);
      setGenres(data.genres);
      setSource(data.source);
      setHasSearched(true);
    } catch (searchError) {
      setError(searchError instanceof Error ? searchError.message : "Movie search failed.");
      setMovies([]);
      setHasSearched(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void runSearch();
    // The initial sample date makes the fallback data visible on first load.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="space-y-8">
      <form
        className="rounded-md border border-line bg-[#17171c] p-4 shadow-2xl shadow-black/20 sm:p-5"
        onSubmit={runSearch}
      >
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_1.4fr_auto]">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="date">
              Release date
            </label>
            <input
              id="date"
              className="h-11 w-full rounded-md border border-line bg-panel px-3 text-sm text-white outline-none transition focus:border-gold"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="region">
              Region
            </label>
            <select
              id="region"
              className="h-11 w-full rounded-md border border-line bg-panel px-3 text-sm text-white outline-none transition focus:border-gold"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
            >
              {REGIONS.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <CastSearch
            value={cast}
            query={castQuery}
            onChange={setCast}
            onQueryChange={setCastQuery}
          />

          <div className="flex items-end">
            <button
              className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gold px-5 text-sm font-semibold text-black transition hover:bg-[#ffd978] disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Search className="h-4 w-4" aria-hidden="true" />
              )}
              Search
            </button>
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-medium text-zinc-300">Genres</p>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => {
              const id = String(genre.id);
              const isSelected = selectedGenres.includes(id);

              return (
                <button
                  key={genre.id}
                  className={`rounded-md border px-3 py-2 text-sm transition ${
                    isSelected
                      ? "border-gold bg-gold text-black"
                      : "border-line bg-panel text-zinc-300 hover:border-zinc-500"
                  }`}
                  type="button"
                  onClick={() => {
                    setSelectedGenres((current) =>
                      current.includes(id)
                        ? current.filter((genreId) => genreId !== id)
                        : [...current, id]
                    );
                  }}
                >
                  {genre.name}
                </button>
              );
            })}
          </div>
        </div>
      </form>

      {source === "fallback" ? (
        <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Running on sample fallback data. Add `TMDB_API_KEY` to `.env.local` for live movie
          results.
        </div>
      ) : null}

      {error ? (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid min-h-72 place-items-center rounded-md border border-line bg-panel/70">
          <div className="flex items-center gap-3 text-zinc-300">
            <Loader2 className="h-5 w-5 animate-spin text-gold" aria-hidden="true" />
            Loading movies...
          </div>
        </div>
      ) : hasSearched ? (
        <MovieGrid movies={movies} genres={genres} />
      ) : null}
    </section>
  );
}
