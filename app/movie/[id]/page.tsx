import { getMovieDetails } from "@/lib/tmdb";
import { ArrowLeft, Clock, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type MoviePageProps = {
  params: {
    id: string;
  };
};

const imageBase = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE ?? "https://image.tmdb.org/t/p/w500";

function formatCurrency(value: number) {
  if (!value) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function formatRuntime(minutes: number) {
  if (!minutes) {
    return "Unknown";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours ? `${hours}h ${remainingMinutes}m` : `${remainingMinutes}m`;
}

export default async function MoviePage({ params }: MoviePageProps) {
  let movie;

  try {
    movie = await getMovieDetails(params.id);
  } catch {
    notFound();
  }

  const directors = movie.credits.crew
    .filter((person) => person.job === "Director")
    .map((person) => person.name);
  const topCast = movie.credits.cast.slice(0, 10);
  const backdropUrl = movie.backdrop_path ? `${imageBase}${movie.backdrop_path}` : null;
  const posterUrl = movie.poster_path ? `${imageBase}${movie.poster_path}` : null;

  return (
    <main className="min-h-screen bg-ink text-white">
      <section className="relative border-b border-line">
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={`${movie.title} backdrop`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/85 to-ink/50" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 rounded-md border border-line bg-panel/70 px-3 py-2 text-sm text-zinc-300 transition hover:border-gold hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to search
          </Link>

          <div className="grid gap-8 md:grid-cols-[260px_1fr]">
            <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-line bg-zinc-900 shadow-2xl">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={`${movie.title} poster`}
                  fill
                  priority
                  sizes="260px"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-zinc-500">No poster</div>
              )}
            </div>

            <div className="flex flex-col justify-end pb-1">
              <div className="mb-4 flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-md border border-zinc-600 bg-black/20 px-3 py-1 text-sm text-zinc-200"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{movie.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-300">
                {movie.overview || "Summary not available."}
              </p>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-zinc-300">
                <span>{movie.release_date || "Release date unknown"}</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-gold" aria-hidden="true" />
                  {formatRuntime(movie.runtime)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-gold text-gold" aria-hidden="true" />
                  TMDB details
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_340px] lg:px-8">
        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-xl font-semibold">Cast</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {topCast.length > 0 ? (
                topCast.map((person) => (
                  <div
                    key={`${person.id}-${person.character}`}
                    className="rounded-md border border-line bg-panel p-4"
                  >
                    <p className="font-medium text-white">{person.name}</p>
                    <p className="mt-1 text-sm text-zinc-400">{person.character || "Cast"}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-400">Cast information is not available.</p>
              )}
            </div>
          </div>
        </div>

        <aside className="space-y-4 rounded-md border border-line bg-panel p-5">
          <h2 className="text-xl font-semibold">Movie Details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-zinc-500">Director</dt>
              <dd className="mt-1 text-zinc-100">
                {directors.length > 0 ? directors.join(", ") : "Not available"}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500">Release Date</dt>
              <dd className="mt-1 text-zinc-100">{movie.release_date || "Not available"}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Budget</dt>
              <dd className="mt-1 text-zinc-100">{formatCurrency(movie.budget)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Box Office</dt>
              <dd className="mt-1 text-zinc-100">{formatCurrency(movie.revenue)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Runtime</dt>
              <dd className="mt-1 text-zinc-100">{formatRuntime(movie.runtime)}</dd>
            </div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
