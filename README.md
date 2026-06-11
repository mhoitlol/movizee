# Movizee

A Next.js 14 App Router website for finding movies released on a selected date, with filters for genre, region, and cast.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- TMDB API
- Optional OMDb API helper for future BoxOffice enrichment
- No database; data is fetched live from API

## File Organization

```txt
movie-release-finder/
├── app/
│   ├── page.tsx
│   ├── movie/
│   │   └── [id]/
│   │       └── page.tsx
│   ├── api/
│   │   ├── movies/
│   │   │   └── route.ts
│   │   ├── movie/
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── cast/
│   │       └── route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── SearchFilters.tsx
│   ├── MovieCard.tsx
│   ├── MovieGrid.tsx
│   └── CastSearch.tsx
├── lib/
│   ├── tmdb.ts
│   ├── omdb.ts
│   └── constants.ts
├── types/
│   └── movie.ts
├── .env.local
└── README.md
```

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_TMDB_IMAGE_BASE=https://image.tmdb.org/t/p/w500
TMDB_API_KEY=your_tmdb_api_key
OMDB_API_KEY=your_omdb_api_key_optional
```

The app includes sample fallback data, so it will run without a real TMDB key. Add a real `TMDB_API_KEY` for live results.

## Install and Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## How Search Works

The home page sends requests to `/api/movies`.

If a user selects one date, the API sends the same date to TMDB as:

```txt
release_date.gte=YYYY-MM-DD
release_date.lte=YYYY-MM-DD
```

Genre filters are sent as comma-separated TMDB genre ids:

```txt
with_genres=28,18
```

If a cast name is typed, the UI first calls:

```txt
GET /api/cast?query=actor_name
```

Then it uses the first matching TMDB person id in:

```txt
with_cast=person_id
```

The region dropdown sends:

```txt
region=IN
```

Supported regions are India, United States, United Kingdom, Japan, and South Korea.

## TMDB Endpoints Used

Search movies:

```txt
GET https://api.themoviedb.org/3/discover/movie
```

Movie details:

```txt
GET https://api.themoviedb.org/3/movie/{movie_id}?append_to_response=credits,release_dates
```

Cast search:

```txt
GET https://api.themoviedb.org/3/search/person?query=actor_name
```

Genre list:

```txt
GET https://api.themoviedb.org/3/genre/movie/list
```

## Details Page Logic

- Director is found with `credits.crew.filter((person) => person.job === "Director")`.
- Budget comes from TMDB `budget`.
- Box office comes from TMDB `revenue`.
- If revenue is `0`, the UI shows `Not available`.
- Runtime is formatted from minutes to hours and minutes.

## Sample Fallback Data

The fallback data lives in `lib/constants.ts` and is used when `TMDB_API_KEY` is missing.

```json
[
  {
    "id": 1,
    "title": "Sample Action Movie",
    "release_date": "2024-01-26",
    "region": "IN",
    "genres": ["Action", "Drama"],
    "cast": ["Actor One", "Actor Two"],
    "director": "Director One",
    "summary": "A sample movie used for local testing.",
    "box_office": "₹100 crore"
  }
]
```
