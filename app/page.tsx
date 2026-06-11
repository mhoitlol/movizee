import SearchFilters from "@/components/SearchFilters";
import { getGenres } from "@/lib/tmdb";

export default async function HomePage() {
  const { genres, source } = await getGenres();

  return (
    <main className="min-h-screen bg-ink">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-3 border-b border-line pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold">Movizee</p>
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              Find movies released on a specific date.
            </h1>
            <p className="mt-3 text-base leading-7 text-zinc-400">
              Filter live TMDB results by exact release date, genre, region, and cast.
            </p>
          </div>
        </header>

        <SearchFilters initialGenres={genres} initialSource={source} />
      </div>
    </main>
  );
}
