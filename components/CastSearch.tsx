"use client";

import type { CastPerson } from "@/types/movie";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

type CastSearchProps = {
  value: CastPerson | null;
  query: string;
  onChange: (person: CastPerson | null) => void;
  onQueryChange: (query: string) => void;
};

export default function CastSearch({ value, query, onChange, onQueryChange }: CastSearchProps) {
  const [results, setResults] = useState<CastPerson[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (value && query === value.name) {
      return;
    }

    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await fetch(`/api/cast?query=${encodeURIComponent(query)}`, {
          signal: controller.signal
        });
        const data = (await response.json()) as { people?: CastPerson[] };
        setResults(data.people ?? []);
      } catch (error) {
        if (!controller.signal.aborted) {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query, value]);

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-zinc-300" htmlFor="cast">
        Cast
      </label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
          aria-hidden="true"
        />
        <input
          id="cast"
          className="h-11 w-full rounded-md border border-line bg-panel pl-10 pr-10 text-sm text-white outline-none transition focus:border-gold"
          placeholder="Search actor name"
          value={query}
          onChange={(event) => {
            onQueryChange(event.target.value);
            onChange(null);
          }}
        />
        {value ? (
          <button
            className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            type="button"
            aria-label="Clear selected cast"
            onClick={() => {
              onQueryChange("");
              onChange(null);
              setResults([]);
            }}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {query.length >= 2 && !value ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-md border border-line bg-[#18181d] shadow-2xl">
          {isSearching ? (
            <div className="px-3 py-3 text-sm text-zinc-400">Searching...</div>
          ) : results.length > 0 ? (
            results.map((person) => (
              <button
                key={person.id}
                className="block w-full px-3 py-2 text-left text-sm text-zinc-200 transition hover:bg-zinc-800"
                type="button"
                onClick={() => {
                  onQueryChange(person.name);
                  onChange(person);
                  setResults([]);
                }}
              >
                {person.name}
              </button>
            ))
          ) : (
            <div className="px-3 py-3 text-sm text-zinc-400">No cast found</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
