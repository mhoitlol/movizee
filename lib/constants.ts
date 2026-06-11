import type { Genre, Movie, MovieDetails } from "@/types/movie";

export const REGIONS = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" }
];

export const FALLBACK_GENRES: Genre[] = [
  { id: 28, name: "Action" },
  { id: 18, name: "Drama" },
  { id: 35, name: "Comedy" },
  { id: 53, name: "Thriller" },
  { id: 10749, name: "Romance" }
];

export const SAMPLE_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Sample Action Movie",
    overview: "A sample movie used for local testing.",
    poster_path: null,
    backdrop_path: null,
    release_date: "2024-01-26",
    vote_average: 7.4,
    genre_ids: [28, 18]
  }
];

export const SAMPLE_MOVIE_DETAILS: MovieDetails = {
  id: 1,
  title: "Sample Action Movie",
  overview: "A sample movie used for local testing.",
  poster_path: null,
  backdrop_path: null,
  release_date: "2024-01-26",
  runtime: 142,
  budget: 25000000,
  revenue: 12000000,
  genres: [
    { id: 28, name: "Action" },
    { id: 18, name: "Drama" }
  ],
  credits: {
    cast: [
      {
        id: 101,
        name: "Actor One",
        character: "Lead",
        profile_path: null
      },
      {
        id: 102,
        name: "Actor Two",
        character: "Friend",
        profile_path: null
      }
    ],
    crew: [
      {
        id: 201,
        name: "Director One",
        job: "Director"
      }
    ]
  }
};
