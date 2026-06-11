import { discoverMovies } from "@/lib/tmdb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "A date query parameter is required." },
      { status: 400 }
    );
  }

  try {
    const data = await discoverMovies({
      date,
      genres: searchParams.get("genres") ?? undefined,
      region: searchParams.get("region") ?? undefined,
      cast: searchParams.get("cast") ?? undefined
    });

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch movies.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
