import type { Genre, Movie } from "@/types/movie";
import MovieCard from "./MovieCard";

type MovieGridProps = {
  movies: Movie[];
  genres: Genre[];
};

export default function MovieGrid({ movies, genres }: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-line bg-panel/70 px-6 py-16 text-center">
        <h2 className="text-lg font-semibold text-white">No movies found for this date</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Try a different date, region, genre, or cast member.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} genres={genres} />
      ))}
    </div>
  );
}
