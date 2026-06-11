import { getMovieDetails } from "@/lib/tmdb";
import { NextResponse } from "next/server";

type RouteContext = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const movie = await getMovieDetails(params.id);
    return NextResponse.json({ movie });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to fetch movie details.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
