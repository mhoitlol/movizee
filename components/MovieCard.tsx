import type { Genre, Movie } from "@/types/movie";
import { CalendarDays, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type MovieCardProps = {
  movie: Movie;
  genres: Genre[];
};

const imageBase = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p/w500";

export default function MovieCard({ movie, genres }: MovieCardProps) {
  const movieGenres = movie.genre_ids
    .map((id) => genres.find((genre) => genre.id === id)?.name)
    .filter(Boolean)
    .slice(0, 3);

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group overflow-hidden rounded-md border border-line bg-panel transition hover:-translate-y-1 hover:border-gold/70"
    >
      <div className="relative aspect-[2/3] bg-zinc-900">
        {movie.poster_path ? (
          <Image
            src={`${imageBase}${movie.poster_path}`}
            alt={`${movie.title} poster`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 220px"
            className="object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center px-4 text-center text-sm text-zinc-500">
            No poster
          </div>
        )}
      </div>
      <div className="space-y-3 p-4">
        <h2 className="line-clamp-2 min-h-12 text-base font-semibold leading-6 text-white">
          {movie.title}
        </h2>
        <div className="flex items-center justify-between gap-3 text-sm text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {movie.release_date || "Unknown"}
          </span>
          <span className="flex items-center gap-1.5 text-gold">
            <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : "NR"}
          </span>
        </div>
        <div className="flex min-h-7 flex-wrap gap-2">
          {movieGenres.length > 0 ? (
            movieGenres.map((genre) => (
              <span
                key={genre}
                className="rounded-md border border-zinc-700 px-2 py-1 text-xs text-zinc-300"
              >
                {genre}
              </span>
            ))
          ) : (
            <span className="text-xs text-zinc-500">Genres unavailable</span>
          )}
        </div>
      </div>
    </Link>
  );
}
